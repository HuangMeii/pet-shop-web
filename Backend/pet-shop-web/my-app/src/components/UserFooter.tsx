"use client";

import { Link } from "react-router-dom";

export default function UserFooter() {


  return (
      <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Về chúng tôi</h4>
              <p className="text-gray-400">
                Happy Pet Shop - Địa chỉ tin cậy cung cấp sản phẩm và dịch vụ chất lượng cao cho thú cưng của bạn.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Liên kết nhanh</h4>
              <ul className="text-gray-400 space-y-2">
                <li>
                  <Link to="/user/products" className="hover:text-white transition">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to="/user/products" className="hover:text-white transition">
                    Sản phẩm
                  </Link>
                </li>
                <li>
                  <Link to="/user/services" className="hover:text-white transition">
                    Dịch vụ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Liên hệ</h4>
              <p className="text-gray-400">📧 info@happypetshop.com</p>
              <p className="text-gray-400">📱 0123 456 789</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Happy Pet Shop. Bảo lưu mọi quyền.</p>
          </div>
        </div>
      </footer>
  );
}
