"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { getAllProducts } from "@/services/productService";
import { getAllPets } from "@/services/petService";
import { getRecommendations } from "@/services/recommendationService";
import ProductCard from "@/pages/user/ProductsPage/components/ProductCard";
import PetCard from "@/pages/user/PetsPage/components/PetCard";
import type { ProductResponse } from "@/types/productTypes";
import type { PetResponse } from "@/types/petTypes";

export default function RecommendationsPage() {
  const { user } = useAuth();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Đề xuất cho bạn</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Đề xuất cho bạn</h1>
          <Link
            to="/user/products"
            className="text-sm font-semibold text-[#ff8e53] hover:text-[#ff7a3d] transition-colors"
          >
            ← Quay lại trang chủ
          </Link>
        </div>

        {/* Recommended Products */}
        {products.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🛍️ Sản phẩm đề xuất</h2>
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
          </section>
        )}

        {/* Recommended Pets */}
        {pets.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🐾 Thú cưng đề xuất</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          </section>
        )}

        {products.length === 0 && pets.length === 0 && (
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
