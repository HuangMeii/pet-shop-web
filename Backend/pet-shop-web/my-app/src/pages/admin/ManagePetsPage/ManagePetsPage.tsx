"use client";

import { useState, useEffect, useRef } from "react";
import { usePets } from "./usePets";
import type { PetResponse, PetCreationRequest, PetUpdateRequest } from "../../../types/petTypes";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "../../../services/cloudinaryService";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value ?? 0);
}

function formatDate(s: string): string {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("vi-VN");
  } catch {
    return s;
  }
}

function PetGridCard({
  pet,
  onEdit,
  onMarkSold,
  onDelete,
}: {
  pet: PetResponse;
  onEdit: (p: PetResponse) => void;
  onMarkSold: (p: PetResponse) => void;
  onDelete: (p: PetResponse) => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const available = pet.available !== false;
  const showImg = pet.imageUrl && !imgFailed;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group animate-fade-in">
      <div className="relative h-24 bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center overflow-hidden">
        {showImg ? (
          <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" loading="lazy" onError={() => setImgFailed(true)} />
        ) : (
          <span className="text-4xl">🐕</span>
        )}
        <span
          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
            available ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
          }`}
        >
          {available ? "Còn" : "Đã bán"}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 line-clamp-1">{pet.name ?? "—"}</h3>
        <p className="text-sm text-slate-600">
          {pet.species ?? "—"} · {pet.breed ?? "—"}
        </p>
        <p className="text-xs text-slate-500 mt-1">{pet.gender ?? "—"} · {pet.vaccinated ? "Đã tiêm" : "Chưa tiêm"}</p>
        <p className="text-sm font-bold text-amber-600 mt-2">{formatCurrency(pet.price ?? 0)}</p>
        <div className="flex items-center justify-end gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(pet)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            title="Sửa"
          >
            ✏️
          </button>
          {available && (
            <button
              type="button"
              onClick={() => onMarkSold(pet)}
              className="p-2 hover:bg-emerald-50 rounded-lg transition-all"
              title="Đánh dấu đã bán"
            >
              ✅
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(pet)}
            className="p-2 hover:bg-rose-50 rounded-lg transition-all"
            title="Xóa"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

function PetListRow({
  pet,
  onEdit,
  onMarkSold,
  onDelete,
}: {
  pet: PetResponse;
  onEdit: (p: PetResponse) => void;
  onMarkSold: (p: PetResponse) => void;
  onDelete: (p: PetResponse) => void;
}) {
  const available = pet.available !== false;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-lg transition-all product-row animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
          {pet.imageUrl ? (
            <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <span className="text-2xl">🐕</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-800 truncate">{pet.name ?? "—"}</h3>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                available ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
              }`}
            >
              {available ? "Còn" : "Đã bán"}
            </span>
          </div>
          <p className="text-sm text-slate-500 truncate">
            {pet.species ?? "—"} · {pet.breed ?? "—"} · {pet.gender ?? "—"}
          </p>
          <p className="text-xs text-slate-400 mt-1">Sinh: {formatDate(pet.birth)} · {pet.vaccinated ? "Đã tiêm" : "Chưa tiêm"}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-amber-600">{formatCurrency(pet.price ?? 0)}</p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(pet)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            title="Sửa"
          >
            ✏️
          </button>
          {available && (
            <button
              type="button"
              onClick={() => onMarkSold(pet)}
              className="p-2 hover:bg-emerald-50 rounded-lg transition-all"
              title="Đánh dấu đã bán"
            >
              ✅
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(pet)}
            className="p-2 hover:bg-rose-50 rounded-lg transition-all"
            title="Xóa"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManagePetsPage() {
  const {
    pets: filteredPets,
    allPets,
    loading,
    error,
    search,
    setSearch,
    viewMode,
    setViewMode,
    stats,
    formModalOpen,
    editModalOpen,
    soldModalOpen,
    deleteModalOpen,
    petToEdit,
    petToMarkSold,
    petToDelete,
    toast,
    openAddModal,
    openEditModal,
    openSoldModal,
    closeFormModal,
    closeEditModal,
    closeSoldModal,
    openDeleteModal,
    closeDeleteModal,
    handleCreatePet,
    handleUpdatePet,
    handleMarkAsSold,
    handleDeletePet,
  } = usePets();

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefEdit = useRef<HTMLInputElement>(null);
  const cloudinaryEnabled = isCloudinaryConfigured();

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrl: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageUploadError(null);
    setImageUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url);
    } catch (err) {
      setImageUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setImageUploading(false);
      e.target.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (fileInputRefEdit.current) fileInputRefEdit.current.value = "";
    }
  };

  const [formData, setFormData] = useState<PetCreationRequest>({
    name: "",
    species: "",
    breed: "",
    birth: "",
    gender: "",
    price: 0,
    vaccinated: false,
    imageUrl: "",
  });
  const [editFormData, setEditFormData] = useState<PetUpdateRequest & { birth: string }>({
    name: "",
    species: "",
    breed: "",
    birth: "",
    gender: "",
    price: 0,
    vaccinated: false,
    imageUrl: "",
    available: true,
  });

  useEffect(() => {
    if (formModalOpen || editModalOpen) setImageUploadError(null);
  }, [formModalOpen, editModalOpen]);

  useEffect(() => {
    if (editModalOpen && petToEdit) {
      const b = petToEdit.birth ?? "";
      const birthStr = typeof b === "string" ? b.split("T")[0] ?? "" : "";
      setEditFormData({
        name: petToEdit.name ?? "",
        species: petToEdit.species ?? "",
        breed: petToEdit.breed ?? "",
        birth: birthStr,
        gender: petToEdit.gender ?? "",
        price: petToEdit.price ?? 0,
        vaccinated: petToEdit.vaccinated ?? false,
        imageUrl: petToEdit.imageUrl ?? "",
        available: petToEdit.available !== false,
      });
    }
  }, [editModalOpen, petToEdit]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const birthStr = formData.birth.trim();
      if (!birthStr) {
        alert("Vui lòng nhập ngày sinh");
        return;
      }
      await handleCreatePet({
        ...formData,
        birth: birthStr,
        price: Number(formData.price) || 0,
        imageUrl: formData.imageUrl?.trim() || undefined,
      });
      setFormData({ name: "", species: "", breed: "", birth: "", gender: "", price: 0, vaccinated: false, imageUrl: "" });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petToEdit?.id) return;
    setEditSubmitting(true);
    try {
      const birthStr = editFormData.birth.trim();
      if (!birthStr) {
        alert("Vui lòng nhập ngày sinh");
        return;
      }
      await handleUpdatePet(petToEdit.id, {
        ...editFormData,
        birth: birthStr,
        price: editFormData.price ? Number(editFormData.price) : undefined,
        imageUrl: editFormData.imageUrl?.trim() || undefined,
      });
    } finally {
      setEditSubmitting(false);
    }
  };

  const confirmMarkSold = async () => {
    if (!petToMarkSold?.id) return;
    await handleMarkAsSold(petToMarkSold.id);
    closeSoldModal();
  };

  const confirmDelete = async () => {
    setDeleteSubmitting(true);
    try {
      await handleDeletePet();
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
        .product-row:hover { background: linear-gradient(90deg, #fff7ed 0%, #ffffff 100%); }
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
                <span className="text-2xl">🐕</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Pet Shop Admin</h1>
                <p className="text-amber-100 text-xs">Quản lý thú cưng</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                <span>🐕</span>
                <span>{stats.total} thú cưng</span>
              </div>
              <button
                type="button"
                onClick={openAddModal}
                className="flex items-center gap-2 bg-white text-amber-600 px-4 py-2 rounded-xl font-semibold hover:bg-amber-50 transition-all shadow-md hover:shadow-lg"
              >
                <span>➕</span>
                <span className="hidden sm:inline">Thêm thú cưng</span>
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
                <span className="text-2xl">🐕</span>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium">Tổng số</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium">Còn hàng</p>
                <p className="text-2xl font-bold text-slate-800">{stats.available}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Tìm theo tên, loài, giống, giới tính..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            Hiển thị {filteredPets.length} / {allPets.length} thú cưng
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-amber-100 text-amber-600" : "hover:bg-slate-100 text-slate-400"}`}
              title="Lưới"
            >
              ▦
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-amber-100 text-amber-600" : "hover:bg-slate-100 text-slate-400"}`}
              title="Danh sách"
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
            <p className="text-slate-500">Đang tải...</p>
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">🐕</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Chưa có thú cưng</h3>
            <p className="text-slate-500 mb-6">Thêm thú cưng mới để bắt đầu</p>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-all"
            >
              <span>➕</span> Thêm thú cưng
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
              ? filteredPets.map((p) => (
                  <PetGridCard
                    key={p.id}
                    pet={p}
                    onEdit={openEditModal}
                    onMarkSold={openSoldModal}
                    onDelete={openDeleteModal}
                  />
                ))
              : filteredPets.map((p) => (
                  <PetListRow
                    key={p.id}
                    pet={p}
                    onEdit={openEditModal}
                    onMarkSold={openSoldModal}
                    onDelete={openDeleteModal}
                  />
                ))}
          </div>
        )}
      </main>

      {/* Add Pet Modal */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeFormModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Thêm thú cưng</h2>
                <button type="button" onClick={closeFormModal} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                  ✕
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tên *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="Tên thú cưng"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Loài *</label>
                    <input
                      type="text"
                      required
                      value={formData.species}
                      onChange={(e) => setFormData((d) => ({ ...d, species: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      placeholder="Chó, Mèo..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Giống *</label>
                    <input
                      type="text"
                      required
                      value={formData.breed}
                      onChange={(e) => setFormData((d) => ({ ...d, breed: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      placeholder="Poodle, Maine Coon..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ngày sinh *</label>
                    <input
                      type="date"
                      required
                      value={formData.birth}
                      onChange={(e) => setFormData((d) => ({ ...d, birth: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Giới tính *</label>
                    <select
                      required
                      value={formData.gender}
                      onChange={(e) => setFormData((d) => ({ ...d, gender: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    >
                      <option value="">Chọn</option>
                      <option value="Đực">Đực</option>
                      <option value="Cái">Cái</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giá (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price || ""}
                    onChange={(e) => setFormData((d) => ({ ...d, price: Number(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="form-vaccinated"
                    checked={formData.vaccinated}
                    onChange={(e) => setFormData((d) => ({ ...d, vaccinated: e.target.checked }))}
                    className="rounded border-slate-200"
                  />
                  <label htmlFor="form-vaccinated" className="text-sm font-medium text-slate-700">Đã tiêm phòng</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Ảnh thú cưng</label>
                  <div className="space-y-3">
                    {cloudinaryEnabled && (
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileChange(e, (url) => setFormData((d) => ({ ...d, imageUrl: url })))}
                          disabled={imageUploading}
                          className="hidden"
                          id="pet-image-file-add"
                        />
                        <label
                          htmlFor="pet-image-file-add"
                          className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl font-medium cursor-pointer transition-all ${
                            imageUploading
                              ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                              : "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                          }`}
                        >
                          {imageUploading ? (
                            <>
                              <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                              Đang tải...
                            </>
                          ) : (
                            <>
                              <span>📷</span>
                              Chọn ảnh từ file
                            </>
                          )}
                        </label>
                        {imageUploadError && <p className="text-sm text-rose-600">{imageUploadError}</p>}
                      </div>
                    )}
                    <div>
                      <label htmlFor="pet-image-url-add" className="block text-xs text-slate-500 mb-1">
                        {cloudinaryEnabled ? "Hoặc dán URL ảnh" : "URL ảnh"}
                      </label>
                      <input
                        id="pet-image-url-add"
                        type="url"
                        value={formData.imageUrl ?? ""}
                        onChange={(e) => {
                          setFormData((d) => ({ ...d, imageUrl: e.target.value }));
                          setImageUploadError(null);
                        }}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="https://..."
                      />
                    </div>
                    {formData.imageUrl && (
                      <div className="flex items-start gap-3">
                        <div className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex-shrink-0">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(el) => { (el.target as HTMLImageElement).style.display = "none"; }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 break-all flex-1 min-w-0 truncate">{formData.imageUrl}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={closeFormModal} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                    Hủy
                  </button>
                  <button type="submit" disabled={formSubmitting} className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all">
                    {formSubmitting ? "Đang thêm..." : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Pet Modal */}
      {editModalOpen && petToEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeEditModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Sửa thú cưng</h2>
                <button type="button" onClick={closeEditModal} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                  ✕
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tên</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData((d) => ({ ...d, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="Tên thú cưng"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Loài</label>
                    <input
                      type="text"
                      value={editFormData.species}
                      onChange={(e) => setEditFormData((d) => ({ ...d, species: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Giống</label>
                    <input
                      type="text"
                      value={editFormData.breed}
                      onChange={(e) => setEditFormData((d) => ({ ...d, breed: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ngày sinh *</label>
                    <input
                      type="date"
                      required
                      value={editFormData.birth}
                      onChange={(e) => setEditFormData((d) => ({ ...d, birth: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Giới tính</label>
                    <select
                      value={editFormData.gender}
                      onChange={(e) => setEditFormData((d) => ({ ...d, gender: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    >
                      <option value="">Chọn</option>
                      <option value="Đực">Đực</option>
                      <option value="Cái">Cái</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giá (VNĐ)</label>
                  <input
                    type="number"
                    min={1}
                    value={editFormData.price || ""}
                    onChange={(e) => setEditFormData((d) => ({ ...d, price: Number(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-vaccinated"
                    checked={editFormData.vaccinated ?? false}
                    onChange={(e) => setEditFormData((d) => ({ ...d, vaccinated: e.target.checked }))}
                    className="rounded border-slate-200"
                  />
                  <label htmlFor="edit-vaccinated" className="text-sm font-medium text-slate-700">Đã tiêm phòng</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-available"
                    checked={editFormData.available ?? true}
                    onChange={(e) => setEditFormData((d) => ({ ...d, available: e.target.checked }))}
                    className="rounded border-slate-200"
                  />
                  <label htmlFor="edit-available" className="text-sm font-medium text-slate-700">Còn hàng</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Ảnh thú cưng</label>
                  <div className="space-y-3">
                    {cloudinaryEnabled && (
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          ref={fileInputRefEdit}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileChange(e, (url) => setEditFormData((d) => ({ ...d, imageUrl: url })))}
                          disabled={imageUploading}
                          className="hidden"
                          id="pet-image-file-edit"
                        />
                        <label
                          htmlFor="pet-image-file-edit"
                          className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl font-medium cursor-pointer transition-all ${
                            imageUploading
                              ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                              : "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                          }`}
                        >
                          {imageUploading ? (
                            <>
                              <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                              Đang tải...
                            </>
                          ) : (
                            <>
                              <span>📷</span>
                              Chọn ảnh từ file
                            </>
                          )}
                        </label>
                        {imageUploadError && <p className="text-sm text-rose-600">{imageUploadError}</p>}
                      </div>
                    )}
                    <div>
                      <label htmlFor="pet-image-url-edit" className="block text-xs text-slate-500 mb-1">
                        {cloudinaryEnabled ? "Hoặc dán URL ảnh" : "URL ảnh"}
                      </label>
                      <input
                        id="pet-image-url-edit"
                        type="url"
                        value={editFormData.imageUrl ?? ""}
                        onChange={(e) => {
                          setEditFormData((d) => ({ ...d, imageUrl: e.target.value }));
                          setImageUploadError(null);
                        }}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="https://..."
                      />
                    </div>
                    {editFormData.imageUrl && (
                      <div className="flex items-start gap-3">
                        <div className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex-shrink-0">
                          <img
                            src={editFormData.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(el) => { (el.target as HTMLImageElement).style.display = "none"; }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 break-all flex-1 min-w-0 truncate">{editFormData.imageUrl}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={closeEditModal} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                    Hủy
                  </button>
                  <button type="submit" disabled={editSubmitting} className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all">
                    {editSubmitting ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mark as Sold Modal */}
      {soldModalOpen && petToMarkSold && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeSoldModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Đánh dấu đã bán?</h3>
                <p className="text-slate-500 mb-6">
                  Xác nhận thú cưng &quot;{petToMarkSold.name}&quot; đã được bán?
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={closeSoldModal} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                    Hủy
                  </button>
                  <button type="button" onClick={confirmMarkSold} className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all">
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && petToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDeleteModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🗑️</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Xóa thú cưng?</h3>
                <p className="text-slate-500 mb-6">
                  Bạn có chắc muốn xóa &quot;{petToDelete.name}&quot;? Hành động không thể hoàn tác.
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={closeDeleteModal} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                    Hủy
                  </button>
                  <button type="button" onClick={confirmDelete} disabled={deleteSubmitting} className="flex-1 px-4 py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-all">
                    {deleteSubmitting ? "Đang xóa..." : "Xóa"}
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
