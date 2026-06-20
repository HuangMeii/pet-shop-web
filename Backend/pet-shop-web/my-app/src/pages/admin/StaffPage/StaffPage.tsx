"use client";

import { useState, useEffect } from "react";
import { useStaff } from "./useStaff";
import type { StaffResponse, StaffCreationRequest } from "../../../types/staffTypes";
import type {UserUpdateRequest} from "../../../types/userTypes.ts";

function staffDisplayName(s: StaffResponse): string {
  const u = s.user;
  if (u?.firstName || u?.lastName) return [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  return u?.username ?? "—";
}

function StaffGridCard({
  staff,
  onEdit,
  onEditShift,
  onDelete,
}: {
  staff: StaffResponse;
  onEdit: (s: StaffResponse) => void;
  onEditShift: (s: StaffResponse) => void;
  onDelete: (s: StaffResponse) => void;
}) {
  const u = staff.user;
  const name = staffDisplayName(staff);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group animate-fade-in">
      <div className="relative h-24 bg-gradient-to-br from-indigo-100 to-slate-50 flex items-center justify-center">
        <span className="text-4xl">👤</span>
        <span className="absolute top-3 right-3 bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
          Shift {staff.shift}
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
            onClick={() => onEdit(staff)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            title="Edit"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onEditShift(staff)}
            className="p-2 hover:bg-indigo-50 rounded-lg transition-all"
            title="Edit shift"
          >
            🕐
          </button>
          <button
            type="button"
            onClick={() => onDelete(staff)}
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

function StaffListRow({
  staff,
  onEdit,
  onEditShift,
  onDelete,
}: {
  staff: StaffResponse;
  onEdit: (s: StaffResponse) => void;
  onEditShift: (s: StaffResponse) => void;
  onDelete: (s: StaffResponse) => void;
}) {
  const u = staff.user;
  const name = staffDisplayName(staff);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-lg transition-all product-row animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">👤</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-800 truncate">{name}</h3>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
              Shift {staff.shift}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono truncate">{u?.username ?? "—"}</p>
          <p className="text-sm text-slate-500 truncate">{u?.email ?? "—"} · {u?.phone ?? "—"}</p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(staff)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            title="Edit"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onEditShift(staff)}
            className="p-2 hover:bg-indigo-50 rounded-lg transition-all"
            title="Edit shift"
          >
            🕐
          </button>
          <button
            type="button"
            onClick={() => onDelete(staff)}
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

const SHIFT_OPTIONS = [1, 2, 3];

export default function StaffPage() {
  const {
    staff: filteredStaff,
    allStaff,
    loading,
    error,
    search,
    setSearch,
    viewMode,
    setViewMode,
    stats,
    formModalOpen,
    editModalOpen,
    shiftModalOpen,
    deleteModalOpen,
    editingStaff,
    staffToEdit,
    staffToDelete,
    toast,
    openAddModal,
    openEditModal,
    openShiftModal,
    closeFormModal,
    closeEditModal,
    closeShiftModal,
    openDeleteModal,
    closeDeleteModal,
    handleCreateStaff,
    handleUpdateStaff,
    handleUpdateShift,
    handleDeleteStaff,
  } = useStaff();

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [shiftSubmitting, setShiftSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    shift: 1,
  });
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    shift: 1,
  });
  const [shiftValue, setShiftValue] = useState(1);

  useEffect(() => {
    if (editModalOpen && staffToEdit) {
      const u = staffToEdit.user;
      setEditFormData({
        firstName: u?.firstName ?? "",
        lastName: u?.lastName ?? "",
        email: u?.email ?? "",
        phone: u?.phone ?? "",
        address: u?.address ?? "",
        shift: staffToEdit.shift ?? 1,
      });
    }
  }, [editModalOpen, staffToEdit]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const payload: StaffCreationRequest = {
        shift: formData.shift,
        userCreationRequest: {
          firstName: formData.firstName.trim() || undefined,
          lastName: formData.lastName.trim() || undefined,
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim() || undefined,
          password: formData.password,
        },
      };
      await handleCreateStaff(payload);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        shift: 1,
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffToEdit?.id) return;
    setEditSubmitting(true);
    try {
      const payload: UserUpdateRequest = {
        firstName: editFormData.firstName.trim() || undefined,
        lastName: editFormData.lastName.trim() || undefined,
        email: editFormData.email.trim() || undefined,
        phone: editFormData.phone.trim() || undefined,
        address: editFormData.address.trim() || undefined,
      };
      await handleUpdateStaff(staffToEdit.user.id, payload);
    } finally {
      setEditSubmitting(false);
    }
  };

  const openShiftModalFor = (s: StaffResponse) => {
    setShiftValue(s.shift ?? 1);
    openShiftModal(s);
  };

  const handleShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff?.id) return;
    setShiftSubmitting(true);
    try {
      await handleUpdateShift(editingStaff.id, shiftValue);
    } finally {
      setShiftSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setDeleteSubmitting(true);
    try {
      await handleDeleteStaff();
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
        .product-row:hover { background: linear-gradient(90deg, #eef2ff 0%, #ffffff 100%); }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
      `}</style>

      <header className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🐾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Pet Shop Admin</h1>
                <p className="text-indigo-100 text-xs">Manage staff</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                <span>👤</span>
                <span>{stats.total} Staff</span>
              </div>
              <button
                type="button"
                onClick={openAddModal}
                className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg"
              >
                <span>➕</span>
                <span className="hidden sm:inline">Add Staff</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium">Total Staff</p>
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
              placeholder="Search by name, username, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            Showing {filteredStaff.length} of {allStaff.length} staff
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-indigo-100 text-indigo-600" : "hover:bg-slate-100 text-slate-400"}`}
              title="Grid"
            >
              ▦
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-indigo-100 text-indigo-600" : "hover:bg-slate-100 text-slate-400"}`}
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
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Loading staff...</p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">👤</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No staff found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search or add a new staff member</p>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-600 transition-all"
            >
              <span>➕</span> Add Staff
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
              ? filteredStaff.map((s) => (
                  <StaffGridCard
                    key={s.id}
                    staff={s}
                    onEdit={openEditModal}
                    onEditShift={openShiftModalFor}
                    onDelete={openDeleteModal}
                  />
                ))
              : filteredStaff.map((s) => (
                  <StaffListRow
                    key={s.id}
                    staff={s}
                    onEdit={openEditModal}
                    onEditShift={openShiftModalFor}
                    onDelete={openDeleteModal}
                  />
                ))}
          </div>
        )}
      </main>

      {/* Add Staff Modal */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeFormModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Add Staff</h2>
                <button type="button" onClick={closeFormModal} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                  ✕
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="staff-firstName" className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                    <input
                      id="staff-firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData((d) => ({ ...d, firstName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="staff-lastName" className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                    <input
                      id="staff-lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData((d) => ({ ...d, lastName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="staff-email" className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                  <input
                    id="staff-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="staff@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="staff-phone" className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                  <input
                    id="staff-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="0912345678"
                  />
                </div>
                <div>
                  <label htmlFor="staff-address" className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input
                    id="staff-address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData((d) => ({ ...d, address: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label htmlFor="staff-password" className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                  <input
                    id="staff-password"
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData((d) => ({ ...d, password: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Min 6 characters"
                  />
                </div>
                <div>
                  <label htmlFor="staff-shift" className="block text-sm font-medium text-slate-700 mb-1">Shift</label>
                  <select
                    id="staff-shift"
                    value={formData.shift}
                    onChange={(e) => setFormData((d) => ({ ...d, shift: parseInt(e.target.value, 10) }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    {SHIFT_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        Shift {n}
                      </option>
                    ))}
                  </select>
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
                    className="flex-1 px-4 py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-all"
                  >
                    {formSubmitting ? "Adding..." : "Add Staff"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editModalOpen && staffToEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeEditModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Edit staff</h2>
                <button type="button" onClick={closeEditModal} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                  ✕
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div className="rounded-xl bg-slate-50 p-3 mb-4">
                  <p className="text-xs text-slate-500 font-medium">Username (read-only)</p>
                  <p className="text-sm font-mono text-slate-800">{staffToEdit.user?.username ?? "—"}</p>
                  {staffToEdit.user?.status != null && (
                    <>
                      <p className="text-xs text-slate-500 font-medium mt-2">Status</p>
                      <p className="text-sm text-slate-800">{staffToEdit.user.status}</p>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-staff-firstName" className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                    <input
                      id="edit-staff-firstName"
                      type="text"
                      value={editFormData.firstName}
                      onChange={(e) => setEditFormData((d) => ({ ...d, firstName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-staff-lastName" className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                    <input
                      id="edit-staff-lastName"
                      type="text"
                      value={editFormData.lastName}
                      onChange={(e) => setEditFormData((d) => ({ ...d, lastName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="edit-staff-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    id="edit-staff-email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData((d) => ({ ...d, email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="staff@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="edit-staff-phone" className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    id="edit-staff-phone"
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData((d) => ({ ...d, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="0912345678"
                  />
                </div>
                <div>
                  <label htmlFor="edit-staff-address" className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input
                    id="edit-staff-address"
                    type="text"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData((d) => ({ ...d, address: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
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
                    className="flex-1 px-4 py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-all"
                  >
                    {editSubmitting ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Shift Modal */}
      {shiftModalOpen && editingStaff && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeShiftModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Edit shift</h2>
                <p className="text-sm text-slate-500 mb-4">{staffDisplayName(editingStaff)} ({editingStaff.user?.username})</p>
                <form onSubmit={handleShiftSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="edit-shift" className="block text-sm font-medium text-slate-700 mb-1">Shift</label>
                    <select
                      id="edit-shift"
                      value={shiftValue}
                      onChange={(e) => setShiftValue(parseInt(e.target.value, 10))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      {SHIFT_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                          Shift {n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closeShiftModal}
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={shiftSubmitting}
                      className="flex-1 px-4 py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-all"
                    >
                      {shiftSubmitting ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && staffToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDeleteModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🗑️</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Delete staff?</h3>
                <p className="text-slate-500 mb-6">
                  Are you sure you want to remove &quot;{staffDisplayName(staffToDelete)}&quot;? This action cannot be undone.
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
