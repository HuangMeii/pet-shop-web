import {type FC, useEffect, useState} from "react";
import {getAllInvoices} from "@/services";
import type {InvoiceResponse} from "@/types/invoiceTypes.ts";
import {getAllReviews, getSentimentStats} from "@/services/reviewService.ts";
import type {ProductReviewResponse, SentimentStatsResponse} from "@/types/reviewTypes.ts";

const stats = [
  {
    title: "Tổng đơn hàng",
    value: "1,245",
    growth: "+12%",
  },
  {
    title: "Doanh thu",
    value: "₫85,400,000",
    growth: "+8%",
  },
  {
    title: "Khách hàng mới",
    value: "320",
    growth: "+15%",
  },
  {
    title: "Sản phẩm",
    value: "540",
    growth: "+5%",
  },
];

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

const SentimentDonutChart: FC<{ stats: SentimentStatsResponse }> = ({stats}) => {
  const total = stats.totalReviews || 1;
  const positiveDeg = (stats.positive / total) * 360;
  const neutralDeg = (stats.neutral / total) * 360;
  const negativeDeg = (stats.negative / total) * 360;

  // Build conic gradient
  const gradientParts: string[] = [];
  let currentDeg = 0;

  if (stats.positive > 0) {
    gradientParts.push(`#22c55e ${currentDeg}deg ${currentDeg + positiveDeg}deg`);
    currentDeg += positiveDeg;
  }
  if (stats.neutral > 0) {
    gradientParts.push(`#9ca3af ${currentDeg}deg ${currentDeg + neutralDeg}deg`);
    currentDeg += neutralDeg;
  }
  if (stats.negative > 0) {
    gradientParts.push(`#ef4444 ${currentDeg}deg ${currentDeg + negativeDeg}deg`);
  }

  const conicGradient = gradientParts.length > 0
      ? `conic-gradient(${gradientParts.join(", ")})`
      : "conic-gradient(#e5e7eb 0deg 360deg)";

  return (
      <div className="flex flex-col items-center">
        <div
            className="w-32 h-32 rounded-full mb-3"
            style={{background: conicGradient}}
        />
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"/>
            <span>{stats.positivePercent.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-gray-400 inline-block"/>
            <span>{stats.neutralPercent.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"/>
            <span>{stats.negativePercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>
  );
};

const AdminDashboard: FC = () => {
  const [recentOrders, setRecentOrders] = useState<InvoiceResponse[]>([]);
  const [recentReviews, setRecentReviews] = useState<ProductReviewResponse[]>([]);
  const [sentimentStats, setSentimentStats] = useState<SentimentStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoices, reviews, sStats] = await Promise.all([
          getAllInvoices(),
          getAllReviews(),
          getSentimentStats(),
        ]);
        setRecentOrders(invoices);
        setRecentReviews(reviews.slice(0, 10)); // Top 10 recent
        setSentimentStats(sStats);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
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

  return (
      <div className="p-8 bg-slate-100">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Tổng quan Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Chào mừng bạn quay trở lại 👋
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {stats.map((item, index) => (
              <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300"
              >
                <p className="text-gray-500 text-sm">{item.title}</p>
                <h2 className="text-2xl font-bold mt-2 text-gray-800">
                  {item.value}
                </h2>
                <span className="text-green-500 text-sm font-medium">
              {item.growth} so với tháng trước
            </span>
              </div>
          ))}
        </div>

        {/* Sentiment Overview + Recent Reviews */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
          {/* Sentiment Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📊 Phân tích cảm xúc
            </h2>
            {sentimentStats ? (
                <>
                  <SentimentDonutChart stats={sentimentStats}/>
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Tổng số đánh giá: <strong>{sentimentStats.totalReviews}</strong>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-green-50 rounded-lg p-2">
                      <div className="font-bold text-green-600 text-lg">{sentimentStats.positive}</div>
                      <div className="text-green-500">Tích cực</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="font-bold text-gray-600 text-lg">{sentimentStats.neutral}</div>
                      <div className="text-gray-500">Trung tính</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2">
                      <div className="font-bold text-red-600 text-lg">{sentimentStats.negative}</div>
                      <div className="text-red-500">Tiêu cực</div>
                    </div>
                  </div>
                </>
            ) : (
                <p className="text-gray-400 text-sm">Chưa có dữ liệu</p>
            )}
          </div>

          {/* Recent Reviews */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              💬 Đánh giá gần đây
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                <tr className="text-gray-500 text-sm border-b">
                  <th className="pb-3">Sản phẩm</th>
                  <th className="pb-3">Khách hàng</th>
                  <th className="pb-3">Đánh giá</th>
                  <th className="pb-3">Cảm xúc</th>
                </tr>
                </thead>
                <tbody>
                {recentReviews.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        Chưa có đánh giá nào
                      </td>
                    </tr>
                ) : (
                    recentReviews.map((review) => {
                      const badge = getSentimentBadge(review.sentimentLabel);
                      return (
                          <tr
                              key={review.id}
                              className="border-b hover:bg-gray-50 transition"
                          >
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
                                <span className="text-xs text-gray-400 ml-1">
                                  {review.rating}/5
                                </span>
                              </div>
                              {review.comment && (
                                  <p className="text-xs text-gray-400 mt-1 max-w-[250px] truncate">
                                    {review.comment}
                                  </p>
                              )}
                            </td>
                            <td className="py-3">
                              <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.textColor}`}
                              >
                                <span className={`w-2 h-2 rounded-full ${badge.dot}`}/>
                                {badge.text}
                              </span>
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

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Đơn hàng gần đây
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="pb-3">Mã đơn</th>
                <th className="pb-3">Khách hàng</th>
                <th className="pb-3">Tổng tiền</th>
                <th className="pb-3">Trạng thái</th>
              </tr>
              </thead>
              <tbody>
              {recentOrders.map((order) => (
                  <tr
                      key={order.id}
                      className="border-b hover:bg-gray-50 transition"
                  >
                    {/* Mã đơn */}
                    <td className="py-4 font-medium text-indigo-600">
                      {order.id}
                    </td>

                    {/* Khách hàng */}
                    <td className="py-4">
                      {order.customerName ?? "Khách lẻ"}
                    </td>

                    {/* Tổng tiền */}
                    <td className="py-4">
                      {order.realAmount.toLocaleString("vi-VN")} ₫
                    </td>

                    {/* Trạng thái */}
                    <td className="py-4">
                      <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "COMPLETED"
                                  ? "bg-green-100 text-green-600"
                                  : order.status === "PENDING"
                                      ? "bg-yellow-100 text-yellow-600"
                                      : "bg-red-100 text-red-600"
                          }`}
                      >
                        {order.status === "COMPLETED"
                            ? "Hoàn thành"
                            : order.status === "PENDING"
                                ? "Đang xử lý"
                                : "Đã huỷ"}
                      </span>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;
