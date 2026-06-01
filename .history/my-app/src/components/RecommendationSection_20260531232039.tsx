"use client";

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
}

export default function RecommendationSection({
  title,
  type,
  items,
  loading = false,
  error = null,
}: RecommendationSectionProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
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
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {type === "product"
          ? items.map((item) => {
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
          : items.map((item) => {
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
