"use client";

import {useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {useAuth} from "../context/authContext.tsx";

export default function UserHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const {user} = useAuth();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const navItem =
      "px-4 py-2 rounded-full transition-all duration-300 font-medium flex items-center gap-1";

  const activeItem = "bg-green-500 text-white shadow";

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
            <div className="flex justify-between items-center h-16">

              {/* Left Section: Hamburger + Home */}
              <div className="flex items-center gap-3">

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

              {/* Logo */}
              <Link
                  to="/user/products"
                  className="flex items-center gap-2 text-2xl font-bold tracking-wide hover:scale-105 transition text-green-600"
              >
                🐾 <span>Happy Pet Shop</span>
              </Link>

              {/* Desktop Menu (Right) */}
              <div className="hidden md:flex items-center gap-4">

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

              {/* Mobile button (hamburger fallback) */}
              <button
                  onClick={toggleDropdown}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
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
          </nav>
        </header>
      </>
  );
}
