"use client";

import {useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../context/authContext.tsx";

export default function UserHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"text" | "image">("text");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {user} = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const storeRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const navItem =
      "px-4 py-2 rounded-full transition-all duration-300 font-medium flex items-center gap-1";

  const activeItem = "bg-green-500 text-white shadow";

  // Cart items count
  const cartItems = user?.cart?.cartItems ?? [];
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
      (sum, item) => sum + (item.product?.price ?? item.inventory?.product?.price ?? 0) * item.quantity,
      0
  );

  // Mock notifications
  const notifications = [
    {id: 1, type: "order", message: "Đơn hàng #123 đã được xác nhận", time: "2 phút trước"},
    {id: 2, type: "system", message: "Khuyến mãi cuối tuần - Giảm 15%", time: "1 giờ trước"},
    {id: 3, type: "order", message: "Đơn hàng #120 đang được giao", time: "3 giờ trước"},
  ];

  // Debounce 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setShowCartPreview(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotification(false);
      }
      if (storeRef.current && !storeRef.current.contains(e.target as Node)) {
        setShowStoreDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchType === "image") {
      // TODO: handle image search
      console.log("Image search:", searchQuery);
    } else {
      navigate(`/user/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const toggleSearchType = () => {
    setSearchType((prev) => (prev === "text" ? "image" : "text"));
  };

  return (
      <>
        <style>
          {`
              header {
                font-family: Fredoka, sans-serif;
              }
            `}
        </style>
        <header
            className="sticky top-0 w-full z-50 bg-white border-b border-gray-200 text-gray-800 shadow-sm"
        >
          <nav className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16 gap-4">

              {/* Left Section: Hamburger + Home */}
              <div className="flex items-center gap-3 shrink-0">

                {/* Hamburger menu */}
                <div className="relative">
                  <button
                      onClick={toggleDropdown}
                      className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                      title="Danh mục"
                  >
                    <svg
                        className="h-6 w-6"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {isDropdownOpen && (
                      <div
                          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                          onMouseLeave={() => setIsDropdownOpen(false)}
                      >
                        <Link
                            to="/user/pets"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-3 hover:bg-green-50 hover:text-green-600 transition rounded-lg mx-1"
                        >
                          🐕 Thú cưng
                        </Link>
                        <Link
                            to="/user/products"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-3 hover:bg-green-50 hover:text-green-600 transition rounded-lg mx-1"
                        >
                          🦴 Sản phẩm
                        </Link>
                        <Link
                            to="/user/services"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-3 hover:bg-green-50 hover:text-green-600 transition rounded-lg mx-1"
                        >
                          🛁 Dịch vụ
                        </Link>
                      </div>
                  )}
                </div>

                {/* Home */}
                <Link
                    to="/user/products"
                    className={`${navItem} ${
                        isActive("/user/products") ? activeItem : "hover:bg-gray-100"
                    }`}
                >
                  🏠 Trang chủ
                </Link>
              </div>

              {/* Center Section: Search */}
              <div ref={searchRef} className="flex-1 max-w-lg hidden md:block relative">
                <form onSubmit={handleSearch} className="relative">
                  <div
                      className="flex items-center bg-gray-100 rounded-full border border-gray-200 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all overflow-hidden">
                    {/* Search icon */}
                    <span className="pl-4 text-gray-400 text-lg">🔍</span>

                    {/* Input */}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => {
                          if (searchQuery.trim()) setShowSuggestions(true);
                        }}
                        placeholder={
                          searchType === "text"
                              ? "Tìm kiếm sản phẩm..."
                              : "Tìm kiếm bằng hình ảnh..."
                        }
                        className="flex-1 px-3 py-2.5 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                    />

                    {/* Camera icon - toggle search type */}
                    <button
                        type="button"
                        onClick={toggleSearchType}
                        className={`p-2 transition ${
                            searchType === "image"
                                ? "text-green-500 bg-green-50"
                                : "text-gray-400 hover:text-gray-600"
                        }`}
                        title={searchType === "text" ? "Tìm bằng hình ảnh" : "Tìm bằng text"}
                    >
                      📷
                    </button>

                    {/* Clear button */}
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="pr-3 text-gray-400 hover:text-gray-600 transition"
                            aria-label="Xóa tìm kiếm"
                        >
                          ✕
                        </button>
                    )}
                  </div>
                </form>

                {/* Suggestions dropdown */}
                {showSuggestions && searchQuery.trim() && (
                    <div
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto">
                      <div className="px-4 py-2 text-xs text-gray-400 font-medium">
                        Gợi ý tìm kiếm
                      </div>
                      {/* TODO: render suggestions from API */}
                      <button
                          onClick={() => {
                            navigate(`/user/products?search=${encodeURIComponent(searchQuery.trim())}`);
                            setShowSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition text-sm"
                      >
                        🔍 Tìm "{searchQuery}"
                      </button>
                    </div>
                )}
              </div>

              {/* Right Section: Actions */}
              <div className="flex items-center gap-2 shrink-0">

                {/* 🔐 Admin */}
                <Link
                    to="/admin/login"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-lg"
                    title="Admin Login"
                >
                  🔐
                </Link>

                {/* ❤️ Wishlist */}
                <Link
                    to="/user/wishlist"
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 transition text-lg text-gray-600"
                    title="Yêu thích"
                >
                  ❤️
                </Link>

                {/* 🛍️ Store - link thẳng đến trang tất cả */}
                <Link
                    to="/user/products"
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-lg text-gray-600"
                    title="Cửa hàng"
                >
                  🛍️
                </Link>

                {/* 🔔 Notification */}
                <div ref={notifRef} className="relative">
                  <button
                      onClick={() => setShowNotification(!showNotification)}
                      className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-lg text-gray-600"
                      title="Thông báo"
                  >
                    🔔
                    {notifications.length > 0 && (
                        <span
                            className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow">
                      {notifications.length}
                    </span>
                    )}
                  </button>

                  {showNotification && (
                      <div
                          className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                          onMouseLeave={() => setShowNotification(false)}
                      >
                        <div className="px-4 py-2 text-xs text-gray-400 font-medium border-b border-gray-100">
                          Thông báo
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {notifications.map((notif) => (
                              <button
                                  key={notif.id}
                                  onClick={() => setShowNotification(false)}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0"
                              >
                                <div className="flex items-start gap-3">
                                  <span className="text-lg mt-0.5">
                                    {notif.type === "order" ? "📦" : "🔔"}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700">{notif.message}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
                                  </div>
                                </div>
                              </button>
                          ))}
                        </div>
                        <Link
                            to="/user/notifications"
                            onClick={() => setShowNotification(false)}
                            className="block text-center text-sm text-green-600 font-medium py-3 hover:bg-green-50 rounded-b-xl transition"
                        >
                          Xem tất cả
                        </Link>
                      </div>
                  )}
                </div>

                {/* 🛒 Cart */}
                <div ref={cartRef} className="relative">
                  <button
                      onClick={() => setShowCartPreview(!showCartPreview)}
                      className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-lg text-gray-600"
                      title="Giỏ hàng"
                  >
                    🛒
                    {cartCount > 0 && (
                        <span
                            className="absolute -top-0.5 -right-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                    )}
                  </button>

                  {showCartPreview && (
                      <div
                          className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                          onMouseLeave={() => setShowCartPreview(false)}
                      >
                        <div className="px-4 py-2 text-xs text-gray-400 font-medium border-b border-gray-100">
                          Giỏ hàng ({cartCount} sản phẩm)
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-400 text-sm">
                              🛒 Giỏ hàng trống
                            </div>
                        ) : (
                            <>
                              <div className="max-h-60 overflow-y-auto">
                                {cartItems.slice(0, 4).map((item) => {
                                  const product = item.product ?? item.inventory?.product;
                                  return (
                                      <div
                                          key={item.id}
                                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0"
                                      >
                                        <div
                                            className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg shrink-0">
                                          🦴
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm text-gray-700 truncate font-medium">
                                            {product?.name ?? "Sản phẩm"}
                                          </p>
                                          <p className="text-xs text-gray-400">
                                            SL: {item.quantity} × {product?.price?.toLocaleString() ?? 0}đ
                                          </p>
                                        </div>
                                        <p className="text-sm font-semibold text-green-600 shrink-0">
                                          {(product?.price ?? 0) * item.quantity > 0
                                              ? `${((product?.price ?? 0) * item.quantity).toLocaleString()}đ`
                                              : "0đ"}
                                        </p>
                                      </div>
                                  );
                                })}
                                {cartItems.length > 4 && (
                                    <div className="px-4 py-2 text-center text-xs text-gray-400">
                                      + {cartItems.length - 4} sản phẩm khác
                                    </div>
                                )}
                              </div>

                              <div className="border-t border-gray-100 px-4 py-3">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-sm text-gray-600">Tạm tính:</span>
                                  <span className="text-base font-bold text-green-600">
                                    {cartTotal.toLocaleString()}đ
                                  </span>
                                </div>
                                <Link
                                    to="/user/cart"
                                    onClick={() => setShowCartPreview(false)}
                                    className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl transition text-sm"
                                >
                                  Xem giỏ hàng & Thanh toán
                                </Link>
                              </div>
                            </>
                        )}
                      </div>
                  )}
                </div>

                {/* Auth */}
                {user ? (
                    <div className="flex items-center gap-1">
                      <Link
                          to="/user/invoices"
                          className={`${navItem} hidden lg:flex ${
                              isActive("/user/invoices") ? activeItem : "hover:bg-gray-100"
                          }`}
                      >
                        🧾 Hóa đơn
                      </Link>
                      <Link
                          to="/user/profile"
                          className={`${navItem} ${
                              isActive("/user/profile") ? activeItem : "hover:bg-gray-100"
                          }`}
                      >
                        🐶 Tài khoản
                      </Link>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className={`${navItem} hover:bg-gray-100`}
                    >
                      🔑 Đăng nhập
                    </Link>
                )}

              </div>

              {/* Mobile: search icon + hamburger */}
              <div className="md:hidden flex items-center gap-2">
                <Link
                    to="/user/products?search="
                    className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                    title="Tìm kiếm"
                >
                  <span className="text-xl">🔍</span>
                </Link>
                <button
                    onClick={toggleDropdown}
                    className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                >
                  <svg
                      className="h-6 w-6"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </nav>
        </header>
      </>
  );
}
