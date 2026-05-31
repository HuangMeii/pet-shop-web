"use client";

import {useEffect, useState} from "react";
import {useLogin} from "./useLogin.ts";
import Loader from "../../components/ui/loader.tsx";
import {Link, useLocation} from "react-router-dom";

export default function LoginPage() {
  const {
    username,
    password,
    errors,
    isLoading,
    setUsername,
    setPassword,
    handleSubmit,
    clearError,
  } = useLogin();
  const location = useLocation();
  const notAdmin = !location.pathname.includes("/admin");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "auto";
  }, [isLoading]);

  return (
      <div
          className="min-h-screen bg-gradient-to-br from-emerald-100 via-sky-100 to-indigo-100 flex items-center justify-center px-4 relative overflow-hidden">

        {/* Paw decoration */}
        <div className="absolute text-7xl opacity-10 top-10 left-10">🐾</div>
        <div className="absolute text-7xl opacity-10 bottom-20 right-20">🐾</div>
        <div className="absolute text-6xl opacity-10 top-1/2 left-1/4">🐾</div>

        {/* Loader overlay */}
        {isLoading && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
              <Loader/>
            </div>
        )}

        <div
            className={`w-full max-w-md transition-all duration-300 ${
                isLoading ? "opacity-40 pointer-events-none scale-95" : ""
            }`}
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">

            {/* Header */}
            <div className="text-center mb-8">

              <div className="flex justify-center mb-4 text-5xl">
                🐶🐱
              </div>

              <h2 className="text-3xl font-bold text-slate-800">
                Happy Pet Shop
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Chăm sóc thú cưng với tình yêu
              </p>

              <div className="mt-4 text-lg font-semibold text-emerald-600">
                Đăng nhập hệ thống
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Error */}
              {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {errors.general}
                  </div>
              )}

              {/* username */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  username
                </label>

                <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      clearError("username");
                    }}
                    placeholder="Nhập username"
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition ${
                        errors.username
                            ? "border-red-500 focus:ring-red-400"
                            : "border-slate-200 focus:ring-emerald-400"
                    }`}
                />

                {errors.username && (
                    <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Password
                </label>

                <div className="relative">
                  <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError("password");
                      }}
                      placeholder="Nhập mật khẩu"
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition pr-12 ${
                          errors.password
                              ? "border-red-500 focus:ring-red-400"
                              : "border-slate-200 focus:ring-emerald-400"
                      }`}
                  />

                  {/* Eye Button */}
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? "🧐" : "😎"}
                  </button>
                </div>

                {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-sm">

                <label className="flex items-center gap-2 text-slate-600">
                  <input
                      type="checkbox"
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-400"
                  />
                  Ghi nhớ
                </label>

                <Link
                    to="/forgot-password"
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Button */}
              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition disabled:opacity-50"
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

            </form>


            {/* Register */}
            {
                notAdmin &&
                <>
                  <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-slate-200"></div>
                    <span className="px-3 text-sm text-slate-400">hoặc</span>
                    <div className="flex-1 border-t border-slate-200"></div>
                  </div>
                  <p className="text-center text-sm text-slate-600">
                    Chưa có tài khoản?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Đăng ký ngay
                    </Link>
                  </p>
                </>
            }

          </div>

          {/* Footer */
          }
          <p className="text-center text-xs text-slate-400 mt-6">
            © 2026 Happy Pet Shop
          </p>
        </div>
      </div>
  );
}