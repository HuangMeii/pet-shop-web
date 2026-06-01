"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getInfo } from "../services/customerService";
import { addOrUpdateCartItem } from "../services/cartService";
import ProductCard from "../pages/user/ProductsPage/components/ProductCard";
import type { ProductResponse } from "../types/productTypes";
import type { PetResponse } from "../types/petTypes";

interface RecommendationSectionProps {
  title: string;
  type: "product" | "pet";
  items: (ProductResponse | PetResponse)[];
  loading?: boolean;
  error?: string | null;
  maxItems?: number;
  viewAllLink?: string;
}

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

export default function RecommendationSection({
  title,
  type,
  items,
  loading = false,
  error = null,
  maxItems,
  viewAllLink,
}: RecommendationSectionProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[200px] h-64 bg-gray-100 rounded-xl animate-pulse shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {viewAllLink && items.length > (maxItems ?? items.length) && (
          <Link
            to={viewAllLink}
            className="text-sm font-semibold text-[#ff8e53] hover:text-[#ff7a3d] transition-colors"
          >
            Xem tất cả →
          </Link>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {type === "product"
          ? displayItems.map((item) => {
              const product = item as ProductResponse;
              return (
                <div key={product.id} className="min-w-[200px] max-w-[200px] shrink-0">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.imageUrl ?? ""}
                    availableAmount={product.quantity}
                    purchaseCount={product.purchaseCount ?? 0}
                  />
                </div>
              );
            })
          : displayItems.map((item) => {
              const pet = item as PetResponse;
              return (
                <div key={pet.id} className="min-w-[200px] max-w-[200px] shrink-0">
                  <PetProductCard pet={pet} />
                </div>
              );
            })}
      </div>
    </div>
  );
}
