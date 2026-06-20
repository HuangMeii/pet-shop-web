"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/authContext";
import { getReviewsByCustomerId } from "../../../../services/reviewService";
import { getInvoicesByCustomerId } from "../../../../services/invoiceService";
import type { ProductReviewResponse } from "../../../../types/reviewTypes";
import type { InvoiceResponse } from "../../../../types/invoiceTypes";

interface UnreviewedProduct {
  productId: string;
  productName: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  invoiceId: string;
  invoiceDate: string;
}

export default function ReviewTab() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ProductReviewResponse[]>([]);
  const [unreviewedProducts, setUnreviewedProducts] = useState<UnreviewedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"reviewed" | "unreviewed">("reviewed");

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch reviews and invoices separately to avoid one failure breaking the other
        let reviewData: ProductReviewResponse[] = [];
        let invoices: InvoiceResponse[] = [];

        try {
          reviewData = await getReviewsByCustomerId(user.id);
        } catch (err) {
          console.warn("Failed to fetch reviews:", err);
        }

        try {
          invoices = await getInvoicesByCustomerId(user.id);
        } catch (err) {
          console.warn("Failed to fetch invoices:", err);
        }

        setReviews(reviewData);

        // Get set of reviewed product IDs
        const reviewedProductIds = new Set(
          reviewData.map((r) => r.productId)
        );

        // Extract unreviewed products from paid invoices
        const unreviewed: UnreviewedProduct[] = [];
        const seenProductIds = new Set<string>();

        for (const invoice of invoices) {
          if (invoice.invoiceDetails) {
            for (const detail of invoice.invoiceDetails) {
              if (
                detail.productId &&
                !reviewedProductIds.has(detail.productId) &&
                !seenProductIds.has(detail.productId)
              ) {
                seenProductIds.add(detail.productId);
                unreviewed.push({
                  productId: detail.productId,
                  productName: detail.productName ?? "Sản phẩm",
                  imageUrl: undefined,
                  unitPrice: detail.unitPrice,
                  quantity: detail.quantity,
                  invoiceId: invoice.id,
                  invoiceDate: invoice.createdAt,
                });
              }
            }
          }
        }

        setUnreviewedProducts(unreviewed);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Không thể tải dữ liệu đánh giá");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Đang tải đánh giá...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Đánh giá của tôi</h2>

      {/* Sub-tabs: Đã đánh giá / Chưa đánh giá */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab("reviewed")}
          className={`pb-3 px-1 font-semibold transition border-b-2 ${
            activeSubTab === "reviewed"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          ✅ Đã đánh giá ({reviews.length})
        </button>
        <button
          onClick={() => setActiveSubTab("unreviewed")}
          className={`pb-3 px-1 font-semibold transition border-b-2 ${
            activeSubTab === "unreviewed"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          ⏳ Chưa đánh giá ({unreviewedProducts.length})
        </button>
      </div>

      {/* Đã đánh giá */}
      {activeSubTab === "reviewed" && (
        <>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có đánh giá nào</h3>
              <p className="text-gray-500">Bạn chưa đánh giá sản phẩm nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{review.productName ?? "Sản phẩm"}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-500">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                        <span className="text-sm text-gray-400 ml-1">{review.rating}/5</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleString("vi-VN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                  )}
                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {review.imageUrls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Review image ${idx + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Chưa đánh giá */}
      {activeSubTab === "unreviewed" && (
        <>
          {unreviewedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎉</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Tất cả đã được đánh giá</h3>
              <p className="text-gray-500">Bạn đã đánh giá tất cả sản phẩm đã mua</p>
            </div>
          ) : (
            <div className="space-y-4">
              {unreviewedProducts.map((item) => (
                <div key={item.productId} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-2xl">🛒</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">{item.productName}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Đã mua {item.quantity} sản phẩm
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Hóa đơn: {item.invoiceId} • {item.invoiceDate
                          ? new Date(item.invoiceDate).toLocaleString("vi-VN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
