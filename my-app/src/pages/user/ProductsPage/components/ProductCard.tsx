"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/authContext";
import { getInfo } from "../../../../services/customerService";
import { addOrUpdateCartItem } from "../../../../services/cartService";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  availableAmount: number;
  category?: string;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  image,
  availableAmount,
}: ProductCardProps) {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (availableAmount === 0) return;
    if (!user?.id) {
      setCartMessage("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }
    setCartLoading(true);
    setCartMessage(null);
    try {
      await addOrUpdateCartItem(user.id, { productId: id, quantity: 1 });
      await getInfo().then(setUser);
      setCartMessage("Đã thêm vào giỏ hàng!");
      setTimeout(() => setCartMessage(null), 2000);
    } catch {
      setCartMessage("Không thể thêm vào giỏ hàng");
    } finally {
      setCartLoading(false);
    }
  };

  const handlePayment = () => {
    if (availableAmount === 0) return;
    const checkoutItem = {
      id,
      productId: id,
      name,
      price,
      quantity: 1,
      image,
      isSelected: true,
    };
    sessionStorage.setItem("checkoutItems", JSON.stringify([checkoutItem]));
    navigate("/payment?source=product");
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      <Link to={`/user/detailedProduct/${id}`} className="block">
        <div className="relative h-64 bg-gray-200 overflow-hidden cursor-pointer flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-all duration-300"
            />
          ) : (
            <span className="text-5xl text-gray-400" aria-hidden>🛒</span>
          )}

          <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {availableAmount > 0 ? "Còn hàng" : "Hết hàng"}
          </div>
        </div>
      </Link>

      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/detailedProduct/${id}`}>
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 h-14 hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </Link>

        {cartMessage && (
          <p className="text-sm mb-2 text-blue-600 font-medium">{cartMessage}</p>
        )}

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

          <div className="mb-4">
            <p className="text-xs text-gray-500">
              Số lượng có sẵn:{" "}
              <span
                  className={`font-bold ${
                      availableAmount > 0 ? "text-green-600" : "text-red-600"
                  }`}
              >
              {availableAmount}
            </span>
            </p>
          </div>

          <div className="border-t pt-3 mt-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            ₫{price.toLocaleString("vi-VN")}
          </span>
            <div className="flex gap-2">
              <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  disabled={availableAmount === 0 || cartLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={`Thêm ${name} vào giỏ hàng`}
                  title="Thêm vào giỏ hàng"
              >
                {cartLoading ? "..." : "🛒"}
              </button>
              <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePayment();
                  }}
                  disabled={availableAmount === 0}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  aria-label={`Thanh toán cho ${name}`}
                  title="Thanh toán ngay"
              >
                💳
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}