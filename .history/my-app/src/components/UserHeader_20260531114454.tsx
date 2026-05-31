"use client";

import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {useAuth} from "../context/authContext.tsx";

export default function UserHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const {user} = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollY) setShowHeader(false);
      else setShowHeader(true);

      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItem =
      "px-4 py-2 rounded-full transition-all duration-300 font-medium flex items-center gap-1";

  const activeItem = "bg-white text-blue-600 shadow";

  return (
      <>
        <style>
          <style>
            {`
              header {
                font-family: Fredoka, sans-serif;
              }
            `}
          </style>
        </style>
        <header
            className={`sticky top-0 w-full z-50 backdrop-blur-md bg-gradient-to-r from-[#ff8e53] via-[#ff9a5a] to-[#ffb347]border-b border-white/30text-white shadow-lg transition-all duration-300
          ${showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
        >
          <nav className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">

              {/* Logo */}
              <Link
                  to="/user/products"
                  className="flex items-center gap-2 text-2xl font-bold tracking-wide hover:scale-105 transition"
              >
                🐾 <span>Happy Pet Shop</span>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-4">

                <Link
                    to="/user/products"
                    className={`${navItem} ${
                        isActive("/user/products") ? activeItem : "hover:bg-white/20"
                    }`}
                >
                  🦴 Sản phẩm
                </Link>

                <Link
                    to="/user/pets"
                    className={`${navItem} ${
                        isActive("/user/pets") ? activeItem : "hover:bg-white/20"
                    }`}
                >
                  🐕 Thú cưng
                </Link>

                {/*<Link*/}
                {/*    to="/user/services"*/}
                {/*    className={`${navItem} ${*/}
                {/*        isActive("/user/services") ? activeItem : "hover:bg-white/20"*/}
                {/*    }`}*/}
                {/*>*/}
                {/*  🛁 Dịch vụ*/}
                {/*</Link>*/}

                <Link
                    to="/user/cart"
                    className={`${navItem} ${
                        isActive("/user/cart") ? activeItem : "hover:bg-white/20"
                    }`}
                >
                  🛒 Giỏ hàng
                </Link>

                {user ? (
                    <>
                      <Link
                          to="/user/invoices"
                          className={`${navItem} ${
                              isActive("/user/invoices") ? activeItem : "hover:bg-white/20"
                          }`}
                      >
                        🧾 Hóa đơn
                      </Link>
                      <Link
                        to="/user/profile"
                        className={`${navItem} ${
                            isActive("/user/profile") ? activeItem : "hover:bg-white/20"
                        }`}
                      >
                        🐶 Tài khoản
                      </Link>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className={`${navItem} hover:bg-white/20`}
                    >
                      🔑 Đăng nhập
                    </Link>
                )}

              </div>

              {/* Mobile button */}
              <button
                  onClick={toggleMenu}
                  className="md:hidden p-2 rounded-lg hover:bg-white/20 transition"
              >
                <svg
                    className="h-6 w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                  )}
                </svg>
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden pb-4 pt-2 space-y-2">

                  <Link
                      to="/user/products"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block ${navItem} ${
                          isActive("/user/products") ? activeItem : "hover:bg-white/20"
                      }`}
                  >
                    🦴 Sản phẩm
                  </Link>

                  <Link
                      to="/user/pets"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block ${navItem} ${
                          isActive("/user/pets") ? activeItem : "hover:bg-white/20"
                      }`}
                  >
                    🐕 Thú cưng
                  </Link>

                  {/*<Link*/}
                  {/*    to="/user/services"*/}
                  {/*    onClick={() => setIsMenuOpen(false)}*/}
                  {/*    className={`block ${navItem} ${*/}
                  {/*        isActive("/user/services") ? activeItem : "hover:bg-white/20"*/}
                  {/*    }`}*/}
                  {/*>*/}
                  {/*  🛁 Dịch vụ*/}
                  {/*</Link>*/}

                  <Link
                      to="/user/cart"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block ${navItem} ${
                          isActive("/user/cart") ? activeItem : "hover:bg-white/20"
                      }`}
                  >
                    🛒 Giỏ hàng
                  </Link>

                  {user ? (
                      <>
                        <Link
                            to="/user/invoices"
                            onClick={() => setIsMenuOpen(false)}
                            className={`block ${navItem} ${
                                isActive("/user/invoices") ? activeItem : "hover:bg-white/20"
                            }`}
                        >
                          🧾 Hóa đơn
                        </Link>
                        <Link
                            to="/user/profile"
                            onClick={() => setIsMenuOpen(false)}
                            className={`block ${navItem} ${
                                isActive("/user/profile") ? activeItem : "hover:bg-white/20"
                            }`}
                        >
                          🐶 Tài khoản
                        </Link>
                      </>
                  ) : (
                      <Link
                          to="/login"
                          onClick={() => setIsMenuOpen(false)}
                          className={`block ${navItem} hover:bg-white/20`}
                      >
                        🔑 Đăng nhập
                      </Link>
                  )}

                </div>
            )}
          </nav>
        </header>
      </>
  );
}