import { useState, useEffect, useMemo } from "react";
import { getAllReviews, deleteReview } from "../../../services/reviewService";
import type { ProductReviewResponse } from "../../../types/reviewTypes";

const ITEMS_PER_PAGE = 10;

const getSentimentBadge = (label?: string) => {
  switch (label) {
    case "POSITIVE":
      return { text: "Tích cực", bg: "bg-green-100", textColor: "text-green-700", dot: "bg-green-500" };
    case "NEGATIVE":
      return { text: "Tiêu cực", bg: "bg-red-100", textColor: "text-red-700", dot: "bg-red-500" };
    default:
      return { text: "Trung tính", bg: "bg-gray-100", textColor: "text-gray-700", dot: "bg-gray-500" };
  }
};

const ReviewManagementPage: React.FC = () => {
  const [reviews, setReviews] = useState<ProductReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<ProductReviewResponse | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviews();
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setDeleteConfirm(null);
      if (selectedReview?.id === reviewId) setSelectedReview(null);
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  // Filter logic
  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const matchesProduct = review.productName?.toLowerCase().includes(q);
        const matchesCustomer = review.customerName?.toLowerCase().includes(q);
        const matchesComment = review.comment?.toLowerCase().includes(q);
        if (!matchesProduct && !matchesCustomer && !matchesComment) return false;
      }
      // Rating filter
      if (ratingFilter !== "all" && review.rating !== ratingFilter) return false;
      // Sentiment filter
      if (sentimentFilter !== "all" && (review.sentimentLabel ?? "NEUTRAL") !== sentimentFilter) return false;
      return true;
    });
  }, [reviews, search, ratingFilter, sentimentFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, ratingFilter, sentimentFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-gray-500 text-lg">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📋 Quản lý Đánh giá</h1>
        <p className="text-gray-500 mt-2">Xem, tìm kiếm và xóa đánh giá khách hàng</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo sản phẩm, khách hàng, nội dung..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Rating filter */}
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">Tất cả sao</option>
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>{star} sao</option>
          ))}
        </select>

        {/* Sentiment filter */}
        <select
          value={sentimentFilter}
          onChange={(e) => setSentimentFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">Tất cả cảm xúc</option>
          <option value="POSITIVE">Tích cực</option>
          <option value="NEUTRAL">Trung tính</option>
          <option value="NEGATIVE">Tiêu cực</option>
        </select>

        <span className="text-sm text-gray-500">
          {filteredReviews.length} / {reviews.length} đánh giá
        </span>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm border-b bg-gray-50">
                <th className="p-4">Sản phẩm</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Đánh giá</th>
                <th className="p-4">Nội dung</th>
                <th className="p-4">Cảm xúc</th>
                <th className="p-4">Ngày</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Không tìm thấy đánh giá nào
                  </td>
                </tr>
              ) : (
                paginatedReviews.map((review) => {
                  const badge = getSentimentBadge(review.sentimentLabel);
                  return (
                    <tr key={review.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4 text-sm font-medium text-gray-700 max-w-[180px] truncate">
                        {review.productName ?? "N/A"}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {review.customerName ?? "Ẩn danh"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">{review.rating}/5</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600 max-w-[200px] truncate">
                        {review.comment || (
                          <span className="text-gray-400 italic">Không có nội dung</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.textColor}`}>
                          <span className={`w-2 h-2 rounded-full ${badge.dot}`}/>
                          {badge.text}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleString("vi-VN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedReview(review)}
                            className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
                          >
                            Chi tiết
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(review.id)}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <span className="text-sm text-gray-500">
              Trang {currentPage} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm border rounded-lg ${
                    currentPage === page
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Chi tiết đánh giá</h2>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">Sản phẩm:</span>
                  <p className="font-medium">{selectedReview.productName ?? "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Khách hàng:</span>
                  <p className="font-medium">{selectedReview.customerName ?? "Ẩn danh"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Đánh giá:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500 text-lg">
                      {"★".repeat(selectedReview.rating)}
                      {"☆".repeat(5 - selectedReview.rating)}
                    </span>
                    <span className="text-sm text-gray-400 ml-1">{selectedReview.rating}/5</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Cảm xúc:</span>
                  <div className="mt-1">
                    {(() => {
                      const badge = getSentimentBadge(selectedReview.sentimentLabel);
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.textColor}`}>
                          <span className={`w-2 h-2 rounded-full ${badge.dot}`}/>
                          {badge.text}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Nội dung:</span>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                    {selectedReview.comment || (
                      <span className="text-gray-400 italic">Không có nội dung</span>
                    )}
                  </p>
                </div>
                {selectedReview.imageUrls && selectedReview.imageUrls.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500">Hình ảnh:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedReview.imageUrls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Review image ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-500">Ngày tạo:</span>
                  <p className="font-medium">
                    {selectedReview.createdAt
                      ? new Date(selectedReview.createdAt).toLocaleString("vi-VN")
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirm(selectedReview.id);
                    setSelectedReview(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Xóa đánh giá này
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagementPage;
