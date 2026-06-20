"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { ProductResponse, ProductCreationRequest, ProductUpdateRequest } from "../../../types/productTypes";
import type { CategoryResponse } from "../../../types/categoryTypes";
import * as productService from "../../../services/productService";
import * as categoryService from "../../../services/categoryService";

export type ViewMode = "grid" | "list";
export type SortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "quantity-asc"
  | "quantity-desc";

export interface FilterState {
  search: string;
  categoryId: string;
  brand: string;
  availability: string;
  priceMin: string;
  priceMax: string;
  origin: string;
  expiry: string;
  sortBy: SortOption;
}

const defaultFilters: FilterState = {
  search: "",
  categoryId: "",
  brand: "",
  availability: "",
  priceMin: "",
  priceMax: "",
  origin: "",
  expiry: "",
  sortBy: "newest",
};

export function useListProducts() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductResponse | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    const {
      search,
      categoryId,
      brand,
      availability,
      priceMin,
      priceMax,
      origin,
      expiry,
      sortBy,
    } = filters;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name ?? "").toLowerCase().includes(q) ||
          (p.brand ?? "").toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q)
      );
    }
    if (categoryId) result = result.filter((p) => (p.categoryId ?? p.categoryName) === categoryId);
    if (brand) result = result.filter((p) => p.brand === brand);
    if (origin) result = result.filter((p) => p.origin === origin);

    const priceMinNum = parseFloat(priceMin);
    const priceMaxNum = parseFloat(priceMax);
    if (!Number.isNaN(priceMinNum) && priceMinNum > 0) result = result.filter((p) => (p.price ?? 0) >= priceMinNum);
    if (!Number.isNaN(priceMaxNum) && priceMaxNum > 0) result = result.filter((p) => (p.price ?? 0) <= priceMaxNum);

    if (availability) {
      if (availability === "available") result = result.filter((p) => p.available !== false);
      if (availability === "unavailable") result = result.filter((p) => p.available === false);
      if (availability === "lowstock") result = result.filter((p) => (p.quantity ?? 0) > 0 && (p.quantity ?? 0) <= 10);
      if (availability === "outofstock") result = result.filter((p) => (p.quantity ?? 0) === 0);
    }

    if (expiry && result.length > 0) {
      const today = new Date();
      const thirtyDays = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      result = result.filter((p) => {
        const exp = p.expiryDate ? new Date(p.expiryDate) : null;
        if (!exp) return expiry === "valid";
        if (expiry === "expired") return exp < today;
        if (expiry === "expiring-soon") return exp >= today && exp <= thirtyDays;
        if (expiry === "valid") return exp > today;
        return true;
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
        case "oldest":
          return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
        case "name-asc":
          return (a.name ?? "").localeCompare(b.name ?? "");
        case "name-desc":
          return (b.name ?? "").localeCompare(a.name ?? "");
        case "price-asc":
          return (a.price ?? 0) - (b.price ?? 0);
        case "price-desc":
          return (b.price ?? 0) - (a.price ?? 0);
        case "quantity-asc":
          return (a.quantity ?? 0) - (b.quantity ?? 0);
        case "quantity-desc":
          return (b.quantity ?? 0) - (a.quantity ?? 0);
        default:
          return 0;
      }
    });

    return result;
  }, [products, filters]);

  const stats = useMemo(() => {
    const total = products.length;
    const available = products.filter((p) => p.available !== false).length;
    const lowStock = products.filter((p) => (p.quantity ?? 0) > 0 && (p.quantity ?? 0) <= 10).length;
    const outOfStock = products.filter((p) => (p.quantity ?? 0) === 0).length;
    return { total, available, lowStock, outOfStock };
  }, [products]);

  const uniqueBrands = useMemo(() => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort() as string[], [products]);
  const uniqueOrigins = useMemo(() => [...new Set(products.map((p) => p.origin).filter(Boolean))].sort() as string[], [products]);

  const activeFilterCount = useMemo(() => {
    let c = 0;
    if (filters.search.trim()) c++;
    if (filters.categoryId) c++;
    if (filters.brand) c++;
    if (filters.availability) c++;
    if (filters.priceMin || filters.priceMax) c++;
    if (filters.origin) c++;
    if (filters.expiry) c++;
    return c;
  }, [filters]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  const openAddModal = useCallback(() => {
    setEditingProduct(null);
    setProductModalOpen(true);
  }, []);

  const openEditModal = useCallback((product: ProductResponse) => {
    setEditingProduct(product);
    console.log(product);
    setProductModalOpen(true);
  }, []);

  const closeProductModal = useCallback(() => {
    setProductModalOpen(false);
    setEditingProduct(null);
  }, []);

  const openDeleteModal = useCallback((product: ProductResponse) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  }, []);

  const handleCreateOrUpdateProduct = useCallback(
    async (payload: ProductCreationRequest | ProductUpdateRequest) => {
      try {
        if (editingProduct?.id) {
          await productService.updateProduct(editingProduct.id, payload as ProductUpdateRequest);
          showToast("Product updated successfully!", "success");
        } else {
          await productService.createProduct(payload as ProductCreationRequest);
          showToast("Product added successfully!", "success");
        }
        closeProductModal();
        await fetchProducts();
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Failed to save product", "error");
        throw e;
      }
    },
    [editingProduct, closeProductModal, fetchProducts, showToast]
  );

  const handleDeleteProduct = useCallback(async () => {
    if (!productToDelete?.id) return;
    try {
      await productService.deleteProduct(productToDelete.id);
      showToast("Product deleted successfully!", "success");
      closeDeleteModal();
      await fetchProducts();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to delete product", "error");
    }
  }, [productToDelete, closeDeleteModal, fetchProducts, showToast]);

  return {
    products: filteredProducts,
    allProducts: products,
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
    showToast,
    fetchProducts,
  };
}
