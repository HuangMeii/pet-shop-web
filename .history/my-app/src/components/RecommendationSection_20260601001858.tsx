"use client";

import { Link } from "react-router-dom";
import ProductCard from "../pages/user/ProductsPage/components/ProductCard";
import PetCard from "../pages/user/PetsPage/components/PetCard";
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
                <div key={pet.id} className="min-w-[250px] max-w-[250px] shrink-0">
                  <PetCard pet={pet} />
                </div>
              );
            })}
      </div>
    </div>
  );
}
