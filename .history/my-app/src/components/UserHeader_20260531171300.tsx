"use client";

import {useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../context/authContext.tsx";

export default function UserHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"text" | "image">("text");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {user} = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const navItem =
      "px-4 py-2 rounded-full transition-all duration-300 font-medium flex items-center gap-1";

  const activeItem = "bg-green-500 text-white shadow";

  // Debounce 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        // TODO: call API search suggestions
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close suggestions
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
              <div ref={searchRef} className="flex-1 max-w-md hidden md:block relative">
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

              {/* Logo */}
              <Link
                  to="/user/products"
                  className="flex items-center gap-2 text-2xl font-bold tracking-wide hover:scale-105 transition text-green-600 shrink-0"
              >
                🐾 <span className="hidden sm:inline">Happy Pet Shop</span>
              </Link>

              {/* Desktop Menu (Right) */}
              <div className="hidden md:flex items-center gap-4 shrink-0">

                {/* Admin button */}
                <Link
                    to="/admin/login"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-lg"
                    title="Admin Login"
                >
                  🔐
                </Link>

                <Link
                    to="/user/cart"
                    className={`${navItem} ${
                        isActive("/user/cart") ? activeItem : "hover:bg-gray-100"
                    }`}
                >
                  🛒 Giỏ hàng
                </Link>

                {user ? (
                    <>
                      <Link
                          to="/user/invoices"
                          className={`${navItem} ${
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
                    </>
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
