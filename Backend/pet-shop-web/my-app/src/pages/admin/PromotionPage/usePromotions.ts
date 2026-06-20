"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PromotionResponse } from "../../../types/promotionTypes";
import * as promotionService from "../../../services/promotionService";

export type ViewMode = "grid" | "list";

export function usePromotions() {
  const [promotions, setPromotions] = useState<PromotionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailPromotion, setDetailPromotion] = useState<PromotionResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<PromotionResponse | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await promotionService.getAllPromotions();
      setPromotions(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load promotions");
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPromotions();
  }, [fetchPromotions]);

  const filteredPromotions = useMemo(() => {
    let result = [...promotions];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.code ?? "").toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          (p.id ?? "").toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((p) => (p.status ?? "") === statusFilter);
    }
    result.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    return result;
  }, [promotions, search, statusFilter]);

  const stats = useMemo(() => {
    const total = promotions.length;
    const statusCounts: Record<string, number> = {};
    promotions.forEach((p) => {
      const s = p.status ?? "unknown";
      statusCounts[s] = (statusCounts[s] ?? 0) + 1;
    });
    return { total, statusCounts };
  }, [promotions]);

  const uniqueStatuses = useMemo(
    () => [...new Set(promotions.map((p) => p.status).filter(Boolean))].sort() as string[],
    [promotions]
  );

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const openDetail = useCallback(async (p: PromotionResponse) => {
    setSelectedId(p.id);
    setDetailLoading(true);
    setDetailPromotion(null);
    try {
      const full = await promotionService.getPromotionById(p.id);
      setDetailPromotion(full);
    } catch {
      setDetailPromotion(p);
      showToast("Could not refresh full detail; showing list data.", "info");
    } finally {
      setDetailLoading(false);
    }
  }, [showToast]);

  const closeDetail = useCallback(() => {
    setSelectedId(null);
    setDetailPromotion(null);
  }, []);

  const openDeleteModal = useCallback((p: PromotionResponse) => {
    setPromotionToDelete(p);
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setPromotionToDelete(null);
  }, []);

  const handleDeletePromotion = useCallback(async () => {
    if (!promotionToDelete?.id) return;
    try {
      await promotionService.deletePromotion(promotionToDelete.id);
      showToast("Promotion deleted successfully!", "success");
      closeDeleteModal();
      if (selectedId === promotionToDelete.id) closeDetail();
      await fetchPromotions();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to delete promotion", "error");
    }
  }, [promotionToDelete, selectedId, closeDeleteModal, closeDetail, fetchPromotions, showToast]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("");
  }, []);

  return {
    promotions: filteredPromotions,
    allPromotions: promotions,
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
    fetchPromotions,
    showToast,
  };
}
