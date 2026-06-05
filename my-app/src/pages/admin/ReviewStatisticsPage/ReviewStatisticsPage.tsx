import {type FC, useEffect, useState} from "react";
import {getAllReviews, getSentimentStats, getReviewStatistics} from "@/services/reviewService.ts";
import type {ProductReviewResponse, SentimentStatsResponse, ReviewStatisticsResponse} from "@/types/reviewTypes.ts";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#22c55e", "#9ca3af", "#ef4444"];

const getSentimentBadge = (label?: string) => {
  switch (label) {
    case "POSITIVE":
      return {text: "Tích cực", bg: "bg-green-100", textColor: "text-green-600", dot: "bg-green-500"};
    case "NEGATIVE":
      return {text: "Tiêu cực", bg: "bg-red-100", textColor: "text-red-600", dot: "bg-red-500"};
    default:
      return {text: "Trung tính", bg: "bg-gray-100", textColor: "text-gray-600", dot: "bg-gray-400"};
  }
};

const ReviewStatisticsPage: FC = () => {
  const [reviews, setReviews] = useState<ProductReviewResponse[]>([]);
  const [sentimentStats, setSentimentStats] = useState<SentimentStatsResponse | null>(null);
  const [reviewStats, setReviewStats] = useState<ReviewStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allReviews, sStats, rStats] = await Promise.all([
          getAllReviews(),
          getSentimentStats(),
          getReviewStatistics(),
        ]);
        setReviews(allReviews);
        setSentimentStats(sStats);
        setReviewStats(rStats);
      } catch (err) {
        console.error("Failed to fetch review stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="p-8 bg-slate-100 min-h-screen flex items-center justify-center">
          <div className="text-gray-500 text-lg">Đang tải dữ liệu...</div>
        </div>
    );
  }

  // Rating distribution data
  const ratingDistribution = reviewStats?.ratingDistribution
      ? Object.entries(reviewStats.ratingDistribution)
          .map(([rating, count]) => ({rating: `${rating} sao`, count}))
          .sort((a, b) => parseInt(a.rating) - parseInt(b.rating))
      : [];

  // Sentiment pie data
  const sentimentData = sentimentStats
      ? [
        {name: "Tích cực", value: sentimentStats.positive},
        {name: "Trung tính", value: sentimentStats.neutral},
        {name: "Tiêu cực", value: sentimentStats.negative},
      ].filter(d => d.value > 0)
      : [];

  // Monthly review trend
  const monthlyTrend = reviewStats?.monthlyReviewCounts
      ? Object.entries(reviewStats.monthlyReviewCounts).map(([month, count]) => ({
        month,
        count,
      }))
      : [];

  return (
      <div className="p-8 bg-slate-100 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📝 Thống kê Đánh giá</h1>
          <p className="text-gray-500 mt-2">Phân tích chi tiết đánh giá và cảm xúc khách hàng</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500 text-sm">Tổng đánh giá</p>
            <h2 className="text-2xl font-bold mt-2 text-indigo-600">
              {reviewStats?.totalReviews?.toLocaleString("vi-VN") ?? "0"}
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500 text-sm">Đánh giá trung bình</p>
            <h2 className="text-2xl font-bold mt-2 text-amber-600">
              {reviewStats?.averageRating?.toFixed(1) ?? "0.0"}
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500 text-sm">Sản phẩm có đánh giá</p>
            <h2 className="text-2xl font-bold mt-2 text-emerald-600">
              {reviewStats?.productsWithReviews?.toLocaleString("vi-VN") ?? "0"}
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500 text-sm">Tỉ lệ đánh giá tích cực</p>
            <h2 className="text-2xl font-bold mt-2 text-green-600">
              {sentimentStats ? `${sentimentStats.positivePercent.toFixed(1)}%` : "0%"}
            </h2>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
          {/* Rating Distribution */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Phân bố số sao đánh giá</h2>
            {ratingDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ratingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                    <XAxis dataKey="rating"/>
                    <YAxis/>
                    {/* @ts-expect-error recharts formatter type mismatch */}
                    <Tooltip formatter={(value: number) => `${value.toLocaleString("vi-VN")} đánh giá`}/>
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
            )}
          </div>

          {/* Sentiment Distribution */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Phân bố cảm xúc</h2>
            {sentimentData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                        data={sentimentData}
                        cx="50%" cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                    >
                      {sentimentData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                      ))}
                    </Pie>
                    {/* @ts-expect-error recharts formatter type mismatch */}
                    <Tooltip formatter={(value: number) => `${value.toLocaleString("vi-VN")} đánh giá`}/>
                    <Legend/>
                  </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
            )}
          </div>
        </div>

        {/* Monthly Review Trend */}
        {monthlyTrend.length > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Xu hướng đánh giá theo tháng</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                  <XAxis dataKey="month"/>
                  <YAxis/>
                  {/* @ts-expect-error recharts formatter type mismatch */}
                  <Tooltip formatter={(value: number) => `${value.toLocaleString("vi-VN")} đánh giá`}/>
                  <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
        )}

        {/* All Reviews Table */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Tất cả đánh giá</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="pb-3">Sản phẩm</th>
                <th className="pb-3">Khách hàng</th>
                <th className="pb-3">Đánh giá</th>
                <th className="pb-3">Cảm xúc</th>
                <th className="pb-3">Ngày</th>
              </tr>
              </thead>
              <tbody>
              {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      Chưa có đánh giá nào
                    </td>
                  </tr>
              ) : (
                  reviews.map((review) => {
                    const badge = getSentimentBadge(review.sentimentLabel);
                    return (
                        <tr key={review.id} className="border-b hover:bg-gray-50 transition">
                          <td className="py-3 text-sm font-medium text-gray-700 max-w-[200px] truncate">
                            {review.productName ?? "N/A"}
                          </td>
                          <td className="py-3 text-sm text-gray-600">
                            {review.customerName ?? "Ẩn danh"}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">
                                {"★".repeat(review.rating)}
                                {"☆".repeat(5 - review.rating)}
                              </span>
                              <span className="text-xs text-gray-400 ml-1">{review.rating}/5</span>
                            </div>
                            {review.comment && (
                                <p className="text-xs text-gray-400 mt-1 max-w-[250px] truncate">{review.comment}</p>
                            )}
                          </td>
                          <td className="py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.textColor}`}>
                              <span className={`w-2 h-2 rounded-full ${badge.dot}`}/>
                              {badge.text}
                            </span>
                          </td>
                          <td className="py-3 text-sm text-gray-500">
                            {review.createdAt ? new Date(review.createdAt).toLocaleString("vi-VN", {year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"}) : "N/A"}
                          </td>
                        </tr>
                    );
                  })
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default ReviewStatisticsPage;
