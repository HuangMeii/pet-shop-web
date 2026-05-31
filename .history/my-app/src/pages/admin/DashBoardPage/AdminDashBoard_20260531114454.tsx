import {type FC, useEffect, useState} from "react";
import {getAllInvoices} from "@/services";
import type {InvoiceResponse} from "@/types/invoiceTypes.ts";

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


const AdminDashboard: FC = () => {
  const [recentOrders, setRecentOrders] = useState<InvoiceResponse[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const invoices = await getAllInvoices();
      setRecentOrders(invoices);
    }

    fetchInvoices();
  }, []);

  return (
      <div className="p-8 bg-slate-100 min-h-screen">
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
