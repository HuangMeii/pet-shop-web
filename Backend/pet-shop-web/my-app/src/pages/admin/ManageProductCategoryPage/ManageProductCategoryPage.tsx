"use client";

import { useState, useEffect } from "react";
import { useManageProductCategory } from "./useManageProductCategory.ts";
import type {
  CategoryResponse,
  CategoryCreationRequest,
  CategoryUpdateRequest,
} from "../../../types/categoryTypes";

function CategoryGridCard({
  category,
  onEdit,
  onDelete,
}: {
  category: CategoryResponse;
  onEdit: (c: CategoryResponse) => void;
  onDelete: (c: CategoryResponse) => void;
}) {
  const emoji = "📁";
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group animate-fade-in">
      <div className="relative h-28 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
        <span className="text-5xl">{emoji}</span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 line-clamp-1 mb-2">{category.name || "Unnamed Category"}</h3>
        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{category.description || "No description"}</p>
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            title="Edit"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
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

function CategoryListRow({
  category,
  onEdit,
  onDelete,
}: {
  category: CategoryResponse;
  onEdit: (c: CategoryResponse) => void;
  onDelete: (c: CategoryResponse) => void;
}) {
  const emoji = "📁";
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-lg transition-all product-row animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-3xl">{emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 truncate">{category.name || "Unnamed Category"}</h3>
          <p className="text-sm text-slate-500 truncate">{category.description || "No description"}</p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            title="Edit"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
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

export default function ManageProductCategoryPage() {
  const {
    categories: filteredCategories,
    allCategories,
    loading,
    error,
    search,
    setSearch,
    viewMode,
    setViewMode,
    stats,
    categoryModalOpen,
    deleteModalOpen,
    editingCategory,
    categoryToDelete,
    toast,
    openAddModal,
    openEditModal,
    closeCategoryModal,
    openDeleteModal,
    closeDeleteModal,
    handleCreateOrUpdateCategory,
    handleDeleteCategory,
  } = useManageProductCategory();

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    if (categoryModalOpen && editingCategory) {
      setFormData({
        name: editingCategory.name ?? "",
        description: editingCategory.description ?? "",
      });
    } else if (categoryModalOpen && !editingCategory) {
      setFormData({ name: "", description: "" });
    }
  }, [categoryModalOpen, editingCategory]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const payload: CategoryCreationRequest & CategoryUpdateRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      };
      await handleCreateOrUpdateCategory(payload);
    } finally {
      setFormSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setDeleteSubmitting(true);
    try {
      await handleDeleteCategory();
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
      <header className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🐾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Pet Shop Admin</h1>
                <p className="text-emerald-100 text-xs">Manage product categories</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                <span>📁</span>
                <span>{stats.total} Categories</span>
              </div>
              <button
                type="button"
                onClick={openAddModal}
                className="flex items-center gap-2 bg-white text-emerald-600 px-4 py-2 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-md hover:shadow-lg"
              >
                <span>➕</span>
                <span className="hidden sm:inline">Add Category</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📁</span>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium">Total Categories</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search categories by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Results & View Toggle */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            Showing {filteredCategories.length} of {allCategories.length} categories
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

        {/* Content */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-4 text-rose-800">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📁</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No categories found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search or add a new category</p>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-all"
            >
              <span>➕</span> Add Your First Category
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
              ? filteredCategories.map((c) => (
                  <CategoryGridCard
                    key={c.id}
                    category={c}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                  />
                ))
              : filteredCategories.map((c) => (
                  <CategoryListRow
                    key={c.id}
                    category={c}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                  />
                ))}
          </div>
        )}
      </main>

      {/* Category Modal */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCategoryModal} aria-hidden />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <button type="button" onClick={closeCategoryModal} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                  ✕
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
                <div>
                  <label htmlFor="category-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Category Name *
                  </label>
                  <input
                    id="category-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g., Dog Food"
                  />
                </div>
                <div>
                  <label htmlFor="category-description" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    id="category-description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData((d) => ({ ...d, description: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    placeholder="Category description..."
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeCategoryModal}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                  >
                    {formSubmitting ? "Saving..." : editingCategory ? "Save Changes" : "Add Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && categoryToDelete && (
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
                <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Category?</h3>
                <p className="text-slate-500 mb-6">
                  Are you sure you want to delete &quot;{categoryToDelete.name || "this category"}&quot;?
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
