"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { getInfo } from "@/services/customerService";
import { addOrUpdateCartItem } from "@/services/cartService";
import { getAllProducts } from "@/services/productService";
import { getAllPets } from "@/services/petService";
import { getRecommendations } from "@/services/recommendationService";
import ProductCard from "@/pages/user/ProductsPage/components/ProductCard";
import type { ProductResponse } from "@/types/productTypes";
import type { PetResponse } from "@/types/petTypes";

type TabType = "all" | "products" | "pets";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value ?? 0);
}

interface PetProductCardProps {
  pet: PetResponse;
}

function PetProductCard({ pet }: PetProductCardProps) {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const available = pet.available !== false;

  const handleAddToCart = async () => {
    if (!available) return;
    if (!user?.id) {
      setCartMessage("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }
    setCartLoading(true);
    setCartMessage(null);
    try {
      await addOrUpdateCartItem(user.id, { productId: pet.id, quantity: 1 });
      await getInfo().then(setUser);
      setCartMessage("Đã thêm vào giỏ hàng!");
      setTimeout(() => setCartMessage(null), 2000);
    } catch {
      setCartMessage("Không thể thêm vào giỏ hàng");
    } finally {
      setCartLoading(false);
    }
  };

  const handlePayment = () => {
    if (!available) return;
    const checkoutItem = {
      id: pet.id,
      productId: pet.id,
      name: pet.name,
      price: pet.price,
      quantity: 1,
      image: pet.imageUrl ?? "",
      isSelected: true,
    };
    sessionStorage.setItem("checkoutItems", JSON.stringify([checkoutItem]));
    navigate("/payment?source=product");
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      <Link to={`/user/detailedProduct/${pet.id}`} className="block relative">
        <div className="relative h-36 bg-gray-200 overflow-hidden cursor-pointer flex items-center justify-center">
          {pet.imageUrl ? (
            <img
              src={pet.imageUrl}
              alt={pet.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
          ) : (
            <span className="text-5xl text-gray-400" aria-hidden>🐕</span>
          )}

          {/* Wishlist heart icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted((prev) => !prev);
            }}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition shadow-sm"
            title={isWishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
            aria-label={isWishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          >
            <span className={`text-lg transition ${isWishlisted ? "text-red-500" : "text-gray-400"}`}>
              {isWishlisted ? "❤️" : "♡"}
            </span>
          </button>
        </div>
      </Link>

      <div className="p-3 flex-grow flex flex-col">
        <Link to={`/detailedProduct/${pet.id}`}>
          <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2 hover:text-blue-600 transition-colors leading-tight">
            {pet.name}
          </h3>
        </Link>

        {cartMessage && (
          <p className="text-xs mb-1 text-blue-600 font-medium">{cartMessage}</p>
        )}

        <p className="text-xs text-gray-400 mb-2">
          {pet.species} · {pet.breed}
        </p>

        <div className="border-t pt-2 mt-auto flex items-center justify-between">
          <span className="text-base font-bold text-blue-600">
            {formatCurrency(pet.price ?? 0)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={!available || cartLoading}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#E8847A]/20 text-[#E8847A] hover:bg-[#E8847A]/30 transition disabled:bg-gray-200 disabled:text-gray-400"
              aria-label={`Thêm ${pet.name} vào giỏ hàng`}
              title="Thêm vào giỏ hàng"
            >
              {cartLoading ? (
                <span className="text-xs">...</span>
              ) : (
                <span className="text-base">🛒</span>
              )}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePayment();
              }}
              disabled={!available}
              className="bg-[#E8847A] hover:bg-[#d9736a] text-white text-xs font-semibold py-1.5 px-4 rounded-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              aria-label={`Thanh toán cho ${pet.name}`}
            >
              Mua
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [pets, setPets] = useState<PetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [productsData, petsData, recData] = await Promise.all([
          getAllProducts(),
          getAllPets(),
          getRecommendations({ userId: user?.id, limit: 20 }),
        ]);

        const prodMap = new Map(productsData.map((p) => [p.id, p]));
        const petMap = new Map((Array.isArray(petsData) ? petsData : []).map((p) => [p.id, p]));

        const mappedProducts = recData.products
          .map((r) => prodMap.get(r.id))
          .filter((p): p is ProductResponse => p != null);

        const mappedPets = recData.pets
          .map((r) => petMap.get(r.id))
          .filter((p): p is PetResponse => p != null);

        setProducts(
          mappedProducts.length > 0
            ? mappedProducts
            : productsData.sort(() => Math.random() - 0.5).slice(0, 12)
        );
        setPets(mappedPets);
      } catch {
        setError("Không thể tải đề xuất. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const tabs: { key: TabType; label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "products", label: "Sản phẩm" },
    { key: "pets", label: "Thú cưng" },
  ];

  const allItems = useMemo(() => {
    const items: { type: "product" | "pet"; data: ProductResponse | PetResponse }[] = [];
    products.forEach((p) => items.push({ type: "product" as const, data: p }));
    pets.forEach((p) => items.push({ type: "pet" as const, data: p }));
    return items;
  }, [products, pets]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Đề xuất cho bạn</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-72 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Đề xuất cho bạn</h1>
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">{error}</p>
            <Link
              to="/user/products"
              className="inline-block mt-4 text-[#ff8e53] hover:text-[#ff7a3d] font-semibold"
            >
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Đề xuất cho bạn</h1>
          <Link
            to="/user/products"
            className="text-sm font-semibold text-[#ff8e53] hover:text-[#ff7a3d] transition-colors"
          >
            ← Quay lại trang chủ
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                activeTab === tab.key
                  ? "bg-[#ff8e53] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "all" && allItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {allItems.map((item) =>
              item.type === "product" ? (
                <ProductCard
                  key={item.data.id}
                  id={item.data.id}
                  name={(item.data as ProductResponse).name}
                  price={(item.data as ProductResponse).price}
                  image={(item.data as ProductResponse).imageUrl ?? ""}
                  availableAmount={(item.data as ProductResponse).quantity}
                  purchaseCount={(item.data as ProductResponse).purchaseCount ?? 0}
                />
              ) : (
                <PetProductCard key={item.data.id} pet={item.data as PetResponse} />
              )
            )}
          </div>
        )}

        {/* Products only */}
        {activeTab === "products" && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.imageUrl ?? ""}
                availableAmount={product.quantity}
                purchaseCount={product.purchaseCount ?? 0}
              />
            ))}
          </div>
        )}

        {/* Pets only */}
        {activeTab === "pets" && pets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <PetProductCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}

        {allItems.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Chưa có đề xuất
            </h2>
            <p className="text-gray-600 mb-6">
              Hiện chưa có đề xuất nào dành cho bạn. Hãy quay lại sau!
            </p>
            <Link
              to="/user/products"
              className="inline-block bg-[#ff8e53] hover:bg-[#ff7a3d] text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
