"use client";

import {useState, useEffect, useCallback, useMemo} from "react";
import type {PurchaseResponse} from "../../../types/purchaseTypes";
import * as purchaseService from "../../../services/purchaseService";

export type ViewMode = "grid" | "list";

export function usePurchase() {
  const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseResponse | null>(null);
  const [purchaseToDelete, setPurchaseToDelete] = useState<PurchaseResponse | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await purchaseService.getAllPurchases();
      setPurchases(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load purchases");
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const filteredPurchases = useMemo(() => {
    let result = [...purchases];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
          (p) =>
              (p.id ?? "").toLowerCase().includes(q) ||
              (p.supplier?.name ?? "").toLowerCase().includes(q) ||
              (p.supplier?.address ?? "").toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((p) => (p.status ?? "") === statusFilter);
    }
    result.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    return result;
  }, [purchases, search, statusFilter]);

  const stats = useMemo(() => {
    const total = purchases.length;
    const statusCounts: Record<string, number> = {};
    purchases.forEach((p) => {
      const s = p.status ?? "unknown";
      statusCounts[s] = (statusCounts[s] ?? 0) + 1;
    });
    return {total, statusCounts};
  }, [purchases]);

  const uniqueStatuses = useMemo(
      () => [...new Set(purchases.map((p) => p.status).filter(Boolean))].sort() as string[],
      [purchases]
  );

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setToast({message, type});
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  const openDetailModal = useCallback((purchase: PurchaseResponse) => {
    setSelectedPurchase(purchase);
    setDetailModalOpen(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setDetailModalOpen(false);
    setSelectedPurchase(null);
  }, []);

  const openDeleteModal = useCallback((purchase: PurchaseResponse) => {
    setPurchaseToDelete(purchase);
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setPurchaseToDelete(null);
  }, []);

  const handleDeletePurchase = useCallback(async () => {
    if (!purchaseToDelete?.id) return;
    try {
      await purchaseService.deletePurchase(purchaseToDelete.id);
      showToast("Purchase deleted successfully!", "success");
      closeDeleteModal();
      await fetchPurchases();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to delete purchase", "error");
    }
  }, [purchaseToDelete, closeDeleteModal, fetchPurchases, showToast]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("");
  }, []);

  return {
    purchases: filteredPurchases,
    allPurchases: purchases,
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
    detailModalOpen,
    deleteModalOpen,
    selectedPurchase,
    purchaseToDelete,
    toast,
    openDetailModal,
    closeDetailModal,
    openDeleteModal,
    closeDeleteModal,
    handleDeletePurchase,
    clearFilters,
    fetchPurchases,
    showToast,
  };
}
