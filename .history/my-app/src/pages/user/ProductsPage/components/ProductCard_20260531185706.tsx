"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/authContext";
import { getInfo } from "../../../../services/customerService";
import { addOrUpdateCartItem } from "../../../../services/cartService";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  availableAmount: number;
  purchaseCount: number;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  availableAmount,
  purchaseCount,
}: ProductCardProps) {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
      <Link to={`/user/detailedProduct/${id}`} className="block relative">
        <div className="relative h-36 bg-gray-200 overflow-hidden cursor-pointer flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-all duration-300"
            />
          ) : (
            <span className="text-5xl text-gray-400" aria-hidden>🛒</span>
          )}

          {/* Wishlist heart icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted((prev) => !prev);
            }}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition shadow-sm"
            title={isWishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
            aria-label={isWishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          >
            <span className={`text-lg transition ${isWishlisted ? "text-red-500" : "text-gray-400"}`}>
              {isWishlisted ? "❤️" : "♡"}
            </span>
          </button>
        </div>
      </Link>

      <div className="p-3 flex-grow flex flex-col">
        <Link to={`/detailedProduct/${id}`}>
          <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2 hover:text-blue-600 transition-colors leading-tight">
            {name}
          </h3>
        </Link>

        {cartMessage && (
          <p className="text-xs mb-1 text-blue-600 font-medium">{cartMessage}</p>
        )}

        <p className="text-xs text-gray-400 mb-2">
          {purchaseCount} lượt mua
        </p>

        <div className="border-t pt-2 mt-auto flex items-center justify-between">
          <span className="text-base font-bold text-blue-600">
            ₫{price.toLocaleString("vi-VN")}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={availableAmount === 0 || cartLoading}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition disabled:bg-gray-200 disabled:text-gray-400"
              aria-label={`Thêm ${name} vào giỏ hàng`}
              title="Thêm vào giỏ hàng"
            >
              {cartLoading ? (
                <span className="text-xs">...</span>
              ) : (
                <span className="text-base">🛒</span>
              )}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePayment();
              }}
              disabled={availableAmount === 0}
              className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold py-1.5 px-4 rounded-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              aria-label={`Thanh toán cho ${name}`}
            >
              Mua
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
