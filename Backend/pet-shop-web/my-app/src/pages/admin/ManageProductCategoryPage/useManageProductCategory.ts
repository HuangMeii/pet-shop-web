"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { CategoryResponse, CategoryCreationRequest, CategoryUpdateRequest } from "../../../types/categoryTypes.ts";
import * as categoryService from "../../../services/categoryService.ts";

export type ViewMode = "grid" | "list";

export function useManageProductCategory() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryResponse | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (c) =>
        (c.name ?? "").toLowerCase().includes(q) ||
        (c.description ?? "").toLowerCase().includes(q)
    );
  }, [categories, search]);

  const stats = useMemo(() => ({
    total: categories.length,
  }), [categories.length]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  const openAddModal = useCallback(() => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  }, []);

  const openEditModal = useCallback((category: CategoryResponse) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  }, []);

  const closeCategoryModal = useCallback(() => {
    setCategoryModalOpen(false);
    setEditingCategory(null);
  }, []);

  const openDeleteModal = useCallback((category: CategoryResponse) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  }, []);

  const handleCreateOrUpdateCategory = useCallback(
    async (payload: CategoryCreationRequest | CategoryUpdateRequest) => {
      try {
        if (editingCategory?.id) {
          await categoryService.updateCategoryById(editingCategory.id, payload as CategoryUpdateRequest);
          showToast("Category updated successfully!", "success");
        } else {
          await categoryService.createCategory(payload as CategoryCreationRequest);
          showToast("Category added successfully!", "success");
        }
        closeCategoryModal();
        await fetchCategories();
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Failed to save category", "error");
        throw e;
      }
    },
    [editingCategory, closeCategoryModal, fetchCategories, showToast]
  );

  const handleDeleteCategory = useCallback(async () => {
    if (!categoryToDelete?.id) return;
    try {
      await categoryService.deleteCategoryById(categoryToDelete.id);
      showToast("Category deleted successfully!", "success");
      closeDeleteModal();
      await fetchCategories();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to delete category", "error");
    }
  }, [categoryToDelete, closeDeleteModal, fetchCategories, showToast]);

  return {
    categories: filteredCategories,
    allCategories: categories,
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
    fetchCategories,
  };
}
