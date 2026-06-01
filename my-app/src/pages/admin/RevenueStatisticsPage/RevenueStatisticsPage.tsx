import {type FC, useEffect, useState} from "react";
import {getDashboardStats} from "@/services/dashboardService.ts";
import type {DashboardStatsResponse} from "@/services/dashboardService.ts";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const RevenueStatisticsPage: FC = () => {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch revenue stats:", err);
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

  const revenueTrendData = stats?.revenueTrend?.map(item => ({
    date: item.date,
    doanhThu: item.revenue,
    đơnHàng: item.orderCount,
  })) ?? [];

  const orderStatusData = stats?.orderStatusDistribution
      ? Object.entries(stats.orderStatusDistribution).map(([status, count]) => ({
        name: status === "COMPLETED" ? "Hoàn thành" : status === "PENDING" ? "Đang xử lý" : "Đã huỷ",
        value: count,
      }))
      : [];

  const topItemsData = [...(stats?.topProducts ?? []), ...(stats?.topPets ?? [])]
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

  return (
      <div className="p-8 bg-slate-100 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📈 Thống kê Doanh thu</h1>
          <p className="text-gray-500 mt-2">Phân tích chi tiết doanh thu và đơn hàng</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500 text-sm">Tổng doanh thu</p>
            <h2 className="text-2xl font-bold mt-2 text-indigo-600">
              {stats ? `${stats.totalRevenue.toLocaleString("vi-VN")} ₫` : "0 ₫"}
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500 text-sm">Tổng đơn hàng</p>
            <h2 className="text-2xl font-bold mt-2 text-emerald-600">
              {stats?.totalOrders.toLocaleString("vi-VN") ?? "0"}
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500 text-sm">Khách hàng mới</p>
            <h2 className="text-2xl font-bold mt-2 text-amber-600">
              {stats?.newCustomers.toLocaleString("vi-VN") ?? "0"}
            </h2>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Xu hướng doanh thu theo thời gian</h2>
          {revenueTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                  <XAxis dataKey="date" tick={{fontSize: 12}}/>
                  <YAxis tick={{fontSize: 12}}/>
                  <Tooltip formatter={(value: any) => `${(value as number).toLocaleString("vi-VN")} ₫`}/>
                  <Line type="monotone" dataKey="doanhThu" stroke="#6366f1" strokeWidth={2} dot={{r: 4}}/>
                </LineChart>
              </ResponsiveContainer>
          ) : (
              <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
          )}
        </div>

        {/* Order Status + Top Items */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Phân bố trạng thái đơn hàng</h2>
            {orderStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                        data={orderStatusData}
                        cx="50%" cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({name, percent}: any) => `${name} ${(percent * 100).toFixed(0)}%`}
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

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Top sản phẩm theo doanh thu</h2>
            {topItemsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topItemsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                    <XAxis type="number"/>
                    <YAxis type="category" dataKey="name" width={150} tick={{fontSize: 12}}/>
                    <Tooltip formatter={(value: any) => `${(value as number).toLocaleString("vi-VN")} ₫`}/>
                    <Bar dataKey="totalRevenue" fill="#f59e0b" radius={[0, 6, 6, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
            )}
          </div>
        </div>

        {/* New vs Returning Customers */}
        {stats?.newVsReturning && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Khách hàng mới vs Quay lại</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600">{stats.newVsReturning.newCustomers}</div>
                  <p className="text-gray-500 mt-1">Khách hàng mới</p>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                    <div className="bg-indigo-500 h-4 rounded-full" style={{width: `${stats.newVsReturning.newPercent}%`}}/>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{stats.newVsReturning.newPercent.toFixed(1)}%</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600">{stats.newVsReturning.returningCustomers}</div>
                  <p className="text-gray-500 mt-1">Khách hàng quay lại</p>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                    <div className="bg-emerald-500 h-4 rounded-full" style={{width: `${stats.newVsReturning.returningPercent}%`}}/>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{stats.newVsReturning.returningPercent.toFixed(1)}%</p>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default RevenueStatisticsPage;
