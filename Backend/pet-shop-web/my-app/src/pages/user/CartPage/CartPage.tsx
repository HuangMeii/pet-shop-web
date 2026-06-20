"use client";

import { Link } from "react-router-dom";
import CartItemRow from "./components/CartItemRow";
import CartSummary from "./components/CartSummary";
import SelectAllBar from "./components/SelectAllBar";
import { useCart } from "./useCart";

export default function CartPage() {
  const {
    items,
    selection,
    allSelected,
    loading,
    error,
    isAuthenticated,
    toggleSelect,
    selectAll,
    updateQuantity,
    removeItem,
    checkout,
  } = useCart();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🛒 Giỏ Hàng</h1>
          <p className="text-gray-600">
            Bạn có <span className="font-bold text-gray-800">{items.length}</span> sản phẩm trong giỏ hàng
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Not logged in */}
        {!isAuthenticated && (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập để xem giỏ hàng</h2>
            <p className="text-gray-600 mb-6">Vui lòng đăng nhập để quản lý giỏ hàng của bạn</p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
            >
              Đăng nhập
            </Link>
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg px-6 py-4 shadow-lg">Đang cập nhật...</div>
          </div>
        )}

        {/* Empty Cart State (when logged in but no items) */}
        {isAuthenticated && items.length === 0 && !loading ? (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">🛍️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-6">Chưa có sản phẩm nào trong giỏ hàng của bạn</p>
            <Link
              to="/user/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
            >
              Quay lại mua sắm
            </Link>
          </div>
        ) : isAuthenticated && items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-4">
              {/* Select All Bar */}
              <SelectAllBar
                items={items}
                selection={selection}
                allSelected={allSelected}
                onSelectAll={selectAll}
              />

              {/* Cart Items List */}
              <div className="space-y-3">
                {[...items]
                    .sort((a, b) =>
                        (a.product?.name ?? "").localeCompare(b.product?.name ?? "", "vi")
                    )
                    .map((item) => (
                        <CartItemRow
                            key={item.id}
                            item={item}
                            isSelected={selection[item.id] ?? true}
                            onToggleSelect={toggleSelect}
                            onRemove={removeItem}
                            updateQuantity={updateQuantity}
                        />
                    ))}
              </div>

              {/* Continue Shopping CTA */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/user/products"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>

            {/* Cart Summary Sidebar */}
            <div className="lg:col-span-1">
              <CartSummary items={items} selection={selection} onCheckout={checkout} />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
