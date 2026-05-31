"use client";

import { useState, useEffect } from "react";
import { useSupplier } from "./useSupplier";
import type {
  SupplierResponse,
  SupplierCreationRequest,
  SupplierUpdateRequest,
} from "../../../types/supplierTypes";

function SupplierGridCard({
  supplier,
  onEdit,
  onDelete,
}: {
  supplier: SupplierResponse;
  onEdit: (s: SupplierResponse) => void;
  onDelete: (s: SupplierResponse) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group animate-fade-in">
      <div className="relative h-24 bg-gradient-to-br from-amber-100 to-slate-50 flex items-center justify-center">
        <span className="text-4xl">🏭</span>
        {supplier.status != null && (
          <span className="absolute top-3 right-3 bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
            {supplier.status}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 line-clamp-1">{supplier.name}</h3>
        <p className="text-sm text-slate-600 truncate">{supplier.email ?? "—"}</p>
        <p className="text-xs text-slate-500 mt-1">{supplier.phone ?? "—"}</p>
        <p className="text-xs text-slate-500 truncate">{supplier.address ?? "—"}</p>
        <div className="flex items-center justify-end gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(supplier)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            title="Edit"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDelete(supplier)}
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

function SupplierListRow({
  supplier,
  onEdit,
  onDelete,
}: {
  supplier: SupplierResponse;
  onEdit: (s: SupplierResponse) => void;
  onDelete: (s: SupplierResponse) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-lg transition-all product-row animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🏭</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-800 truncate">{supplier.name}</h3>
            {supplier.status != null && (
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
                {supplier.status}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 truncate">{supplier.email ?? "—"} · {supplier.phone ?? "—"}</p>
          <p className="text-xs text-slate-500 truncate">{supplier.address ?? "—"}</p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(supplier)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            title="Edit"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDelete(supplier)}
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

export default function SupplierPage() {
  const {
    suppliers: filteredSuppliers,
    allSuppliers,
    loading,
    error,
    search,
    setSearch,
    viewMode,
    setViewMode,
    stats,
    formModalOpen,
    editModalOpen,
    deleteModalOpen,
    supplierToEdit,
    supplierToDelete,
    toast,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeFormModal,
    closeEditModal,
    closeDeleteModal,
    handleCreateSupplier,
    handleUpdateSupplier,
    handleDeleteSupplier,
  } = useSupplier();

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [formData, setFormData] = useState<SupplierCreationRequest>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editFormData, setEditFormData] = useState<SupplierUpdateRequest>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (editModalOpen && supplierToEdit) {
      setEditFormData({
        name: supplierToEdit.name ?? "",
        email: supplierToEdit.email ?? "",
        phone: supplierToEdit.phone ?? "",
        address: supplierToEdit.address ?? "",
      });
    }
  }, [editModalOpen, supplierToEdit]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const payload: SupplierCreationRequest = {
        name: formData.name.trim(),
        email: formData.email?.trim() || undefined,
        phone: formData.phone.trim(),
        address: formData.address?.trim() || undefined,
      };
      await handleCreateSupplier(payload);
      setFormData({ name: "", email: "", phone: "", address: "" });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierToEdit?.id) return;
    setEditSubmitting(true);
    try {
      const payload: SupplierUpdateRequest = {
        name: editFormData.name?.trim() || undefined,
        email: editFormData.email?.trim() || undefined,
        phone: editFormData.phone?.trim() || undefined,
        address: editFormData.address?.trim() || undefined,
      };
      await handleUpdateSupplier(supplierToEdit.id, payload);
    } finally {
      setEditSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setDeleteSubmitting(true);
    try {
      await handleDeleteSupplier();
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
        .product-row:hover { background: linear-gradient(90deg, #fffbeb 0%, #ffffff 100%); }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
      `}</style>

      <header className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🏭</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Pet Shop Admin</h1>
                <p className="text-amber-100 text-xs">Manage suppliers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                <span>🏭</span>
                <span>{stats.total} Suppliers</span>
              </div>
              <button
                type="button"
                onClick={openAddModal}
                className="flex items-center gap-2 bg-white text-amber-600 px-4 py-2 rounded-xl font-semibold hover:bg-amber-50 transition-all shadow-md hover:shadow-lg"
              >
                <span>➕</span>
                <span className="hidden sm:inline">Add Supplier</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏭</span>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium">Total Suppliers</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, phone, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            Showing {filteredSuppliers.length} of {allSuppliers.length} suppliers
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-amber-100 text-amber-600" : "hover:bg-slate-100 text-slate-400"}`}
              title="Grid"
            >
              ▦
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-amber-100 text-amber-600" : "hover:bg-slate-100 text-slate-400"}`}
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
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Loading suppliers...</p>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">🏭</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No suppliers found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search or add a new supplier</p>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-all"
            >
              <span>➕</span> Add Supplier
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-4 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {viewMode === "grid"
              ? filteredSuppliers.map((s) => (
                  <SupplierGridCard
                    key={s.id}
                    supplier={s}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                  />
                ))
              : filteredSuppliers.map((s) => (
                  <SupplierListRow
                    key={s.id}
                    supplier={s}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                  />
                ))}
          </div>
        )}
      </main>

      {/* Add Supplier Modal */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeFormModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Add Supplier</h2>
                <button type="button" onClick={closeFormModal} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                  ✕
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="supplier-name" className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                  <input
                    id="supplier-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="Supplier name"
                  />
                </div>
                <div>
                  <label htmlFor="supplier-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    id="supplier-email"
                    type="email"
                    value={formData.email ?? ""}
                    onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="supplier@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="supplier-phone" className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                  <input
                    id="supplier-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="0912345678"
                  />
                </div>
                <div>
                  <label htmlFor="supplier-address" className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input
                    id="supplier-address"
                    type="text"
                    value={formData.address ?? ""}
                    onChange={(e) => setFormData((d) => ({ ...d, address: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="Optional"
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeFormModal}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all"
                  >
                    {formSubmitting ? "Adding..." : "Add Supplier"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {editModalOpen && supplierToEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeEditModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Edit supplier</h2>
                <button type="button" onClick={closeEditModal} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                  ✕
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                {supplierToEdit.status != null && (
                  <div className="rounded-xl bg-slate-50 p-3 mb-4">
                    <p className="text-xs text-slate-500 font-medium">Status</p>
                    <p className="text-sm text-slate-800">{supplierToEdit.status}</p>
                  </div>
                )}
                <div>
                  <label htmlFor="edit-supplier-name" className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                  <input
                    id="edit-supplier-name"
                    type="text"
                    required
                    value={editFormData.name ?? ""}
                    onChange={(e) => setEditFormData((d) => ({ ...d, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="Supplier name"
                  />
                </div>
                <div>
                  <label htmlFor="edit-supplier-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    id="edit-supplier-email"
                    type="email"
                    value={editFormData.email ?? ""}
                    onChange={(e) => setEditFormData((d) => ({ ...d, email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="supplier@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="edit-supplier-phone" className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    id="edit-supplier-phone"
                    type="tel"
                    value={editFormData.phone ?? ""}
                    onChange={(e) => setEditFormData((d) => ({ ...d, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="0912345678"
                  />
                </div>
                <div>
                  <label htmlFor="edit-supplier-address" className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input
                    id="edit-supplier-address"
                    type="text"
                    value={editFormData.address ?? ""}
                    onChange={(e) => setEditFormData((d) => ({ ...d, address: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="Optional"
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editSubmitting}
                    className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all"
                  >
                    {editSubmitting ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && supplierToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDeleteModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🗑️</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Delete supplier?</h3>
                <p className="text-slate-500 mb-6">
                  Are you sure you want to remove &quot;{supplierToDelete.name}&quot;? This action cannot be undone.
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
