import {type FC, useEffect, useState} from "react";
import {getAllInvoices} from "@/services";
import type {InvoiceResponse} from "@/types/invoiceTypes.ts";
import {getAllReviews, getSentimentStats} from "@/services/reviewService.ts";
import type {ProductReviewResponse, SentimentStatsResponse} from "@/types/reviewTypes.ts";
import {getDashboardStats} from "@/services/dashboardService.ts";
import type {DashboardStatsResponse} from "@/services/dashboardService.ts";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

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

const COLORS = ["#22c55e", "#9ca3af", "#ef4444"];

const SentimentPieChart: FC<{ stats: SentimentStatsResponse }> = ({stats}) => {
  const data = [
    {name: "Tích cực", value: stats.positive},
    {name: "Trung tính", value: stats.neutral},
    {name: "Tiêu cực", value: stats.negative},
  ].filter(d => d.value > 0);

  if (data.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>;
  }

  return (
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
          >
            {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => `${(value as number).toLocaleString("vi-VN")}`}/>
          <Legend/>
        </PieChart>
      </ResponsiveContainer>
  );
};

const AdminDashboard: FC = () => {
  const [recentOrders, setRecentOrders] = useState<InvoiceResponse[]>([]);
  const [recentReviews, setRecentReviews] = useState<ProductReviewResponse[]>([]);
  const [sentimentStats, setSentimentStats] = useState<SentimentStatsResponse | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch invoices and dashboard stats (these are critical)
        const [invoices, dStats] = await Promise.all([
          getAllInvoices(),
          getDashboardStats(),
        ]);
        setRecentOrders(invoices);
        setDashboardStats(dStats);
      } catch (err) {
        console.error("Failed to fetch critical dashboard data:", err);
      }

      // Fetch reviews separately (these endpoints may not exist yet)
      try {
        const [reviews, sStats] = await Promise.all([
          getAllReviews(),
          getSentimentStats(),
        ]);
        setRecentReviews(reviews.slice(0, 10));
        setSentimentStats(sStats);
      } catch (err) {
        console.warn("Failed to fetch review data (non-critical):", err);
      }

      setLoading(false);
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

  // Prepare revenue trend data for chart
  const revenueTrendData = dashboardStats?.revenueTrend?.map(item => ({
    date: item.date,
    doanhThu: item.revenue,
    đơnHàng: item.orderCount,
  })) ?? [];

  // Prepare order status data for pie chart
  const orderStatusData = dashboardStats?.orderStatusDistribution
      ? Object.entries(dashboardStats.orderStatusDistribution).map(([status, count]) => ({
        name: status === "COMPLETED" ? "Hoàn thành" : status === "PENDING" ? "Đang xử lý" : "Đã huỷ",
        value: count,
      }))
      : [];

  // Prepare product type distribution
  const productTypeData = dashboardStats?.productTypeDistribution
      ? Object.entries(dashboardStats.productTypeDistribution).map(([type, count]) => ({
        name: type === "PRODUCT" ? "Sản phẩm" : "Thú cưng",
        value: count,
      }))
      : [];

  // Prepare top items data
  const topItemsData = [...(dashboardStats?.topProducts ?? []), ...(dashboardStats?.topPets ?? [])]
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

  return (
      <div className="p-8 bg-slate-100 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          
          
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
            <p className="text-gray-500 text-sm">Tổng đơn hàng</p>
            <h2 className="text-2xl font-bold mt-2 text-gray-800">
              {dashboardStats?.totalOrders.toLocaleString("vi-VN") ?? "0"}
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
            <p className="text-gray-500 text-sm">Doanh thu</p>
            <h2 className="text-2xl font-bold mt-2 text-gray-800">
              {dashboardStats ? `${dashboardStats.totalRevenue.toLocaleString("vi-VN")} ₫` : "0 ₫"}
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
            <p className="text-gray-500 text-sm">Khách hàng mới</p>
            <h2 className="text-2xl font-bold mt-2 text-gray-800">
              {dashboardStats?.newCustomers.toLocaleString("vi-VN") ?? "0"}
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
            <p className="text-gray-500 text-sm">Sản phẩm</p>
            <h2 className="text-2xl font-bold mt-2 text-gray-800">
              {dashboardStats?.totalProducts.toLocaleString("vi-VN") ?? "0"}
            </h2>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📈 Xu hướng doanh thu
            </h2>
            {revenueTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={revenueTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                    <XAxis dataKey="date" tick={{fontSize: 12}}/>
                    <YAxis tick={{fontSize: 12}}/>
                    <Tooltip formatter={(value: number) => value.toLocaleString("vi-VN")}/>
                    <Line type="monotone" dataKey="doanhThu" stroke="#6366f1" strokeWidth={2} dot={{r: 4}}/>
                  </LineChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
            )}
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🥧 Phân bố trạng thái đơn hàng
            </h2>
            {orderStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {orderStatusData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={["#22c55e", "#eab308", "#ef4444"][index % 3]}/>
                      ))}
                    </Pie>
                    <Tooltip/>
                  </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
          {/* Product Type Distribution */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📊 Phân bố sản phẩm
            </h2>
            {productTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={productTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
            )}
          </div>

          {/* Top Selling Items */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🏆 Top sản phẩm bán chạy
            </h2>
            {topItemsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={topItemsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                    <XAxis dataKey="name" tick={{fontSize: 11}} angle={-20} textAnchor="end" height={60}/>
                    <YAxis/>
                    <Tooltip />
                    <Bar dataKey="totalSold" fill="#f59e0b" radius={[0, 6, 6, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        {dashboardStats?.lowStockAlerts && dashboardStats.lowStockAlerts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                ⚠️ Cảnh báo tồn kho thấp
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardStats.lowStockAlerts.map((item, idx) => (
                    <div key={idx} className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-red-600 mt-1">
                        Tồn kho: <strong>{item.currentStock}</strong>
                      </p>
                      <p className="text-xs text-gray-500">{item.type === "PRODUCT" ? "Sản phẩm" : "Thú cưng"}</p>
                    </div>
                ))}
              </div>
            </div>
        )}

        {/* Sentiment Overview + Recent Reviews */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
          {/* Sentiment Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📊 Phân tích cảm xúc
            </h2>
            {sentimentStats ? (
                <>
                  <SentimentPieChart stats={sentimentStats}/>
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
                <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
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
                    <td className="py-4 font-medium text-indigo-600">
                      {order.id}
                    </td>
                    <td className="py-4">
                      {order.customerName ?? "Khách lẻ"}
                    </td>
                    <td className="py-4">
                      {order.realAmount.toLocaleString("vi-VN")} ₫
                    </td>
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
