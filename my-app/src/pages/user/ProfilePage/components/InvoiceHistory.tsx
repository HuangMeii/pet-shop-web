"use client";
import { useInvoiceHistory } from "../hooks/useInvoiceHistory";
import type { Invoice, SortOption } from "../hooks/useInvoiceHistory"; 
import Pagination from "./Pagination"; 
import StatusBadge from "./StatusBadge"; 

const mockInvoices: Invoice[] = [
  {
    id: "INV-2025-001",
    date: "2025-01-05",
    status: "Paid",
    totalAmount: 750000,
    items: 3,
  },

  {
    id: "INV-2025-002",
    date: "2025-01-03",
    status: "Paid",
    totalAmount: 450000,
    items: 2,
  },

  {
    id: "INV-2025-003",
    date: "2025-01-01",
    status: "Pending",
    totalAmount: 280000,
    items: 1,
  },

  {
    id: "INV-2024-048",
    date: "2024-12-28",
    status: "Paid",
    totalAmount: 320000,
    items: 2,
  },

  {
    id: "INV-2024-047",
    date: "2024-12-25",
    status: "Paid",
    totalAmount: 550000,
    items: 4,
  },

  {
    id: "INV-2024-046",
    date: "2024-12-20",
    status: "Cancelled",
    totalAmount: 180000,
    items: 1,
  },

  {
    id: "INV-2024-045",
    date: "2024-12-15",
    status: "Paid",
    totalAmount: 420000,
    items: 2,
  },

  {
    id: "INV-2024-044",
    date: "2024-12-10",
    status: "Paid",
    totalAmount: 890000,
    items: 5,
  },

  {

    id: "INV-2024-043",
    date: "2024-12-05",
    status: "Paid",
    totalAmount: 310000,
    items: 2,
  },

  {
    id: "INV-2024-042",
    date: "2024-11-30",
    status: "Paid",
    totalAmount: 625000,
    items: 3,
  },

];


export default function InvoiceHistory() {
  const { 
    currentInvoices, 
    currentPage, 
    totalPages, 
    sortBy, 
    setSortBy, 
    goToPage, 
    startIndex, 
    totalCount 
  } = useInvoiceHistory(mockInvoices);

  const fmtMoney = (n: number) => `₫${n.toLocaleString("vi-VN")}`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString("vi-VN");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <label className="text-sm font-semibold text-gray-700">Sắp xếp theo:</label>
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value as SortOption); goToPage(1); }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="date-desc">Ngày mới nhất</option>
          <option value="date-asc">Ngày cũ nhất</option>
          <option value="amount-desc">Số tiền cao nhất</option>
          <option value="amount-asc">Số tiền thấp nhất</option>
        </select>
      </div>

      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              {["Mã hóa đơn", "Ngày", "Số mục", "Tổng tiền", "Trạng thái", "Hành động"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{invoice.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{fmtDate(invoice.date)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.items} sản phẩm</td>
                <td className="px-6 py-4 text-sm font-semibold text-blue-600">{fmtMoney(invoice.totalAmount)}</td>
                <td className="px-6 py-4 text-sm">
                  <StatusBadge status={invoice.status} /></td>
                <td className="px-6 py-4 text-center text-sm">
                  <button className="text-blue-600 hover:text-blue-800 font-semibold">Xem chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {currentInvoices.map((invoice) => (
          <div key={invoice.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-gray-800">{invoice.id}</p>
                <p className="text-sm text-gray-600">{fmtDate(invoice.date)}</p>
              </div>
              <StatusBadge status={invoice.status} />
            </div>
            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <p><span className="font-semibold text-gray-700">Số mục:</span> {invoice.items}</p>
              <p>
                <span className="font-semibold text-gray-700">Tổng tiền:</span>
                <span className="text-lg font-bold text-blue-600 ml-2">{fmtMoney(invoice.totalAmount)}</span>
              </p>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>

      {totalCount === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600">📄 Bạn chưa có hóa đơn nào</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Pagination current={currentPage} total={totalPages} onChange={goToPage} />
          <p className="text-sm text-gray-600">
             Hiển thị {startIndex + 1}–{startIndex + currentInvoices.length} trong {totalCount} hóa đơn
          </p>
        </div>
      )}
    </div>
  );
}