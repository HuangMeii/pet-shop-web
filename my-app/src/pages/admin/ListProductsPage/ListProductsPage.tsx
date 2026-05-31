"use client";

import { useState, useEffect, useRef } from "react";
import { useListProducts } from "./useListProducts";
import type { ProductResponse } from "../../../types/productTypes";
import type { ProductCreationRequest, ProductUpdateRequest } from "../../../types/productTypes";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "../../../services/cloudinaryService";

const SORT_OPTIONS = [
  {value: "newest", label: "Newest First"},
  {value: "oldest", label: "Oldest First"},
  {value: "name-asc", label: "Name (A-Z)"},
  {value: "name-desc", label: "Name (Z-A)"},
  {value: "price-asc", label: "Price (Low-High)"},
  {value: "price-desc", label: "Price (High-Low)"},
  {value: "quantity-asc", label: "Stock (Low-High)"},
  {value: "quantity-desc", label: "Stock (High-Low)"},
] as const;

const UNIT_OPTIONS = [
  {value: "G", label: "Gram (g)"},
  {value: "KG", label: "Kilogram (kg)"},
  {value: "PHAN", label: "Phần"},

  {value: "PIECE", label: "Piece"},
  {value: "PACK", label: "Pack"},
  {value: "BAG", label: "Bag"},
  {value: "BOTTLE", label: "Bottle"},
  {value: "BOX", label: "Box"}
];

function ProductGridCard({
                           product,
                           categoryName,
                           onEdit,
                           onDelete,
                         }: {
  product: ProductResponse;
  categoryName: string;
  onEdit: (p: ProductResponse) => void;
  onDelete: (p: ProductResponse) => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const emoji = "📦";
  const q = product.quantity ?? 0;
  const stockClass = q === 0 ? "text-rose-500 bg-rose-50" : q <= 10 ? "text-amber-500 bg-amber-50" : "text-emerald-500 bg-emerald-50";
  const stockText = q === 0 ? "Out of Stock" : q <= 10 ? "Low Stock" : "In Stock";
  const availableClass = product.available !== false ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500";
  const isExpired = product.expiryDate && new Date(product.expiryDate) < new Date();
  const isExpiringSoon = product.expiryDate && !isExpired && new Date(product.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const showImg = product.imageUrl && !imgFailed;

  return (
      <div
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group animate-fade-in">
        <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
          {showImg ? (
              <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={() => setImgFailed(true)}
              />
          ) : (
              <span className="text-6xl">{emoji}</span>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <span
                className={`${availableClass} px-2 py-1 rounded-full text-xs font-medium`}>{product.available !== false ? "Active" : "Inactive"}</span>
          </div>
          {isExpired && <div
              className="absolute top-3 left-3 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-medium">Expired</div>}
          {isExpiringSoon && !isExpired && <div
              className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">Expiring
            Soon</div>}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-slate-800 line-clamp-1">{product.name || "Unnamed Product"}</h3>
            <span className="text-lg font-bold text-emerald-600">${(product.price ?? 0).toFixed(2)}</span>
          </div>
          <p className="text-sm text-slate-500 mb-3 line-clamp-2">{product.description || "No description"}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span
                className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{categoryName || "Uncategorized"}</span>
            {product.brand ?
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{product.brand}</span> : null}
          </div>
          <div className="flex items-center justify-between">
            <span
                className={`${stockClass} text-xs px-2 py-1 rounded-full font-medium`}>{stockText}: {q} {product.unit || "pcs"}</span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="button" onClick={() => onEdit(product)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-all" title="Edit">✏️
              </button>
              <button type="button" onClick={() => onDelete(product)}
                      className="p-2 hover:bg-rose-50 rounded-lg transition-all" title="Delete">🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

function ProductListRow({
                          product,
                          categoryName,
                          onEdit,
                          onDelete,
                        }: {
  product: ProductResponse;
  categoryName: string;
  onEdit: (p: ProductResponse) => void;
  onDelete: (p: ProductResponse) => void;
}) {
  const emoji = "📦";
  const q = product.quantity ?? 0;
  const stockClass = q === 0 ? "text-rose-500 bg-rose-50" : q <= 10 ? "text-amber-500 bg-amber-50" : "text-emerald-500 bg-emerald-50";
  const stockText = q === 0 ? "Out of Stock" : q <= 10 ? "Low Stock" : "In Stock";

  return (
      <div
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-lg transition-all product-row animate-fade-in">
        <div className="flex items-center gap-4">
          <div
              className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy"/>
            ) : (
                <span className="text-3xl">{emoji}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-800 truncate">{product.name || "Unnamed Product"}</h3>
              <span
                  className={`${product.available !== false ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"} px-2 py-0.5 rounded-full text-xs font-medium`}>{product.available !== false ? "Active" : "Inactive"}</span>
            </div>
            <p className="text-sm text-slate-500 truncate">{product.description || "No description"}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span
                  className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{categoryName || "Uncategorized"}</span>
              {product.brand ? <span
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{product.brand}</span> : null}
              {product.origin ? <span
                  className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">{product.origin}</span> : null}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-bold text-emerald-600">${(product.price ?? 0).toFixed(2)}</p>
            <span
                className={`${stockClass} text-xs px-2 py-1 rounded-full font-medium inline-block mt-1`}>{stockText}: {q}</span>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button type="button" onClick={() => onEdit(product)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-all" title="Edit">✏️
            </button>
            <button type="button" onClick={() => onDelete(product)}
                    className="p-2 hover:bg-rose-50 rounded-lg transition-all" title="Delete">🗑️
            </button>
          </div>
        </div>
      </div>
  );
}

export default function ListProductsPage() {
  const {
    products: filteredProducts,
    allProducts,
    categories,
    loading,
    error,
    filters,
    updateFilter,
    clearAllFilters,
    filtersVisible,
    setFiltersVisible,
    viewMode,
    setViewMode,
    stats,
    uniqueBrands,
    uniqueOrigins,
    activeFilterCount,
    productModalOpen,
    deleteModalOpen,
    editingProduct,
    productToDelete,
    toast,
    openAddModal,
    openEditModal,
    closeProductModal,
    openDeleteModal,
    closeDeleteModal,
    handleCreateOrUpdateProduct,
    handleDeleteProduct,
  } = useListProducts();

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    brand: "",
    price: "",
    quantity: "",
    unit: "piece",
    origin: "",
    expiry: "",
    imageUrl: "",
    available: true,
  });

  const cloudinaryEnabled = isCloudinaryConfigured();

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageUploadError(null);
    setImageUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setFormData((d) => ({ ...d, imageUrl: url }));
    } catch (err) {
      setImageUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setImageUploading(false);
      e.target.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (productModalOpen && editingProduct) {
      setFormData({
        name: editingProduct.name ?? "",
        description: editingProduct.description ?? "",
        categoryId: editingProduct.categoryId ?? "",
        brand: editingProduct.brand ?? "",
        price: String(editingProduct.price ?? ""),
        quantity: String(editingProduct.quantity ?? ""),
        unit: editingProduct.unit ?? "piece",
        origin: editingProduct.origin ?? "",
        expiry: editingProduct.expiryDate ? editingProduct.expiryDate.slice(0, 10) : "",
        imageUrl: editingProduct.imageUrl ?? "",
        available: editingProduct.available !== false,
      });
    } else if (productModalOpen && !editingProduct) {
      setFormData({
        name: "",
        description: "",
        categoryId: "",
        brand: "",
        price: "",
        quantity: "",
        unit: "piece",
        origin: "",
        expiry: "",
        imageUrl: "",
        available: true,
      });
    }
  }, [productModalOpen, editingProduct]);

  const getCategoryName = (product: ProductResponse) => {
    const id = product.categoryId;
    if (id) {
      const cat = categories.find((c) => c.id === id);
      if (cat) return cat.name;
    }
    return product.categoryName ?? "Uncategorized";
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const payload: ProductCreationRequest & Partial<ProductUpdateRequest> = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        categoryId: formData.categoryId,
        brand: formData.brand.trim() || undefined,
        price: parseFloat(formData.price) || 0,
        quantity: parseInt(formData.quantity, 10) || 0,
        unit: formData.unit,
        origin: formData.origin.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        available: formData.available || undefined,
      };
      if (formData.expiry) (payload as ProductUpdateRequest).expiryDate = formData.expiry;
      await handleCreateOrUpdateProduct(payload);
    } finally {
      setFormSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setDeleteSubmitting(true);
    try {
      await handleDeleteProduct();
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
                  <span className="text-2xl">🐾</span></div>
                <div>
                  <h1 className="text-xl font-bold">Pet Shop Admin</h1>
                  <p className="text-emerald-100 text-xs">Manage your products efficiently</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                    className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                  <span>📦</span>
                  <span>{stats.total} Products</span>
                </div>
                <button type="button" onClick={openAddModal}
                        className="flex items-center gap-2 bg-white text-emerald-600 px-4 py-2 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-md hover:shadow-lg">
                  <span>➕</span>
                  <span className="hidden sm:inline">Add Product</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center"><span
                    className="text-2xl">📦</span></div>
                <div>
                  <p className="text-slate-500 text-xs font-medium">Total Products</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                </div>
              </div>
            </div>
            <div
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><span
                    className="text-2xl">✓</span></div>
                <div>
                  <p className="text-slate-500 text-xs font-medium">Available</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.available}</p>
                </div>
              </div>
            </div>
            <div
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center"><span
                    className="text-2xl">⚠</span></div>
                <div>
                  <p className="text-slate-500 text-xs font-medium">Low Stock</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.lowStock}</p>
                </div>
              </div>
            </div>
            <div
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center"><span
                    className="text-2xl">✕</span></div>
                <div>
                  <p className="text-slate-500 text-xs font-medium">Out of Stock</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.outOfStock}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                  <input
                      type="text"
                      placeholder="Search products by name, brand, or description..."
                      value={filters.search}
                      onChange={(e) => updateFilter("search", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setFiltersVisible((v) => !v)}
                    className={`flex items-center gap-2 px-4 py-3 border rounded-xl font-medium text-slate-600 transition-all ${filtersVisible ? "bg-emerald-50 border-emerald-300 text-emerald-600" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                      <span
                          className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">{activeFilterCount}</span>
                  )}
                </button>
                <button type="button" onClick={clearAllFilters}
                        className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all font-medium text-slate-600">
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {filtersVisible && (
                <div className="mt-4 pt-4 border-t border-slate-100 animate-slide-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                      <select
                          value={filters.categoryId}
                          onChange={(e) => updateFilter("categoryId", e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                      >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
                      <select
                          value={filters.brand}
                          onChange={(e) => updateFilter("brand", e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                      >
                        <option value="">All Brands</option>
                        {uniqueBrands.map((b) => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Availability</label>
                      <select
                          value={filters.availability}
                          onChange={(e) => updateFilter("availability", e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                      >
                        <option value="">All Status</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                        <option value="lowstock">Low Stock (≤10)</option>
                        <option value="outofstock">Out of Stock</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Price Range</label>
                      <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.priceMin}
                            onChange={(e) => updateFilter("priceMin", e.target.value)}
                            className="w-1/2 px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.priceMax}
                            onChange={(e) => updateFilter("priceMax", e.target.value)}
                            className="w-1/2 px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Origin</label>
                      <select
                          value={filters.origin}
                          onChange={(e) => updateFilter("origin", e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                      >
                        <option value="">All Origins</option>
                        {uniqueOrigins.map((o) => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
                      <select
                          value={filters.sortBy}
                          onChange={(e) => updateFilter("sortBy", e.target.value as typeof filters.sortBy)}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                      >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Status</label>
                      <select
                          value={filters.expiry}
                          onChange={(e) => updateFilter("expiry", e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                      >
                        <option value="">All Products</option>
                        <option value="expired">Expired</option>
                        <option value="expiring-soon">Expiring Soon (30 days)</option>
                        <option value="valid">Valid</option>
                      </select>
                    </div>
                  </div>
                </div>
            )}
          </div>

          {/* Results & View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">Showing {filteredProducts.length} of {allProducts.length} products</p>
            <div className="flex items-center gap-2">
              <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-emerald-100 text-emerald-600" : "hover:bg-slate-100 text-slate-400"}`}
                  title="Grid"
              >▦
              </button>
              <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-emerald-100 text-emerald-600" : "hover:bg-slate-100 text-slate-400"}`}
                  title="List"
              >≡
              </button>
            </div>
          </div>

          {/* Content */}
          {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-4 text-rose-800">{error}</div>
          )}

          {loading ? (
              <div className="text-center py-16">
                <div
                    className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"/>
                <p className="text-slate-500">Loading products...</p>
              </div>
          ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><span
                    className="text-5xl">🐕</span></div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your filters or add a new product</p>
                <button type="button" onClick={openAddModal}
                        className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-all">
                  <span>➕</span> Add Your First Product
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
                    ? filteredProducts.map((p) => (
                        <ProductGridCard
                            key={p.id}
                            product={p}
                            categoryName={getCategoryName(p)}
                            onEdit={openEditModal}
                            onDelete={openDeleteModal}
                        />
                    ))
                    : filteredProducts.map((p) => (
                        <ProductListRow
                            key={p.id}
                            product={p}
                            categoryName={getCategoryName(p)}
                            onEdit={openEditModal}
                            onDelete={openDeleteModal}
                        />
                    ))}
              </div>
          )}

          {allProducts.length >= 999 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 mt-4">
                <p className="text-amber-800 font-medium">Maximum product limit (999) reached. Please delete some
                  products to add more.</p>
              </div>
          )}
        </main>

        {/* Product Modal */}
        {productModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeProductModal} aria-hidden/>
              <div className="relative min-h-screen flex items-center justify-center p-4">
                <div
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in"
                    onClick={(e) => e.stopPropagation()}>
                  <div
                      className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                    <button type="button" onClick={closeProductModal}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-all">✕
                    </button>
                  </div>
                  <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2">
                        <label htmlFor="product-name" className="block text-sm font-medium text-slate-700 mb-1.5">Product
                          Name *</label>
                        <input id="product-name" type="text" required value={formData.name}
                               onChange={(e) => setFormData((d) => ({...d, name: e.target.value}))}
                               className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                               placeholder="e.g., Premium Dog Food"/>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="product-description"
                               className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                        <textarea id="product-description" rows={3} value={formData.description}
                                  onChange={(e) => setFormData((d) => ({...d, description: e.target.value}))}
                                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                  placeholder="Product description..."/>
                      </div>
                      <div>
                        <label htmlFor="product-category" className="block text-sm font-medium text-slate-700 mb-1.5">Category
                          *</label>
                        <select id="product-category" required value={formData.categoryId}
                                onChange={(e) => setFormData((d) => ({...d, categoryId: e.target.value}))}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                          <option value={editingProduct? editingProduct.categoryId: ""}>{editingProduct? editingProduct.categoryName: "Select category"}</option>
                          {categories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="product-brand"
                               className="block text-sm font-medium text-slate-700 mb-1.5">Brand</label>
                        <input id="product-brand" type="text" value={formData.brand}
                               onChange={(e) => setFormData((d) => ({...d, brand: e.target.value}))}
                               className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                               placeholder="e.g., Royal Canin"/>
                      </div>
                      <div>
                        <label htmlFor="product-price" className="block text-sm font-medium text-slate-700 mb-1.5">Price
                          ($) *</label>
                        <input id="product-price" type="number" required min={0} step={0.01} value={formData.price}
                               onChange={(e) => setFormData((d) => ({...d, price: e.target.value}))}
                               className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                               placeholder="0.00"/>
                      </div>
                      <div>
                        <label htmlFor="product-quantity" className="block text-sm font-medium text-slate-700 mb-1.5">Quantity
                          *</label>
                        <input id="product-quantity" type="number" required min={0} value={formData.quantity}
                               onChange={(e) => setFormData((d) => ({...d, quantity: e.target.value}))}
                               className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                               placeholder="0"/>
                      </div>
                      <div>
                        <label htmlFor="product-unit"
                               className="block text-sm font-medium text-slate-700 mb-1.5">Unit</label>
                        <select id="product-unit" value={formData.unit}
                                onChange={(e) => setFormData((d) => ({...d, unit: e.target.value}))}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                          {UNIT_OPTIONS.map((u) => (
                              <option key={u.value} value={u.value}>
                                {u.label}
                              </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="product-origin"
                               className="block text-sm font-medium text-slate-700 mb-1.5">Origin</label>
                        <input id="product-origin" type="text" value={formData.origin}
                               onChange={(e) => setFormData((d) => ({...d, origin: e.target.value}))}
                               className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                               placeholder="e.g., USA"/>
                      </div>
                      <div>
                        <label htmlFor="product-expiry" className="block text-sm font-medium text-slate-700 mb-1.5">Expiry
                          Date</label>
                        <input id="product-expiry" type="date" value={formData.expiry}
                               onChange={(e) => setFormData((d) => ({...d, expiry: e.target.value}))}
                               className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"/>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Product image</label>
                        <div className="space-y-3">
                          {cloudinaryEnabled && (
                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageFileChange}
                                disabled={imageUploading}
                                className="hidden"
                                id="product-image-file"
                              />
                              <label
                                htmlFor="product-image-file"
                                className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl font-medium cursor-pointer transition-all ${
                                  imageUploading
                                    ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                                    : "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                }`}
                              >
                                {imageUploading ? (
                                  <>
                                    <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                                    Uploading…
                                  </>
                                ) : (
                                  <>
                                    <span>📷</span>
                                    Choose from file
                                  </>
                                )}
                              </label>
                              {imageUploadError && (
                                <p className="text-sm text-rose-600">{imageUploadError}</p>
                              )}
                            </div>
                          )}
                          <div>
                            <label htmlFor="product-image-url" className="block text-xs text-slate-500 mb-1">
                              {cloudinaryEnabled ? "Or paste image URL" : "Image URL"}
                            </label>
                            <input
                              id="product-image-url"
                              type="url"
                              value={formData.imageUrl}
                              onChange={(e) => {
                                setFormData((d) => ({ ...d, imageUrl: e.target.value }));
                                setImageUploadError(null);
                              }}
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
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
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              </div>
                              <p className="text-xs text-slate-500 break-all flex-1 min-w-0">
                                Current: {formData.imageUrl}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-6 sm:col-span-2">
                        <input id="product-available" type="checkbox" checked={formData.available}
                               onChange={(e) => setFormData((d) => ({...d, available: e.target.checked}))}
                               className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"/>
                        <label htmlFor="product-available" className="text-sm font-medium text-slate-700">Available for
                          sale</label>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                      <button type="button" onClick={closeProductModal}
                              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancel
                      </button>
                      <button type="submit" disabled={formSubmitting}
                              className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                        {formSubmitting ? "Saving..." : editingProduct ? "Save Changes" : "Add Product"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
        )}

        {/* Delete Modal */}
        {deleteModalOpen && productToDelete && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDeleteModal} aria-hidden/>
              <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in"
                     onClick={(e) => e.stopPropagation()}>
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🗑️</span></div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Product?</h3>
                    <p className="text-slate-500 mb-6">Are you sure you want to
                      delete &quot;{productToDelete.name || "this product"}&quot;?</p>
                    <div className="flex gap-3">
                      <button type="button" onClick={closeDeleteModal}
                              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancel
                      </button>
                      <button type="button" onClick={confirmDelete} disabled={deleteSubmitting}
                              className="flex-1 px-4 py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-all">{deleteSubmitting ? "Deleting..." : "Delete"}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Toast */}
        {toast && (
            <div
                className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in ${toast.type === "success" ? "bg-emerald-500" : toast.type === "error" ? "bg-rose-500" : "bg-slate-700"} text-white`}>
              <span>{toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "ℹ"}</span>
              <span className="font-medium">{toast.message}</span>
            </div>
        )}
      </div>
  );
}
