"use client";

import { useEffect, useState, useRef } from "react";
import { getReviewsByProductId, getReviewStats, createReview, uploadReviewImage } from "../services/reviewService";
import type { ProductReviewResponse, ReviewStatsResponse } from "../types/reviewTypes";
import { useAuth } from "../context/authContext";

interface ReviewSectionProps {
  productId: string;
}

const MAX_IMAGES = 3;

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

function StarRating({ rating, interactive, onChange }: {
  rating: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={`text-xl ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          aria-label={`${star} sao`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function RatingBar({ label, count, total }: { label: number; count: number; total: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-3 text-right text-gray-600">{label}</span>
      <span className="text-yellow-400">★</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-right text-gray-500 text-xs">{count}</span>
    </div>
  );
}

/** Lightbox component for viewing images full-screen */
function ImageLightbox({ images, index, onClose }: { images: string[]; index: number; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(index);

  if (images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[currentIndex]}
          alt={`Review image ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />
        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow hover:bg-gray-100"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/** Review images grid (1-3 images) */
function ReviewImages({ images }: { images: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const gridCols = images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <>
      <div className={`grid ${gridCols} gap-1.5 mt-2`}>
        {images.map((url, idx) => (
          <button
            key={idx}
            onClick={() => setLightboxIndex(idx)}
            className="overflow-hidden rounded-lg group"
          >
            <img
              src={url}
              alt={`Review photo ${idx + 1}`}
              className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ProductReviewResponse[]>([]);
  const [stats, setStats] = useState<ReviewStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Image upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reviewsData, statsData] = await Promise.all([
        getReviewsByProductId(productId),
        getReviewStats(productId),
      ]);
      setReviews(reviewsData);
      setStats(statsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể tải đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchData();
    }
  }, [productId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_IMAGES - selectedFiles.length;
    const newFiles = files.slice(0, remaining);

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // Generate previews
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async () => {
    if (!user?.id) {
      setSubmitError("Vui lòng đăng nhập để đánh giá");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Upload images to Cloudinary first
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        setUploadingImages(true);
        const uploadPromises = selectedFiles.map((file) => uploadReviewImage(file));
        imageUrls = await Promise.all(uploadPromises);
        setUploadingImages(false);
      }

      await createReview(user.id, {
        productId,
        rating: newRating,
        comment: newComment || undefined,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      });
      setShowForm(false);
      setNewRating(5);
      setNewComment("");
      setSelectedFiles([]);
      setPreviews([]);
      await fetchData();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Không thể gửi đánh giá");
    } finally {
      setSubmitting(false);
      setUploadingImages(false);
    }
  };

  const customerId = user?.id;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Đánh giá sản phẩm</h2>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Đang tải đánh giá...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <p className="text-red-500">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="mt-2 text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Review Summary */}
          {stats && stats.totalReviews > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-gray-800">
                  {stats.averageRating.toFixed(1)}
                </span>
                <StarRating rating={Math.round(stats.averageRating)} />
                <span className="text-sm text-gray-500 mt-1">
                  {stats.totalReviews} đánh giá
                </span>
              </div>
              <div className="md:col-span-2 space-y-1">
                {[5, 4, 3, 2, 1].map((star) => (
                  <RatingBar
                    key={star}
                    label={star}
                    count={stats.ratingDistribution[star] ?? 0}
                    total={stats.totalReviews}
                  />
                ))}
              </div>
            </div>
          )}

          {stats && stats.totalReviews === 0 && (
            <div className="text-center py-6 text-gray-500 mb-6">
              Chưa có đánh giá nào cho sản phẩm này.
            </div>
          )}

          {/* Review Form */}
          {customerId && (
            <div className="mb-8">
              {!showForm ? (
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Viết đánh giá
                </button>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Đánh giá của bạn</h3>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-1">Chất lượng:</label>
                    <StarRating rating={newRating} interactive onChange={setNewRating} />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-1">Nhận xét:</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-1">
                      Hình ảnh ({selectedFiles.length}/{MAX_IMAGES}):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {previews.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {selectedFiles.length < MAX_IMAGES && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-400 mt-1">Chọn tối đa {MAX_IMAGES} ảnh (JPG, PNG)</p>
                  </div>

                  {submitError && (
                    <p className="text-red-500 text-sm mb-2">{submitError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      disabled={submitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium text-sm"
                    >
                      {submitting ? (uploadingImages ? "Đang tải ảnh..." : "Đang gửi...") : "Gửi đánh giá"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setSubmitError(null);
                        setSelectedFiles([]);
                        setPreviews([]);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!customerId && (
            <p className="text-sm text-gray-500 mb-6">
              Vui lòng <a href="/login" className="text-blue-600 hover:underline">đăng nhập</a> để viết đánh giá.
            </p>
          )}

          {/* Review List */}
          {reviews.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Tất cả đánh giá ({reviews.length})
              </h3>
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {(review.customerName ?? "A")[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800 text-sm">
                        {review.customerName ?? "Người dùng"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                  </div>
                  <StarRating rating={review.rating} />
                  {review.comment && (
                    <p className="text-gray-700 mt-2 text-sm leading-relaxed">{review.comment}</p>
                  )}
                  {/* Review Images */}
                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <ReviewImages images={review.imageUrls} />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
