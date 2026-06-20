"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { InvoiceResponse } from "../../../types/invoiceTypes.ts";
import * as invoiceService from "../../../services/invoiceService.ts";

export type ViewMode = "grid" | "list";

export function useManageOrders() {
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceResponse | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<InvoiceResponse | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await invoiceService.getAllInvoices();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = useMemo(() => {
    let result = [...invoices];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (inv) =>
          (inv.id ?? "").toLowerCase().includes(q) ||
          (inv.customerName ?? "").toLowerCase().includes(q) ||
          (inv.shippingAddress ?? "").toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((inv) => (inv.status ?? "") === statusFilter);
    }
    result.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    return result;
  }, [invoices, search, statusFilter]);

  const stats = useMemo(() => {
    const total = invoices.length;
    const statusCounts: Record<string, number> = {};
    invoices.forEach((inv) => {
      const s = inv.status ?? "unknown";
      statusCounts[s] = (statusCounts[s] ?? 0) + 1;
    });
    return { total, statusCounts };
  }, [invoices]);

  const uniqueStatuses = useMemo(
    () => [...new Set(invoices.map((inv) => inv.status).filter(Boolean))].sort() as string[],
    [invoices]
  );

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  const openDetailModal = useCallback((invoice: InvoiceResponse) => {
    setSelectedInvoice(invoice);
    setDetailModalOpen(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setDetailModalOpen(false);
    setSelectedInvoice(null);
  }, []);

  const openDeleteModal = useCallback((invoice: InvoiceResponse) => {
    setInvoiceToDelete(invoice);
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setInvoiceToDelete(null);
  }, []);

  const handleDeleteInvoice = useCallback(async () => {
    if (!invoiceToDelete?.id) return;
    try {
      await invoiceService.deleteInvoice(invoiceToDelete.id);
      showToast("Order deleted successfully!", "success");
      closeDeleteModal();
      await fetchInvoices();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to delete order", "error");
    }
  }, [invoiceToDelete, closeDeleteModal, fetchInvoices, showToast]);

  const handleUpdateInvoiceStatus = useCallback(
    async (invoiceId: string, paymentStatus: string): Promise<boolean> => {
      const nextStatus = paymentStatus.trim().toUpperCase();
      if (!invoiceId || !nextStatus) return false;
      try {
        const updatedInvoice = await invoiceService.updateInvoiceStatus(invoiceId, {
          paymentStatus: nextStatus,
        });

        setInvoices((prev) =>
          prev.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv))
        );
        setSelectedInvoice((prev) =>
          prev?.id === updatedInvoice.id ? updatedInvoice : prev
        );
        showToast("Order status updated successfully!", "success");
        return true;
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Failed to update order status", "error");
        return false;
      }
    },
    [showToast]
  );

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("");
  }, []);

  return {
    invoices: filteredInvoices,
    allInvoices: invoices,
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
    selectedInvoice,
    invoiceToDelete,
    toast,
    openDetailModal,
    closeDetailModal,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteInvoice,
    handleUpdateInvoiceStatus,
    clearFilters,
    fetchInvoices,
  };
}
