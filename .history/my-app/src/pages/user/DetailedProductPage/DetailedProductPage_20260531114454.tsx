"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { addOrUpdateCartItem } from "@/services/cartService";
import { getInfo } from "@/services/customerService";
import { getProductById } from "@/services/productService";
import type { ProductResponse } from "@/types/productTypes";

interface CheckoutItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isSelected: boolean;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value ?? 0);
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "Khong co";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Khong co";

  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DetailedProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const stock = product?.quantity ?? 0;
  const maxSelectableQuantity = Math.max(1, stock);

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      if (!id) {
        setError("Khong tim thay ma san pham.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setActionMessage(null);

      try {
        const data = await getProductById(id);
        if (cancelled) return;

        setProduct(data);
        setQuantity(1);
      } catch (e) {
        if (cancelled) return;

        setProduct(null);
        setError(e instanceof Error ? e.message : "Khong the tai thong tin san pham.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!product) return;

    setQuantity((prev) => Math.min(Math.max(prev, 1), Math.max(1, product.quantity)));
  }, [product]);

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    return product.price * quantity;
  }, [product, quantity]);

  const handleAddToCart = async () => {
    if (!product || product.quantity <= 0) return;

    if (!user?.id) {
      setActionMessage("Vui long dang nhap de them vao gio hang.");
      return;
    }

    setCartLoading(true);
    setActionMessage(null);

    try {
      await addOrUpdateCartItem(user.id, {
        productId: product.id,
        quantity,
      });

      const refreshedCustomer = await getInfo();
      setUser(refreshedCustomer);
      setActionMessage("Da them vao gio hang.");
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "Khong the them vao gio hang.");
    } finally {
      setCartLoading(false);
    }
  };

  const handlePayment = () => {
    if (!product || product.quantity <= 0) return;

    const checkoutItem: CheckoutItem = {
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.imageUrl ?? "",
      isSelected: true,
    };

    sessionStorage.setItem("checkoutItems", JSON.stringify([checkoutItem]));
    navigate("/user/review?source=product");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <p className="text-lg text-gray-600">Dang tai thong tin san pham...</p>
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-lg w-full bg-white border border-red-200 rounded-xl p-6 text-center shadow">
          <p className="text-red-600 font-semibold mb-2">Khong the hien thi san pham</p>
          <p className="text-gray-600 mb-4">{error ?? "Khong tim thay san pham."}</p>
          <Link
            to="/user/products"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
          >
            Quay lai danh sach san pham
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden h-96">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <span className="text-gray-500 text-lg font-semibold">No image</span>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-blue-600">{formatCurrency(product.price)}</span>
                </div>

                <div className="mb-6">
                  <p className="text-lg text-gray-700">
                    So luong co san:{" "}
                    <span className={`font-bold text-xl ${stock > 0 ? "text-green-600" : "text-red-600"}`}>
                      {stock} san pham
                    </span>
                  </p>
                  {stock === 0 && <p className="text-red-600 font-semibold mt-2">San pham da het hang</p>}
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">So luong:</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      disabled={quantity <= 1 || stock === 0}
                      className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-bold py-2 px-4 rounded-lg transition"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={maxSelectableQuantity}
                      value={quantity}
                      onChange={(e) => {
                        const next = Number.parseInt(e.target.value, 10);
                        if (Number.isNaN(next)) {
                          setQuantity(1);
                          return;
                        }
                        setQuantity(Math.min(Math.max(next, 1), maxSelectableQuantity));
                      }}
                      disabled={stock === 0}
                      className="w-20 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg py-2 disabled:bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.min(prev + 1, maxSelectableQuantity))}
                      disabled={quantity >= maxSelectableQuantity || stock === 0}
                      className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-bold py-2 px-4 rounded-lg transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {actionMessage && <p className="mb-4 text-sm font-medium text-blue-600">{actionMessage}</p>}

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={stock === 0 || cartLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2 text-lg"
                  >
                    <span>{cartLoading ? "..." : "Cart"}</span>
                    Them vao gio hang
                  </button>
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={stock === 0}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2 text-lg"
                  >
                    Thanh toan ngay
                  </button>
                </div>

                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">Tong tien:</span>
                    <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Danh muc:</span> {product.categoryName ?? "Khong ro"}
                  </p>
                  <p>
                    <span className="font-semibold">Thuong hieu:</span> {product.brand ?? "Khong ro"}
                  </p>
                  <p>
                    <span className="font-semibold">Xuat xu:</span> {product.origin ?? "Khong ro"}
                  </p>
                  <p>
                    <span className="font-semibold">Don vi:</span> {product.unit ?? "Khong ro"}
                  </p>
                  <p>
                    <span className="font-semibold">Tao luc:</span> {formatDate(product.createdAt)}
                  </p>
                  <p>
                    <span className="font-semibold">Cap nhat:</span> {formatDate(product.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Mo ta san pham</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">{product.description || "Chua co mo ta cho san pham nay."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
