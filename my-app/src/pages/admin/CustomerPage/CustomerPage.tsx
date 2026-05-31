"use client";

import { useState, useEffect } from "react";
import { useCustomer } from "./useCustomer";
import type { CustomerResponse } from "../../../types/customerTypes";
import type {UserCreationRequest, UserUpdateRequest} from "../../../types/userTypes";

function customerDisplayName(c: CustomerResponse): string {
  const u = c.user;
  if (u?.firstName || u?.lastName) return [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  return u?.username ?? "—";
}

function CustomerGridCard({
  customer,
  onEdit,
  onAddPoints,
  onDelete,
}: {
  customer: CustomerResponse;
  onEdit: (c: CustomerResponse) => void;
  onAddPoints: (c: CustomerResponse) => void;
  onDelete: (c: CustomerResponse) => void;
}) {
  const u = customer.user;
  const name = customerDisplayName(customer);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group animate-fade-in">
      <div className="relative h-24 bg-gradient-to-br from-teal-100 to-slate-50 flex items-center justify-center">
        <span className="text-4xl">🧑‍🤝‍🧑</span>
        <span className="absolute top-3 right-3 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
          {customer.points ?? 0} pts
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 line-clamp-1">{name}</h3>
        <p className="text-xs text-slate-500 font-mono mb-1">{u?.username ?? "—"}</p>
        <p className="text-sm text-slate-600 truncate">{u?.email ?? "—"}</p>
        <p className="text-xs text-slate-500 mt-1">{u?.phone ?? "—"}</p>
        <div className="flex items-center justify-end gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(customer)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            title="Edit"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onAddPoints(customer)}
            className="p-2 hover:bg-amber-50 rounded-lg transition-all"
            title="Add points"
          >
            ⭐
          </button>
          <button
            type="button"
            onClick={() => onDelete(customer)}
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

function CustomerListRow({
  customer,
  onEdit,
  onAddPoints,
  onDelete,
}: {
  customer: CustomerResponse;
  onEdit: (c: CustomerResponse) => void;
  onAddPoints: (c: CustomerResponse) => void;
  onDelete: (c: CustomerResponse) => void;
}) {
  const u = customer.user;
  const name = customerDisplayName(customer);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-lg transition-all product-row animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🧑‍🤝‍🧑</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-800 truncate">{name}</h3>
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">
              {customer.points ?? 0} pts
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono truncate">{u?.username ?? "—"}</p>
          <p className="text-sm text-slate-500 truncate">{u?.email ?? "—"} · {u?.phone ?? "—"}</p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(customer)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            title="Edit"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onAddPoints(customer)}
            className="p-2 hover:bg-amber-50 rounded-lg transition-all"
            title="Add points"
          >
            ⭐
          </button>
          <button
            type="button"
            onClick={() => onDelete(customer)}
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

export default function CustomerPage() {
  const {
    customers: filteredCustomers,
    allCustomers,
    loading,
    error,
    search,
    setSearch,
    viewMode,
    setViewMode,
    stats,
    formModalOpen,
    editModalOpen,
    pointsModalOpen,
    deleteModalOpen,
    editingCustomer,
    customerToEdit,
    customerToDelete,
    toast,
    openAddModal,
    openEditModal,
    openPointsModal,
    closeFormModal,
    closeEditModal,
    closePointsModal,
    openDeleteModal,
    closeDeleteModal,
    handleCreateCustomer,
    handleUpdateCustomer,
    handleAddPoints,
    handleDeleteCustomer,
  } = useCustomer();

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [pointsSubmitting, setPointsSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    points: 0,
  });
  const [pointsValue, setPointsValue] = useState(0);

  useEffect(() => {
    if (editModalOpen && customerToEdit) {
      const u = customerToEdit.user;
      setEditFormData({
        firstName: u?.firstName ?? "",
        lastName: u?.lastName ?? "",
        email: u?.email ?? "",
        phone: u?.phone ?? "",
        address: u?.address ?? "",
        points: customerToEdit.points ?? 0,
      });
    }
  }, [editModalOpen, customerToEdit]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const payload: UserCreationRequest = {
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim() || undefined,
        password: formData.password,
      };
      await handleCreateCustomer(payload);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", address: "", password: "" });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerToEdit?.id) return;
    setEditSubmitting(true);
    try {
      const payload: UserUpdateRequest = {
        firstName: editFormData.firstName.trim() || undefined,
        lastName: editFormData.lastName.trim() || undefined,
        email: editFormData.email.trim() || undefined,
        phone: editFormData.phone.trim() || undefined,
        address: editFormData.address.trim() || undefined,
      };
      await handleUpdateCustomer(customerToEdit.user.id, payload);
    } finally {
      setEditSubmitting(false);
    }
  };

  const openPointsModalFor = (c: CustomerResponse) => {
    setPointsValue(0);
    openPointsModal(c);
  };

  const handlePointsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer?.id || pointsValue <= 0) return;
    setPointsSubmitting(true);
    try {
      await handleAddPoints(editingCustomer.id, pointsValue);
    } finally {
      setPointsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setDeleteSubmitting(true);
    try {
      await handleDeleteCustomer();
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
        .product-row:hover { background: linear-gradient(90deg, #f0fdfa 0%, #ffffff 100%); }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
      `}</style>

      <header className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🐾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Pet Shop Admin</h1>
                <p className="text-teal-100 text-xs">Manage customers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                <span>🧑‍🤝‍🧑</span>
                <span>{stats.total} Customers</span>
              </div>
              <button
                type="button"
                onClick={openAddModal}
                className="flex items-center gap-2 bg-white text-teal-600 px-4 py-2 rounded-xl font-semibold hover:bg-teal-50 transition-all shadow-md hover:shadow-lg"
              >
                <span>➕</span>
                <span className="hidden sm:inline">Add Customer</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🧑‍🤝‍🧑</span>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium">Total Customers</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium">Total Points</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalPoints}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search by name, username, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            Showing {filteredCustomers.length} of {allCustomers.length} customers
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-teal-100 text-teal-600" : "hover:bg-slate-100 text-slate-400"}`}
              title="Grid"
            >
              ▦
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-teal-100 text-teal-600" : "hover:bg-slate-100 text-slate-400"}`}
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
            <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">🧑‍🤝‍🧑</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No customers found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search or add a new customer</p>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-600 transition-all"
            >
              <span>➕</span> Add Customer
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
              ? filteredCustomers.map((c) => (
                  <CustomerGridCard
                    key={c.id}
                    customer={c}
                    onEdit={openEditModal}
                    onAddPoints={openPointsModalFor}
                    onDelete={openDeleteModal}
                  />
                ))
              : filteredCustomers.map((c) => (
                  <CustomerListRow
                    key={c.id}
                    customer={c}
                    onEdit={openEditModal}
                    onAddPoints={openPointsModalFor}
                    onDelete={openDeleteModal}
                  />
                ))}
          </div>
        )}
      </main>

      {/* Add Customer Modal */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeFormModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Add Customer</h2>
                <button type="button" onClick={closeFormModal} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                  ✕
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="customer-firstName" className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                    <input
                      id="customer-firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData((d) => ({ ...d, firstName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="customer-lastName" className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                    <input
                      id="customer-lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData((d) => ({ ...d, lastName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="customer-email" className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                  <input
                    id="customer-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="customer@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="customer-phone" className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                  <input
                    id="customer-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="0912345678"
                  />
                </div>
                <div>
                  <label htmlFor="customer-address" className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input
                    id="customer-address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData((d) => ({ ...d, address: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label htmlFor="customer-password" className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                  <input
                    id="customer-password"
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData((d) => ({ ...d, password: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Min 6 characters"
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
                    className="flex-1 px-4 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all"
                  >
                    {formSubmitting ? "Adding..." : "Add Customer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editModalOpen && customerToEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeEditModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Edit customer</h2>
                <button type="button" onClick={closeEditModal} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                  ✕
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div className="rounded-xl bg-slate-50 p-3 mb-4">
                  <p className="text-xs text-slate-500 font-medium">Username (read-only)</p>
                  <p className="text-sm font-mono text-slate-800">{customerToEdit.user?.username ?? "—"}</p>
                  {customerToEdit.user?.status != null && (
                    <>
                      <p className="text-xs text-slate-500 font-medium mt-2">Status</p>
                      <p className="text-sm text-slate-800">{customerToEdit.user.status}</p>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-firstName" className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                    <input
                      id="edit-firstName"
                      type="text"
                      value={editFormData.firstName}
                      onChange={(e) => setEditFormData((d) => ({ ...d, firstName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-lastName" className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                    <input
                      id="edit-lastName"
                      type="text"
                      value={editFormData.lastName}
                      onChange={(e) => setEditFormData((d) => ({ ...d, lastName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    id="edit-email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData((d) => ({ ...d, email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="customer@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="edit-phone" className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    id="edit-phone"
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData((d) => ({ ...d, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="0912345678"
                  />
                </div>
                <div>
                  <label htmlFor="edit-address" className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input
                    id="edit-address"
                    type="text"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData((d) => ({ ...d, address: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
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
                    className="flex-1 px-4 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all"
                  >
                    {editSubmitting ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Points Modal */}
      {pointsModalOpen && editingCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closePointsModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Add points</h2>
                <p className="text-sm text-slate-500 mb-1">{customerDisplayName(editingCustomer)} ({editingCustomer.user?.username})</p>
                <p className="text-sm text-amber-600 mb-4">Current: {editingCustomer.points ?? 0} pts</p>
                <form onSubmit={handlePointsSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="add-points" className="block text-sm font-medium text-slate-700 mb-1">Points to add</label>
                    <input
                      id="add-points"
                      type="number"
                      min={1}
                      value={pointsValue || ""}
                      onChange={(e) => setPointsValue(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closePointsModal}
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={pointsSubmitting || pointsValue <= 0}
                      className="flex-1 px-4 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all disabled:opacity-50"
                    >
                      {pointsSubmitting ? "Adding..." : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && customerToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDeleteModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🗑️</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Delete customer?</h3>
                <p className="text-slate-500 mb-6">
                  Are you sure you want to remove &quot;{customerDisplayName(customerToDelete)}&quot;? This action cannot be undone.
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
