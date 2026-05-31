"use client";

import {useState} from "react";
import {Link} from "react-router-dom";
import {usePurchase} from "./usePurchase";
import type {PurchaseDetailResponse, PurchaseResponse} from "../../../types/purchaseTypes";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("vi-VN", {
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
  return "bg-slate-100 text-slate-700";
}

function PurchaseGridCard({
                            purchase,
                            isSelected,
                            onSelect,
                            onDelete,
                          }: {
  purchase: PurchaseResponse;
  isSelected: boolean;
  onSelect: (p: PurchaseResponse) => void;
  onDelete: (p: PurchaseResponse) => void;
}) {
  const emoji = "📦";
  const status = purchase.status ?? "—";
  const supplierName = purchase.supplier?.name ?? "—";
  return (
      <div
          role="button"
          tabIndex={0}
          onClick={() => onSelect(purchase)}
          onKeyDown={(e) => e.key === "Enter" && onSelect(purchase)}
          className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all group animate-fade-in cursor-pointer ${
              isSelected ? "border-emerald-500 ring-2 ring-emerald-200 shadow-md" : "border-slate-100 hover:shadow-lg"
          }`}
      >
        <div className="relative h-24 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
          <span className="text-4xl">{emoji}</span>
          <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${statusClass(status)}`}>
          {status}
        </span>
        </div>
        <div className="p-4">
          <p className="text-xs text-slate-500 font-mono mb-1">{purchase.id}</p>
          <h3 className="font-semibold text-slate-800 line-clamp-1 mb-2">{supplierName}</h3>
          <p className="text-sm text-slate-600 mb-2">{formatCurrency(purchase.totalAmount ?? 0)}</p>
          <p className="text-xs text-slate-500 mb-3">{formatDate(purchase.createdAt ?? "")}</p>
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(purchase);
                }}
                className="p-2 hover:bg-rose-50 rounded-lg transition-all"
                title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
  );
}

function PurchaseListRow({
                           purchase,
                           isSelected,
                           onSelect,
                           onDelete,
                         }: {
  purchase: PurchaseResponse;
  isSelected: boolean;
  onSelect: (p: PurchaseResponse) => void;
  onDelete: (p: PurchaseResponse) => void;
}) {
  const emoji = "📦";
  const status = purchase.status ?? "—";
  const supplierName = purchase.supplier?.name ?? "—";
  return (
      <div
          role="button"
          tabIndex={0}
          onClick={() => onSelect(purchase)}
          onKeyDown={(e) => e.key === "Enter" && onSelect(purchase)}
          className={`bg-white rounded-2xl shadow-sm border p-4 transition-all product-row animate-fade-in cursor-pointer ${
              isSelected ? "border-emerald-500 ring-2 ring-emerald-200 shadow-md" : "border-slate-100 hover:shadow-lg"
          }`}
      >
        <div className="flex items-center gap-4">
          <div
              className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">{emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 font-mono truncate">{purchase.id}</p>
            <h3 className="font-semibold text-slate-800 truncate">{supplierName}</h3>
            <p className="text-sm text-slate-500">{formatDate(purchase.createdAt ?? "")}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-emerald-600">{formatCurrency(purchase.totalAmount ?? 0)}</p>
            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusClass(status)}`}>
            {status}
          </span>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(purchase);
                }}
                className="p-2 hover:bg-rose-50 rounded-lg transition-all"
                title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
  );
}

export default function PurchasePage() {
  const {
    purchases: filteredPurchases,
    allPurchases,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    stats,
    uniqueStatuses,
    deleteModalOpen,
    selectedPurchase,
    purchaseToDelete,
    toast,
    openDetailModal,
    closeDetailModal,
    openDeleteModal,
    closeDeleteModal,
    handleDeletePurchase,
    clearFilters,
  } = usePurchase();

  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const confirmDelete = async () => {
    setDeleteSubmitting(true);
    try {
      await handleDeletePurchase();
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
      <div className="h-full w-full flex flex-col overflow-auto scrollbar-thin">
        <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 6px; height: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .product-row:hover { background: linear-gradient(90deg, #f0fdf4 0%, #ffffff 100%); }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
      `}</style>

        {/* Header */}
        <header
            className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-lg sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">🐾</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">Pet Shop Admin</h1>
                  <p className="text-emerald-100 text-xs">Manage purchases</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                    to="/admin/purchases/add"
                    className="flex items-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold shadow hover:bg-emerald-50 transition-all"
                >
                  + Add purchase
                </Link>
                <div
                    className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                  <span>📦</span>
                  <span>{stats.total} Purchases</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div
            style={{
              maxWidth: "1600px",
            }}
        >
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-medium">Total Purchases</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by purchase ID or supplier name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div
                      style={{
                        transform: 'translateY(-20px)',
                      }}
                      className="w-full sm:w-auto"
                  >
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-40 px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    >
                      <option value="">All statuses</option>
                      {uniqueStatuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <button
                      style={{
                        transform: "translateY(-10px)"
                      }}
                      type="button"
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all font-medium text-slate-600 mt-6 sm:mt-0"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
          <main className="flex-1 flex flex-col lg:flex-row min-h-0 w-full items-stretch">

            {/* Left: Purchases list */}
            <div className="flex-1 min-w-0 flex flex-col overflow-auto px-4 sm:px-6 lg:px-8 py-6">

              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500">
                  Showing {filteredPurchases.length} of {allPurchases.length} purchases
                </p>
                <div className="flex items-center gap-2">
                  <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-emerald-100 text-emerald-600" : "hover:bg-slate-100 text-slate-400"}`}
                      title="Grid"
                  >
                    ▦
                  </button>
                  <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-emerald-100 text-emerald-600" : "hover:bg-slate-100 text-slate-400"}`}
                      title="List"
                  >
                    ≡
                  </button>
                </div>
              </div>

              {error && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-4 text-rose-800">{error}</div>
              )}

              {loading ? (
                  <div className="text-center py-16">
                    <div
                        className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"/>
                    <p className="text-slate-500">Loading purchases...</p>
                  </div>
              ) : filteredPurchases.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-5xl">📦</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No purchases found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters</p>
                  </div>
              ) : (
                  <div
                      className={`grid gap-4 ${
                          viewMode === "grid"
                              ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                              : "grid-cols-1"
                      }`}
                  >
                    {viewMode === "grid"
                        ? filteredPurchases.map((p) => (
                            <PurchaseGridCard
                                key={p.id}
                                purchase={p}
                                isSelected={selectedPurchase?.id === p.id}
                                onSelect={openDetailModal}
                                onDelete={openDeleteModal}
                            />
                        ))
                        : filteredPurchases.map((p) => (
                            <PurchaseListRow
                                key={p.id}
                                purchase={p}
                                isSelected={selectedPurchase?.id === p.id}
                                onSelect={openDetailModal}
                                onDelete={openDeleteModal}
                            />
                        ))}
                  </div>
              )}
            </div>

            {/* Right: Purchase detail panel */}
            <div
                className="w-full lg:w-[400px] xl:w-[420px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/50 flex flex-col min-h-0 max-h-[50vh] lg:max-h-none">
              <div
                  className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Purchase detail</h2>
                {selectedPurchase && (
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
                {!selectedPurchase ? (
                    <div
                        className="flex flex-col items-center justify-center h-full min-h-[200px] text-center text-slate-500">
                      <span className="text-5xl mb-3">👆</span>
                      <p className="font-medium text-slate-600">Select a purchase</p>
                      <p className="text-sm mt-1">Click a purchase on the left to view its details here.</p>
                    </div>
                ) : (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <p className="text-xs text-slate-500 font-mono">{selectedPurchase.id}</p>
                        <p className="text-sm font-medium text-slate-700 mt-1">
                          Supplier: {selectedPurchase.supplier?.name ?? "—"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-slate-500">Total</p>
                          <p className="font-semibold text-slate-800">{formatCurrency(selectedPurchase.totalAmount ?? 0)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Status</p>
                          <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusClass(selectedPurchase.status ?? "")}`}
                          >
                        {selectedPurchase.status ?? "—"}
                      </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-500 text-sm">Created</p>
                        <p className="text-slate-800">{formatDate(selectedPurchase.createdAt ?? "")}</p>
                      </div>
                      {selectedPurchase.supplier?.address && (
                          <div>
                            <p className="text-slate-500 text-sm">Supplier address</p>
                            <p className="text-slate-800">{selectedPurchase.supplier.address}</p>
                          </div>
                      )}
                      {selectedPurchase.purchaseDetails && selectedPurchase.purchaseDetails.length > 0 && (
                          <div>
                            <p className="text-slate-700 font-medium mb-2">Items</p>
                            <ul className="space-y-2 border-t border-slate-200 pt-2">
                              {selectedPurchase.purchaseDetails.map((d: PurchaseDetailResponse) => (
                                  <li key={d.id} className="flex justify-between text-sm">
                            <span>
                              {d.productName ?? d.productId} — Qty: {d.quantity} × {formatCurrency(d.unitPrice ?? 0)}
                            </span>
                                    <span className="font-medium">{formatCurrency(d.totalPrice ?? 0)}</span>
                                  </li>
                              ))}
                            </ul>
                          </div>
                      )}
                      <button
                          type="button"
                          onClick={() => openDeleteModal(selectedPurchase)}
                          className="w-full mt-4 py-2.5 border border-rose-200 text-rose-600 rounded-xl font-medium hover:bg-rose-50 transition-all"
                      >
                        Delete purchase
                      </button>
                    </div>
                )}
              </div>
            </div>
          </main>

          {deleteModalOpen && purchaseToDelete && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDeleteModal} aria-hidden/>
                <div className="relative min-h-screen flex items-center justify-center p-4">
                  <div
                      className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in"
                      onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🗑️</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Delete purchase?</h3>
                      <p className="text-slate-500 mb-6">
                        Are you sure you want to delete purchase &quot;{purchaseToDelete.id}&quot;? This action cannot
                        be
                        undone.
                      </p>
                      <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={closeDeleteModal}
                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            disabled={deleteSubmitting}
                            className="flex-1 px-4 py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-all"
                        >
                          {deleteSubmitting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
            <div
                className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in ${
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
