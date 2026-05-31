"use client";

import type { CartItemResponse } from "../../../../types/cartTypes";

interface CartSummaryProps {
  items: CartItemResponse[];
  selection: Record<string, boolean>;
  onCheckout: () => void;
}

function getPrice(item: CartItemResponse): number {
  return item.product?.price ?? item.inventory?.product?.price ?? 0;
}

export default function CartSummary({ items, selection, onCheckout }: CartSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const isSelected = (item: CartItemResponse) => selection[item.id] ?? true;
  const selectedItems = items.filter((item) => isSelected(item));
  const subtotal = selectedItems.reduce((sum, item) => sum + getPrice(item) * item.quantity, 0);
  const shippingFee = subtotal > 0 ? 30000 : 0; // Free shipping for order > 0
  const grandTotal = subtotal + shippingFee;
  const selectedCount = selectedItems.length;
  const selectedQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const isDisabled = selectedItems.length === 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-20">
      {/* Header */}
      <h2 className="text-lg font-bold text-gray-800 mb-6">Tóm tắt đơn hàng</h2>

      {/* Items Info */}
      {!isDisabled && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">{selectedCount}</span> sản phẩm đã chọn (
            <span className="font-semibold text-gray-800">{selectedQuantity}</span> cái)
          </p>
        </div>
      )}

      {/* Subtotal */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-600">Tạm tính:</span>
        <span className="font-semibold text-gray-800">
          {formatCurrency(subtotal)}
        </span>
      </div>

      {/* Shipping Fee */}
      {subtotal > 0 && (
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">Phí vận chuyển:</span>
          <span className="font-semibold text-gray-800">
            {formatCurrency(shippingFee)}
          </span>
        </div>
      )}

      {/* Grand Total */}
      <div className="flex justify-between items-center mb-6 pb-6 border-t border-gray-200 pt-4">
        <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
        <span className="text-2xl font-bold text-red-600">
          {formatCurrency(grandTotal)}
        </span>
      </div>

      {/* Empty State Message */}
      {isDisabled && (
        <div className="text-center mb-4 py-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Vui lòng chọn sản phẩm để thanh toán</p>
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={isDisabled}
        className={`w-full py-3 px-4 rounded-lg font-bold transition transform focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700 text-white hover:scale-105 focus:ring-red-500"
        }`}
        aria-label="Thanh toán"
      >
        💳 Thanh toán ({selectedCount > 0 ? selectedCount : 0})
      </button>

      {/* Continue Shopping Link */}
      <a
        href="/products"
        className="block text-center mt-4 text-blue-600 hover:text-blue-700 text-sm font-semibold transition"
      >
        ← Tiếp tục mua sắm
      </a>
    </div>
  );
}
