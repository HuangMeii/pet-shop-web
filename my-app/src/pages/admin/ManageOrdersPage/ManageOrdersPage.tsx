"use client";

import {useEffect, useState} from "react";
import {useManageOrders} from "./useManageOrders.ts";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusClass(status: string): string {
  const s = (status ?? "").toLowerCase();
  if (s.includes("paid") || s.includes("completed") || s.includes("delivered")) return "bg-emerald-100 text-emerald-700";
  if (s.includes("cancel") || s.includes("refund")) return "bg-rose-100 text-rose-700";
  if (s.includes("pending") || s.includes("processing")) return "bg-amber-100 text-amber-700";
  if (s.includes("shipping")) return "bg-blue-100 text-blue-700";
  return "bg-slate-100 text-slate-700";
}

function normalizeStatus(status: string | undefined): string {
  return (status ?? "").trim().toUpperCase();
}

// Status labels in Vietnamese
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xử lý",
  PAID: "Đã thanh toán",
  SHIPPING: "Đang vận chuyển",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã huỷ",
  FAILED: "Thất bại",
  REFUNDED: "Đã hoàn tiền",
};

// Button labels in Vietnamese
const TRANSITION_LABELS: Record<string, string> = {
  PAID: "Xác nhận",
  SHIPPING: "Vận chuyển",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Huỷ",
};

// Get valid transitions based on payment method
function getValidTransitions(status: string, paymentMethod: string): string[] {
  const s = status.trim().toUpperCase();
  const isCOD = paymentMethod?.toUpperCase() === "COD";

  if (s === "PENDING") {
    if (isCOD) return ["SHIPPING", "CANCELLED"]; // COD: skip PAID
    return ["PAID", "CANCELLED"]; // Online: confirm payment first
  }
  if (s === "PAID") return ["SHIPPING", "CANCELLED"];
  if (s === "SHIPPING") return ["COMPLETED", "CANCELLED"];
  return [];
}

const STATUS_TABS = ["ALL", "PENDING", "PAID", "SHIPPING", "COMPLETED", "CANCELLED", "FAILED", "REFUNDED"];

const STATUS_ICONS: Record<string, string> = {
  ALL: "📋",
  PENDING: "⏳",
  PAID: "✅",
  SHIPPING: "🚚",
  COMPLETED: "🎉",
  CANCELLED: "❌",
  FAILED: "⚠️",
  REFUNDED: "💳",
};

export default function ManageOrdersPage() {
  const {
    invoices: filteredInvoices,
    allInvoices,
    loading,
    error,
    search,
    setSearch,
    setStatusFilter,
    selectedInvoice,
    toast,
    openDetailModal,
    closeDetailModal,
    handleUpdateInvoiceStatus,
    clearFilters,
  } = useManageOrders();

  const [activeTab, setActiveTab] = useState("ALL");
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  // Sync tab with statusFilter
  useEffect(() => {
    if (activeTab === "ALL") {
      setStatusFilter("");
    } else {
      setStatusFilter(activeTab);
    }
  }, [activeTab, setStatusFilter]);

  const confirmStatusUpdate = async (newStatus: string) => {
    if (!selectedInvoice?.id) return;
    setStatusSubmitting(true);
    try {
      await handleUpdateInvoiceStatus(selectedInvoice.id, newStatus);
    } finally {
      setStatusSubmitting(false);
    }
  };

  // Get valid next statuses for current selected invoice
  const currentStatus = normalizeStatus(selectedInvoice?.status);
  const validTransitions = selectedInvoice
    ? getValidTransitions(currentStatus, selectedInvoice.paymentMethod ?? "")
    : [];

  // Count per status for tabs
  const statusCounts = (() => {
    const counts: Record<string, number> = { ALL: allInvoices.length };
    allInvoices.forEach((inv) => {
      const s = normalizeStatus(inv.status) || "UNKNOWN";
      counts[s] = (counts[s] ?? 0) + 1;
    });
    return counts;
  })();

  return (
      <div className="h-full w-full flex flex-col overflow-auto scrollbar-thin">
        <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 6px; height: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
      `}</style>

        {/* Header */}
        <header className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-lg sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">🐾</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">Pet Shop Admin</h1>
                  <p className="text-emerald-100 text-xs">Manage orders (invoices)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                  <span>🛒</span>
                  <span>{allInvoices.length} Orders</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row min-h-0 w-full" style={{ maxWidth: "1600px" }}>
          {/* Left: Orders list */}
          <div className="flex-1 min-w-0 flex-col overflow-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Search bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by invoice ID, customer name, or address..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                      type="button"
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all font-medium text-slate-600"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1.5 mb-4 overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {STATUS_TABS.map((tab) => {
                  const count = statusCounts[tab] ?? 0;
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span>{STATUS_ICONS[tab] ?? "📄"}</span>
                      <span>{tab === "ALL" ? "All" : tab}</span>
                      <span className={`text-xs ml-1 ${isActive ? "text-emerald-100" : "text-slate-400"}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-4 text-rose-800">{error}</div>
            )}

            {loading ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"/>
                  <p className="text-slate-500">Loading orders...</p>
                </div>
            ) : filteredInvoices.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-5xl">🛒</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">No orders found</h3>
                  <p className="text-slate-500">Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="space-y-3">
                  {filteredInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => openDetailModal(inv)}
                      onKeyDown={(e) => e.key === "Enter" && openDetailModal(inv)}
                      className={`bg-white rounded-2xl shadow-sm border p-4 transition-all cursor-pointer animate-fade-in ${
                        selectedInvoice?.id === inv.id
                          ? "border-emerald-500 ring-2 ring-emerald-200 shadow-md"
                          : "border-slate-100 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">🛒</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 font-mono truncate">{inv.id}</p>
                          <h3 className="font-semibold text-slate-800 truncate">{inv.customerName ?? "—"}</h3>
                          <p className="text-sm text-slate-500">{formatDate(inv.createdAt ?? "")}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-emerald-600">{formatCurrency(inv.realAmount ?? inv.totalAmount ?? 0)}</p>
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusClass(inv.status ?? "")}`}>
                            {inv.status ?? "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            )}
          </div>

          {/* Right: Order detail panel */}
          <div className="w-full lg:w-[400px] xl:w-[420px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/50 flex flex-col min-h-0 max-h-[50vh] lg:max-h-none">
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Order detail</h2>
              {selectedInvoice && (
                  <button
                      type="button"
                      onClick={closeDetailModal}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                      title="Close"
                  >
                    ✕
                  </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {!selectedInvoice ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center text-slate-500">
                    <span className="text-5xl mb-3">👆</span>
                    <p className="font-medium text-slate-600">Select an order</p>
                    <p className="text-sm mt-1">Click an order on the left to view its details here.</p>
                  </div>
              ) : (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <p className="text-xs text-slate-500 font-mono">{selectedInvoice.id}</p>
                      <p className="text-sm font-medium text-slate-700 mt-1">Customer: {selectedInvoice.customerName ?? "—"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-500">Total</p>
                        <p className="font-semibold text-slate-800">{formatCurrency(selectedInvoice.totalAmount ?? 0)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Paid</p>
                        <p className="font-semibold text-emerald-600">{formatCurrency(selectedInvoice.realAmount ?? 0)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Status</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusClass(selectedInvoice.status ?? "")}`}>
                          {selectedInvoice.status ?? "—"}
                        </span>
                      </div>
                      <div>
                        <p className="text-slate-500">Payment</p>
                        <p className="font-medium text-slate-800">{selectedInvoice.paymentMethod ?? "—"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">Created</p>
                      <p className="text-slate-800">{formatDate(selectedInvoice.createdAt ?? "")}</p>
                    </div>

                    {/* Status transition buttons */}
                    {validTransitions.length > 0 && (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
                        <div>
                          <p className="text-slate-700 text-sm font-medium">Cập nhật trạng thái</p>
                          <p className="text-xs text-slate-500 mt-0.5">Chọn trạng thái tiếp theo cho đơn hàng.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {validTransitions.map((nextStatus) => (
                            <button
                              key={nextStatus}
                              type="button"
                              onClick={() => confirmStatusUpdate(nextStatus)}
                              disabled={statusSubmitting}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                statusSubmitting
                                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                  : nextStatus === "CANCELLED"
                                    ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              }`}
                            >
                              <span>{STATUS_ICONS[nextStatus] ?? "➡️"}</span>
                              <span>{statusSubmitting ? "..." : (TRANSITION_LABELS[nextStatus] ?? nextStatus)}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {validTransitions.length === 0 && selectedInvoice.status && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                        <p className="text-sm text-slate-500">
                          {selectedInvoice.status === "COMPLETED"
                            ? "✅ Đơn hàng đã hoàn thành"
                            : selectedInvoice.status === "CANCELLED"
                              ? "❌ Đơn hàng đã huỷ"
                              : "Không có thao tác nào thêm"}
                        </p>
                      </div>
                    )}

                    {selectedInvoice.shippingAddress && (
                        <div>
                          <p className="text-slate-500 text-sm">Shipping address</p>
                          <p className="text-slate-800">{selectedInvoice.shippingAddress}</p>
                        </div>
                    )}
                    {selectedInvoice.invoiceDetails && selectedInvoice.invoiceDetails.length > 0 && (
                        <div>
                          <p className="text-slate-700 font-medium mb-2">Items</p>
                          <ul className="space-y-2 border-t border-slate-200 pt-2">
                            {selectedInvoice.invoiceDetails.map((d) => (
                                <li key={d.id} className="flex justify-between text-sm">
                                  <span>Qty: {d.quantity} × {formatCurrency(d.unitPrice ?? 0)}</span>
                                  <span className="font-medium">{formatCurrency(d.totalPrice ?? 0)}</span>
                                </li>
                            ))}
                          </ul>
                        </div>
                    )}
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
            <div
                className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in ${
                    toast.type === "success" ? "bg-emerald-500" : toast.type === "error" ? "bg-rose-500" : "bg-slate-700"
                } text-white`}
            >
              <span>{toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "ℹ"}</span>
              <span className="font-medium">{toast.message}</span>
            </div>
        )}
      </div>
  );
}
