"use client";

import type { PetResponse } from "../../../../types/petTypes";

interface PetCardProps {
  pet: PetResponse;
  onClick?: () => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value ?? 0);
}

function formatDate(s: string): string {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("vi-VN");
  } catch {
    return s;
  }
}

export default function PetCard({ pet, onClick }: PetCardProps) {
  const available = pet.available !== false;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => (e.key === "Enter" || e.key === " ") && onClick() : undefined}
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="relative h-64 bg-gray-100 overflow-hidden flex items-center justify-center">
        {pet.imageUrl ? (
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl text-gray-300" aria-hidden>
            🐕
          </span>
        )}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold ${
            available ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"
          }`}
        >
          {available ? "Còn hàng" : "Đã bán"}
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
          {pet.name ?? "—"}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {pet.species ?? "—"} · {pet.breed ?? "—"}
        </p>
        <p className="text-xs text-gray-500 mb-2">
          Giới tính: {pet.gender ?? "—"} · Sinh: {formatDate(pet.birth ?? "")}
        </p>
        <p className="text-xs text-gray-500 mb-3">
          {pet.vaccinated ? "✅ Đã tiêm phòng" : "⚠️ Chưa tiêm phòng"}
        </p>

        <div className="mt-auto pt-3 border-t border-gray-100">
          <span className="text-xl font-bold text-[#ff8e53]">
            {formatCurrency(pet.price ?? 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
