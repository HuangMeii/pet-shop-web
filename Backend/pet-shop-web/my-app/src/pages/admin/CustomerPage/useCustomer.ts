"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { CustomerResponse } from "../../../types/customerTypes";
import type {UserCreationRequest, UserUpdateRequest} from "../../../types/userTypes";
import * as customerService from "../../../services/customerService";
import {updateUser} from "@/services/userService.ts";

export type ViewMode = "grid" | "list";

export function useCustomer() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pointsModalOpen, setPointsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerResponse | null>(null);
  const [customerToEdit, setCustomerToEdit] = useState<CustomerResponse | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerResponse | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getAllCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    let result = [...customers];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          (c.user?.username ?? "").toLowerCase().includes(q) ||
          (c.user?.firstName ?? "").toLowerCase().includes(q) ||
          (c.user?.lastName ?? "").toLowerCase().includes(q) ||
          (c.user?.email ?? "").toLowerCase().includes(q) ||
          (c.user?.phone ?? "").toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => (a.user?.username ?? "").localeCompare(b.user?.username ?? ""));
    return result;
  }, [customers, search]);

  const stats = useMemo(
    () => ({
      total: customers.length,
      totalPoints: customers.reduce((sum, c) => sum + (c.points ?? 0), 0),
    }),
    [customers]
  );

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  const openAddModal = useCallback(() => {
    setEditingCustomer(null);
    setFormModalOpen(true);
  }, []);

  const openEditModal = useCallback((customer: CustomerResponse) => {
    setCustomerToEdit(customer);
    setEditModalOpen(true);
  }, []);

  const openPointsModal = useCallback((customer: CustomerResponse) => {
    setEditingCustomer(customer);
    setPointsModalOpen(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setFormModalOpen(false);
    setEditingCustomer(null);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModalOpen(false);
    setCustomerToEdit(null);
  }, []);

  const closePointsModal = useCallback(() => {
    setPointsModalOpen(false);
    setEditingCustomer(null);
  }, []);

  const openDeleteModal = useCallback((customer: CustomerResponse) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setCustomerToDelete(null);
  }, []);

  const handleCreateCustomer = useCallback(
    async (payload: UserCreationRequest) => {
      try {
        await customerService.createCustomer(payload);
        showToast("Customer added successfully!", "success");
        closeFormModal();
        await fetchCustomers();
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Failed to add customer", "error");
        throw e;
      }
    },
    [closeFormModal, fetchCustomers, showToast]
  );

  const handleUpdateCustomer = useCallback(
    async (id: string, payload: UserUpdateRequest) => {
      try {
        await updateUser(id, payload);
        showToast("Customer updated successfully!", "success");
        closeEditModal();
        await fetchCustomers();
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Failed to update customer", "error");
        throw e;
      }
    },
    [closeEditModal, fetchCustomers, showToast]
  );

  const handleAddPoints = useCallback(
    async (id: string, points: number) => {
      try {
        await customerService.addPoints(id, points);
        showToast("Points added successfully!", "success");
        closePointsModal();
        await fetchCustomers();
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Failed to add points", "error");
        throw e;
      }
    },
    [closePointsModal, fetchCustomers, showToast]
  );

  const handleDeleteCustomer = useCallback(async () => {
    if (!customerToDelete?.id) return;
    try {
      await customerService.deleteCustomer(customerToDelete.id);
      showToast("Customer deleted successfully!", "success");
      closeDeleteModal();
      await fetchCustomers();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to delete customer", "error");
    }
  }, [customerToDelete, closeDeleteModal, fetchCustomers, showToast]);

  return {
    customers: filteredCustomers,
    allCustomers: customers,
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
    fetchCustomers,
  };
}
