"use client";

import type {CartItemResponse} from "../../../../types/cartTypes";
import {useEffect, useState} from "react";

interface CartItemRowProps {
  item: CartItemResponse;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onRemove: (id: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
}

function getProduct(item: CartItemResponse) {
  return item.product ?? item.inventory?.product;
}

export default function CartItemRow({
                                      item,
                                      isSelected,
                                      onToggleSelect,
                                      updateQuantity,
                                      onRemove,
                                    }: CartItemRowProps) {
  const product = getProduct(item);
  const price = product?.price ?? 0;
  const name = product?.name ?? "Sản phẩm";
  const image = product?.imageUrl ?? "";
  const lineTotal = price * item.quantity;
  const [quantity, setQuantity] = useState(item.quantity);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // function wait and call Api
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!product?.id) return;

      updateQuantity(product.id, quantity);
    }, 500);

    return () => clearTimeout(timer);
  }, [quantity, product?.id]);

  return (
      <div
          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        {/* Top row: checkbox + image + info */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0 pt-0.5">
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(item.id)}
                className="w-5 h-5 text-blue-600 rounded cursor-pointer focus:ring-2 focus:ring-blue-500"
                aria-label={`Chọn ${name}`}
            />
          </div>

          <div className="flex-shrink-0">
            <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {image ? (
                  <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover"
                  />
              ) : (
                  <span className="text-2xl text-gray-400" aria-hidden>🛒</span>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
              {name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Giá: <span className="font-semibold text-gray-800">{formatCurrency(price)}</span>
            </p>
            <p className="text-sm font-bold text-gray-800 mt-2 sm:hidden">
              {formatCurrency(lineTotal)}
            </p>
          </div>
        </div>

        {/* Bottom row (mobile) / inline (desktop): quantity + total + remove */}
        <div
            className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 pl-9 sm:pl-0">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
            <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuantity((q) => Math.max(0, q - 1));
                }}
                disabled={quantity <= 0}
                className="w-8 h-8 flex items-center justify-center rounded bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-700 font-bold"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold text-gray-800" aria-live="polite">
                {quantity}
            </span>
            <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuantity((q) => q + 1);
                }}
                className="w-8 h-8 flex items-center justify-center rounded bg-white hover:bg-gray-200 transition text-gray-700 font-bold"
            >
              +
            </button>
          </div>

          <div className="hidden sm:block text-right min-w-[6rem]">
            <p className="text-sm font-bold text-gray-800">
              {formatCurrency(lineTotal)}
            </p>
          </div>

          <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove(item.id);
              }}
              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition flex-shrink-0"
              aria-label={`Xóa ${name} khỏi giỏ hàng`}
              title="Xóa khỏi giỏ hàng"
          >
            <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
            >
              <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
  );
}
