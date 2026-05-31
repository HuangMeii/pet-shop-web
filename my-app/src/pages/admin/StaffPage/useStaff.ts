"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { StaffResponse, StaffCreationRequest } from "../../../types/staffTypes";
import * as staffService from "../../../services/staffService";
import type {UserUpdateRequest} from "../../../types/userTypes.ts";
import {updateUser} from "@/services/userService.ts";

export type ViewMode = "grid" | "list";

export function useStaff() {
  const [staffList, setStaffList] = useState<StaffResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffResponse | null>(null);
  const [staffToEdit, setStaffToEdit] = useState<StaffResponse | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<StaffResponse | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await staffService.getAllStaff();
      setStaffList(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load staff");
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const filteredStaff = useMemo(() => {
    let result = [...staffList];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          (s.user?.username ?? "").toLowerCase().includes(q) ||
          (s.user?.firstName ?? "").toLowerCase().includes(q) ||
          (s.user?.lastName ?? "").toLowerCase().includes(q) ||
          (s.user?.email ?? "").toLowerCase().includes(q) ||
          (s.user?.phone ?? "").toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => (a.user?.username ?? "").localeCompare(b.user?.username ?? ""));
    return result;
  }, [staffList, search]);

  const stats = useMemo(() => ({
    total: staffList.length,
  }), [staffList]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  const openAddModal = useCallback(() => {
    setEditingStaff(null);
    setFormModalOpen(true);
  }, []);

  const openEditModal = useCallback((staff: StaffResponse) => {
    setStaffToEdit(staff);
    setEditModalOpen(true);
  }, []);

  const openShiftModal = useCallback((staff: StaffResponse) => {
    setEditingStaff(staff);
    setShiftModalOpen(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setFormModalOpen(false);
    setEditingStaff(null);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModalOpen(false);
    setStaffToEdit(null);
  }, []);

  const closeShiftModal = useCallback(() => {
    setShiftModalOpen(false);
    setEditingStaff(null);
  }, []);

  const openDeleteModal = useCallback((staff: StaffResponse) => {
    setStaffToDelete(staff);
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setStaffToDelete(null);
  }, []);

  const handleCreateStaff = useCallback(
    async (payload: StaffCreationRequest) => {
      try {
        await staffService.createStaff(payload);
        showToast("Staff added successfully!", "success");
        closeFormModal();
        await fetchStaff();
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Failed to add staff", "error");
        throw e;
      }
    },
    [closeFormModal, fetchStaff, showToast]
  );

  const handleUpdateStaff = useCallback(
    async (id: string, payload: UserUpdateRequest) => {
      try {
        // await .updateStaff(id, payload);
        await updateUser(id, payload);
        showToast("Staff updated successfully!", "success");
        closeEditModal();
        await fetchStaff();
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Failed to update staff", "error");
        throw e;
      }
    },
    [closeEditModal, fetchStaff, showToast]
  );

  const handleUpdateShift = useCallback(
    async (id: string, shift: number) => {
      try {
        await staffService.updateStaffShift(id, shift);
        showToast("Shift updated successfully!", "success");
        closeShiftModal();
        await fetchStaff();
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Failed to update shift", "error");
        throw e;
      }
    },
    [closeShiftModal, fetchStaff, showToast]
  );

  const handleDeleteStaff = useCallback(async () => {
    if (!staffToDelete?.id) return;
    try {
      await staffService.deleteStaff(staffToDelete.id);
      showToast("Staff deleted successfully!", "success");
      closeDeleteModal();
      await fetchStaff();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to delete staff", "error");
    }
  }, [staffToDelete, closeDeleteModal, fetchStaff, showToast]);

  return {
    staff: filteredStaff,
    allStaff: staffList,
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
    fetchStaff,
  };
}
