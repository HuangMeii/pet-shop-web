"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { usePromotions } from "./usePromotions";
import type { PromotionDetailResponse, PromotionResponse } from "../../../types/promotionTypes";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateOnly(dateString: string | undefined): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("vi-VN");
}

function statusClass(status: string): string {
  const s = (status ?? "").toUpperCase();
  if (s.includes("ACTIVE")) return "bg-emerald-100 text-emerald-700";
  if (s.includes("EXPIRED") || s.includes("INACTIVE")) return "bg-slate-200 text-slate-700";
  return "bg-amber-100 text-amber-800";
}

function discountLabel(p: PromotionResponse): string {
  const t = (p.discountType ?? "").toUpperCase();
  const v = p.discountValue ?? 0;
  if (t === "PERCENT") return `${v}%`;
  return formatCurrency(v);
}

function PromotionGridCard({
  promotion,
  isSelected,
  onSelect,
  onDelete,
}: {
  promotion: PromotionResponse;
  isSelected: boolean;
  onSelect: (p: PromotionResponse) => void;
  onDelete: (p: PromotionResponse) => void;
}) {
  const status = promotion.status ?? "—";
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(promotion)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(promotion)}
      className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all group animate-fade-in cursor-pointer ${
        isSelected ? "border-violet-500 ring-2 ring-violet-200 shadow-md" : "border-slate-100 hover:shadow-lg"
      }`}
    >
      <div className="relative h-24 bg-gradient-to-br from-violet-100 to-indigo-50 flex items-center justify-center">
        <span className="text-4xl">🏷️</span>
        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${statusClass(status)}`}>
          {status}
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs text-slate-500 font-mono mb-1">{promotion.id}</p>
        <h3 className="font-semibold text-slate-800 line-clamp-1 mb-2">{promotion.code}</h3>
        <p className="text-sm text-violet-700 font-medium mb-2">{discountLabel(promotion)}</p>
        <p className="text-xs text-slate-500 mb-3">{formatDateOnly(promotion.startDate)} → {formatDateOnly(promotion.endDate)}</p>
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(promotion);
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

function PromotionListRow({
  promotion,
  isSelected,
  onSelect,
  onDelete,
}: {
  promotion: PromotionResponse;
  isSelected: boolean;
  onSelect: (p: PromotionResponse) => void;
  onDelete: (p: PromotionResponse) => void;
}) {
  const status = promotion.status ?? "—";
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(promotion)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(promotion)}
      className={`bg-white rounded-2xl shadow-sm border p-4 transition-all product-row animate-fade-in cursor-pointer ${
        isSelected ? "border-violet-500 ring-2 ring-violet-200 shadow-md" : "border-slate-100 hover:shadow-lg"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🏷️</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 font-mono truncate">{promotion.id}</p>
          <h3 className="font-semibold text-slate-800 truncate">{promotion.code}</h3>
          <p className="text-sm text-slate-500">
            {formatDateOnly(promotion.startDate)} → {formatDateOnly(promotion.endDate)}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-violet-600">{discountLabel(promotion)}</p>
          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusClass(status)}`}>
            {status}
          </span>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(promotion);
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

function detailRows(pd: PromotionDetailResponse[] | undefined) {
  if (!pd || pd.length === 0) return <p className="text-sm text-slate-500">No products linked.</p>;
  return (
    <ul className="space-y-2 border-t border-slate-200 pt-2">
      {pd.map((d) => (
        <li key={d.id} className="flex justify-between gap-2 text-sm border-b border-slate-100 pb-2 last:border-0">
          <span className="text-slate-700">{d.productName ?? "—"}</span>
          <span className="text-xs font-mono text-slate-500 shrink-0">{d.productId}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PromotionManagementPage() {
  const {
    promotions: filteredPromotions,
    allPromotions,
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
    selectedId,
    detailPromotion,
    detailLoading,
    deleteModalOpen,
    promotionToDelete,
    toast,
    openDetail,
    closeDetail,
    openDeleteModal,
    closeDeleteModal,
    handleDeletePromotion,
    clearFilters,
  } = usePromotions();

  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const confirmDelete = async () => {
    setDeleteSubmitting(true);
    try {
      await handleDeletePromotion();
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
        .product-row:hover { background: linear-gradient(90deg, #f5f3ff 0%, #ffffff 100%); }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
      `}</style>

      <header className="bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🏷️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Pet Shop Admin</h1>
                <p className="text-violet-100 text-xs">Promotion management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/admin/promotions/add"
                className="flex items-center gap-2 bg-white text-violet-700 px-4 py-2 rounded-xl text-sm font-semibold shadow hover:bg-violet-50 transition-all"
              >
                + Add promotion
              </Link>
              <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                <span>🏷️</span>
                <span>{stats.total} Promotions</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: "1600px" }}>
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-4 sm:px-6 lg:px-8 pt-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏷️</span>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium">Total promotions</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6 mx-4 sm:mx-6 lg:mx-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by code, description, or ID…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-40 px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none bg-white"
                  >
                    <option value="">All statuses</option>
                    {uniqueStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <button
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
          <div className="flex-1 min-w-0 flex flex-col overflow-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                Showing {filteredPromotions.length} of {allPromotions.length} promotions
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-violet-100 text-violet-600" : "hover:bg-slate-100 text-slate-400"}`}
                  title="Grid"
                >
                  ▦
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-violet-100 text-violet-600" : "hover:bg-slate-100 text-slate-400"}`}
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
                <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-500">Loading promotions…</p>
              </div>
            ) : filteredPromotions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">🏷️</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No promotions found</h3>
                <p className="text-slate-500 mb-4">Try adjusting filters or add a new promotion.</p>
                <Link
                  to="/admin/promotions/add"
                  className="inline-block bg-violet-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-violet-700"
                >
                  Add promotion
                </Link>
              </div>
            ) : (
              <div
                className={`grid gap-4 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {viewMode === "grid"
                  ? filteredPromotions.map((p) => (
                      <PromotionGridCard
                        key={p.id}
                        promotion={p}
                        isSelected={selectedId === p.id}
                        onSelect={openDetail}
                        onDelete={openDeleteModal}
                      />
                    ))
                  : filteredPromotions.map((p) => (
                      <PromotionListRow
                        key={p.id}
                        promotion={p}
                        isSelected={selectedId === p.id}
                        onSelect={openDetail}
                        onDelete={openDeleteModal}
                      />
                    ))}
              </div>
            )}
          </div>

          <div className="w-full lg:w-[400px] xl:w-[420px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/50 flex flex-col min-h-0 max-h-[50vh] lg:max-h-none">
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Promotion detail</h2>
              {detailPromotion && (
                <button
                  type="button"
                  onClick={closeDetail}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                  title="Close"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {!selectedId ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center text-slate-500">
                  <span className="text-5xl mb-3">👆</span>
                  <p className="font-medium text-slate-600">Select a promotion</p>
                  <p className="text-sm mt-1">Click a promotion on the left to view details and promotion lines.</p>
                </div>
              ) : detailLoading ? (
                <p className="text-slate-500 text-sm">Loading detail…</p>
              ) : detailPromotion ? (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <p className="text-xs text-slate-500 font-mono">{detailPromotion.id}</p>
                    <p className="text-lg font-bold text-slate-900 mt-1">{detailPromotion.code}</p>
                    {detailPromotion.description && (
                      <p className="text-sm text-slate-600 mt-1">{detailPromotion.description}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Discount</p>
                      <p className="font-semibold text-violet-700">{discountLabel(detailPromotion)}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{detailPromotion.discountType}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Status</p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusClass(detailPromotion.status ?? "")}`}
                      >
                        {detailPromotion.status ?? "—"}
                      </span>
                    </div>
                  </div>
                  {(detailPromotion.discountType ?? "").toUpperCase() === "PERCENT" &&
                    detailPromotion.maxDiscountValue != null && (
                      <div>
                        <p className="text-slate-500 text-sm">Max discount cap</p>
                        <p className="font-medium text-slate-800">
                          {formatCurrency(Number(detailPromotion.maxDiscountValue))}
                        </p>
                      </div>
                    )}
                  <div>
                    <p className="text-slate-500 text-sm">Valid period</p>
                    <p className="text-slate-800">
                      {formatDateOnly(detailPromotion.startDate)} → {formatDateOnly(detailPromotion.endDate)}
                    </p>
                  </div>
                  {detailPromotion.createdAt && (
                    <div>
                      <p className="text-slate-500 text-sm">Created</p>
                      <p className="text-slate-800">{formatDate(detailPromotion.createdAt)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-slate-700 font-medium mb-2">Promotion details (products)</p>
                    {detailRows(
                      detailPromotion.promotionDetails ? [...detailPromotion.promotionDetails] : undefined
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => openDeleteModal(detailPromotion)}
                    className="w-full mt-4 py-2.5 border border-rose-200 text-rose-600 rounded-xl font-medium hover:bg-rose-50 transition-all"
                  >
                    Delete promotion
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </main>

        {deleteModalOpen && promotionToDelete && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDeleteModal} aria-hidden />
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🗑️</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Delete promotion?</h3>
                  <p className="text-slate-500 mb-6">
                    Are you sure you want to delete promotion &quot;{promotionToDelete.code}&quot;? This cannot be undone.
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
                      {deleteSubmitting ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
