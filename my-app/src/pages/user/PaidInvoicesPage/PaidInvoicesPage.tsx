"use client";

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { usePaidInvoices } from "./usePaidInvoices";
import type { InvoiceResponse } from "../../../types/invoiceTypes";
import { useInvoiceHistory } from "../ProfilePage/hooks/useInvoiceHistory";
import type { Invoice, SortOption } from "../ProfilePage/hooks/useInvoiceHistory";
import Pagination from "../ProfilePage/components/Pagination";
import StatusBadge from "../ProfilePage/components/StatusBadge";

function mapToRows(invoices: InvoiceResponse[]): Invoice[] {
  return invoices.map((inv) => ({
    id: inv.id,
    date: inv.createdAt,
    status: "Paid",
    totalAmount: Number(inv.realAmount ?? inv.totalAmount ?? 0),
    items: inv.invoiceDetails?.length ?? 0,
  }));
}

function formatMoney(n: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PaidInvoicesPage() {
  const { paidInvoices, loading, error, isAuthenticated, refetch } = usePaidInvoices();
  const rows = useMemo(() => mapToRows(paidInvoices), [paidInvoices]);

  const {
    currentInvoices,
    currentPage,
    totalPages,
    sortBy,
    setSortBy,
    goToPage,
    startIndex,
    totalCount,
  } = useInvoiceHistory(rows, 8);

  const statusById = useMemo(() => {
    const m = new Map<string, string>();
    paidInvoices.forEach((inv) => m.set(inv.id, inv.status ?? ""));
    return m;
  }, [paidInvoices]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🧾 Hóa đơn đã thanh toán</h1>
            <p className="text-gray-600">
              Các đơn hàng của bạn đã được thanh toán thành công.
            </p>
          </div>
          <Link
            to="/user/profile"
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
          >
            ← Về tài khoản
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex flex-wrap items-center justify-between gap-2">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void refetch()}
              className="font-semibold underline"
            >
              Thử lại
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập để xem hóa đơn</h2>
            <p className="text-gray-600 mb-6">Chỉ bạn mới xem được lịch sử thanh toán của mình.</p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Đăng nhập
            </Link>
          </div>
        )}

        {isAuthenticated && loading && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600">Đang tải hóa đơn…</p>
          </div>
        )}

        {isAuthenticated && !loading && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <label className="text-sm font-semibold text-gray-700">Sắp xếp theo:</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  goToPage(1);
                }}
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
                    {["Mã hóa đơn", "Ngày", "Số mục", "Tổng tiền", "Trạng thái", "Hành động"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-gray-800 break-all max-w-[200px]">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(invoice.date)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{invoice.items} mục</td>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                        {formatMoney(invoice.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <StatusBadge status={statusById.get(invoice.id) || "PAID"} />
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        <Link
                          to={`/user/invoices/${invoice.id}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-4">
              {currentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="bg-white rounded-lg shadow-md p-4 border-l-4 border-emerald-500"
                >
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-gray-500 break-all">{invoice.id}</p>
                      <p className="text-sm text-gray-600 mt-1">{formatDate(invoice.date)}</p>
                    </div>
                    <StatusBadge status={statusById.get(invoice.id) || "PAID"} />
                  </div>
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-700">Số mục:</span> {invoice.items}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Tổng tiền:</span>
                      <span className="text-lg font-bold text-blue-600 ml-2">
                        {formatMoney(invoice.totalAmount)}
                      </span>
                    </p>
                  </div>
                  <Link
                    to={`/user/invoices/${invoice.id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              ))}
            </div>

            {totalCount === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600">Bạn chưa có hóa đơn đã thanh toán nào.</p>
                <Link
                  to="/user/products"
                  className="inline-block mt-4 text-blue-600 font-semibold hover:underline"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Pagination current={currentPage} total={totalPages} onChange={goToPage} />
                <p className="text-sm text-gray-600">
                  Hiển thị {startIndex + 1}–{startIndex + currentInvoices.length} trong {totalCount}{" "}
                  hóa đơn
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
