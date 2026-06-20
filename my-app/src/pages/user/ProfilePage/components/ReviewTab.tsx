"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/authContext";
import { getReviewsByCustomerId } from "../../../../services/reviewService";
import type { ProductReviewResponse } from "../../../../types/reviewTypes";

export default function ReviewTab() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ProductReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getReviewsByCustomerId(user.id);
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setError("Không thể tải đánh giá của bạn");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
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

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">📝</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có đánh giá nào</h3>
        <p className="text-gray-500">Bạn chưa đánh giá sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Đánh giá của tôi</h2>
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
    </div>
  );
}
