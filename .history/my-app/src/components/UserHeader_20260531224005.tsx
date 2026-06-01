"use client";

import {useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../context/authContext.tsx";

export default function UserHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"text" | "image">("text");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {user} = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setActiveSubmenu(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const navItem =
      "px-4 py-2 rounded-full transition-all duration-300 font-medium flex items-center gap-1";

  const activeItem = "bg-green-500 text-white shadow";

  // Cart items count
  const cartItems = user?.cart?.cartItems ?? [];
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

  // Click outside to close search suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
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
                          ref={dropdownRef}
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                          onMouseLeave={() => {
                            setIsDropdownOpen(false);
                            setActiveSubmenu(null);
                          }}
                      >
                        {/* 🐕 Thú cưng */}
                        <div
                            className="relative"
                            onMouseEnter={() => setActiveSubmenu("pets")}
                            onMouseLeave={() => setActiveSubmenu(null)}
                        >
                          <Link
                              to="/user/pets"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center justify-between px-4 py-3 hover:bg-green-50 hover:text-green-600 transition rounded-lg mx-1"
                          >
                            <span>🐕 Thú cưng</span>
                            <span className="text-xs text-gray-400">▶</span>
                          </Link>
                          {activeSubmenu === "pets" && (
                              <div className="absolute left-full top-0 ml-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                <Link
                                    to="/user/pets?species=dog"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition text-sm"
                                >
                                  🐶 Chó
                                </Link>
                                <Link
                                    to="/user/pets?species=cat"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition text-sm"
                                >
                                  🐱 Mèo
                                </Link>
                                <Link
                                    to="/user/pets?species=other"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition text-sm"
                                >
                                  🐰 Thỏ & Hamster
                                </Link>
                                <div className="border-t border-gray-100 my-1"></div>
                                <Link
                                    to="/user/pets"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition text-sm font-medium"
                                >
                                  📋 Tất cả thú cưng
                                </Link>
                              </div>
                          )}
                        </div>

                        {/* 🦴 Sản phẩm */}
                        <div
                            className="relative"
                            onMouseEnter={() => setActiveSubmenu("products")}
                            onMouseLeave={() => setActiveSubmenu(null)}
                        >
                          <Link
                              to="/user/products"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center justify-between px-4 py-3 hover:bg-green-50 hover:text-green-600 transition rounded-lg mx-1"
                          >
                            <span>🦴 Sản phẩm</span>
                            <span className="text-xs text-gray-400">▶</span>
                          </Link>
                          {activeSubmenu === "products" && (
                              <div className="absolute left-full top-0 ml-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                <Link
                                    to="/user/products?category=favorite"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition text-sm"
                                >
                                  ❤️ Yêu thích
                                </Link>
                                <Link
                                    to="/user/products?category=bestseller"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition text-sm"
                                >
                                  🔥 Mua nhiều
                                </Link>
                                <Link
                                    to="/user/products?category=toprated"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition text-sm"
                                >
                                  🌟 Đánh giá cao
                                </Link>
                                <Link
                                    to="/user/products?category=newest"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition text-sm"
                                >
                                  🆕 Mới nhất
                                </Link>
                                <div className="border-t border-gray-100 my-1"></div>
                                <Link
                                    to="/user/products"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition text-sm font-medium"
                                >
                                  📋 Tất cả sản phẩm
                                </Link>
                              </div>
                          )}
                        </div>

                        {/* 🛁 Dịch vụ */}
                        <div
                            className="relative"
                            onMouseEnter={() => setActiveSubmenu("services")}
                            onMouseLeave={() => setActiveSubmenu(null)}
                        >
                          <Link
                              to="/user/services"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center justify-between px-4 py-3 hover:bg-green-50 hover:text-green-600 transition rounded-lg mx-1"
                          >
                            <span>🛁 Dịch vụ</span>
                            <span className="text-xs text-gray-400">▶</span>
                          </Link>
                          {activeSubmenu === "services" && (
                              <div className="absolute left-full top-0 ml-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                <Link
                                    to="/user/services?type=grooming"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition text-sm"
                                >
                                  🛀 Tắm & Chăm sóc
                                </Link>
                                <Link
                                    to="/user/services?type=health"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition text-sm"
                                >
                                  🩺 Khám sức khỏe
                                </Link>
                                <Link
                                    to="/user/services?type=training"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition text-sm"
                                >
                                  🎓 Huấn luyện
                                </Link>
                                <Link
                                    to="/user/services?type=boarding"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition text-sm"
                                >
                                  🏠 Lưu trú
                                </Link>
                                <div className="border-t border-gray-100 my-1"></div>
                                <Link
                                    to="/user/services"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition text-sm font-medium"
                                >
                                  📋 Tất cả dịch vụ
                                </Link>
                              </div>
                          )}
                        </div>
                      </div>
                  )}
                          : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title="Thông báo"
                >
                  <span className="text-lg leading-none">🔔</span>

                  {notifications.length > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-red-500 text-white
                                text-[10px] font-bold rounded-full
                                min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow"
                    >
                      {notifications.length}
                    </span>
                  )}
                </Link>

                {/* Auth */}
                {user ? (
                    <div className="flex items-center gap-1">
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
