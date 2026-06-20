"use client";

import { Link, useParams } from "react-router-dom";
import { useInvoiceDetail } from "./useInvoiceDetail";
import { PAYMENT_STATUS_ENTRIES, normalizePaymentStatus } from "./paymentStatusMeta";
import StatusBadge from "../ProfilePage/components/StatusBadge";

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

function paymentMethodLabel(method: string | undefined) {
  if (!method) return "—";
  const u = method.toUpperCase().replace(/-/g, "_");
  if (u === "COD") return "Thanh toán khi nhận hàng (COD)";
  if (u === "QR_SCANNING") return "Quét mã QR";
  return method;
}

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { invoice, loading, error, isAuthenticated, refetch } = useInvoiceDetail(invoiceId);

  const currentCode = normalizePaymentStatus(invoice?.status);
  const statusKnown = PAYMENT_STATUS_ENTRIES.some((s) => s.code === currentCode);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/user/invoices"
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
          >
            ← Danh sách hóa đơn
          </Link>
        </div>

        {!isAuthenticated && (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Đăng nhập để xem chi tiết</h2>
            <Link
              to="/login"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
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

        {isAuthenticated && !loading && error && (
          <div className="p-6 bg-white rounded-xl shadow-sm border border-red-100">
            <p className="text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 text-blue-600 font-semibold underline"
            >
              Thử lại
            </button>
          </div>
        )}

        {isAuthenticated && !loading && invoice && !error && (
          <div className="space-y-8">
            <header className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Hóa đơn</p>
              <h1 className="text-2xl font-bold text-gray-900 font-mono break-all">{invoice.id}</h1>
              <p className="text-sm text-gray-600 mt-2">
                Tạo lúc <span className="font-medium">{formatDate(invoice.createdAt)}</span>
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-600">Trạng thái hiện tại:</span>
                <StatusBadge status={invoice.status ?? ""} />
                <span className="text-xs font-mono text-gray-400">({currentCode})</span>
              </div>
            </header>

            <section className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Các trạng thái thanh toán</h2>
              <p className="text-sm text-gray-600 mb-4">
                Hệ thống dùng các trạng thái sau. Trạng thái áp dụng cho đơn này được tô đậm.
              </p>
              {invoice && !statusKnown && currentCode && (
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                  Trạng thái hiện tại: <span className="font-mono font-semibold">{invoice.status}</span>
                </p>
              )}
              <ul className="grid gap-3 sm:grid-cols-1">
                {PAYMENT_STATUS_ENTRIES.map((s) => {
                  const isCurrent = s.code === currentCode;
                  return (
                    <li
                      key={s.code}
                      className={`rounded-lg border px-4 py-3 transition ${
                        isCurrent
                          ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200"
                          : "border-gray-200 bg-gray-50/80 opacity-90"
                      }`}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-mono text-xs text-gray-500">{s.code}</span>
                        {isCurrent && (
                          <span className="text-xs font-semibold text-emerald-700">Đang áp dụng</span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 mt-1">{s.title}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{s.description}</p>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin giao hàng & thanh toán</h2>
              <dl className="space-y-3 text-sm text-gray-700">
                <div>
                  <dt className="font-semibold text-gray-800">Phương thức thanh toán</dt>
                  <dd className="mt-0.5">{paymentMethodLabel(invoice.paymentMethod)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-800">Địa chỉ giao hàng</dt>
                  <dd className="mt-0.5">{invoice.shippingAddress || "—"}</dd>
                </div>
                <div className="flex flex-wrap gap-6 pt-2 border-t border-gray-100">
                  <div>
                    <dt className="text-gray-500">Tạm tính</dt>
                    <dd className="font-semibold">{formatMoney(Number(invoice.totalAmount ?? 0))}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Thực thanh toán</dt>
                    <dd className="text-lg font-bold text-emerald-700">
                      {formatMoney(Number(invoice.realAmount ?? invoice.totalAmount ?? 0))}
                    </dd>
                  </div>
                </div>
              </dl>
            </section>

            {invoice.invoiceDetails && invoice.invoiceDetails.length > 0 && (
              <section className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 px-6 py-4 border-b border-gray-100">
                  Chi tiết dòng hàng
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-gray-600">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Mục</th>
                        <th className="px-6 py-3 font-semibold text-right">Đơn giá</th>
                        <th className="px-6 py-3 font-semibold text-right">SL</th>
                        <th className="px-6 py-3 font-semibold text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.invoiceDetails.map((d) => (
                        <tr key={d.id} className="border-t border-gray-100">
                          <td className="px-6 py-3 text-gray-800">
                            {d.productId
                              ? `(${d.productName})`
                              : d.petId
                                ? `Thú cưng (${d.petId})`
                                : "Mục"}
                          </td>
                          <td className="px-6 py-3 text-right tabular-nums">
                            {formatMoney(d.unitPrice)}
                          </td>
                          <td className="px-6 py-3 text-right">{d.quantity}</td>
                          <td className="px-6 py-3 text-right font-medium tabular-nums">
                            {formatMoney(d.totalPrice ?? d.unitPrice * d.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
