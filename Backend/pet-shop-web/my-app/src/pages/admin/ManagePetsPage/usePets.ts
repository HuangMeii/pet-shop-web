"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { PetResponse, PetCreationRequest, PetUpdateRequest } from "../../../types/petTypes";
import * as petService from "../../../services/petService";

export type ViewMode = "grid" | "list";

export function usePets() {
  const [pets, setPets] = useState<PetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [soldModalOpen, setSoldModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<PetResponse | null>(null);
  const [petToMarkSold, setPetToMarkSold] = useState<PetResponse | null>(null);
  const [petToDelete, setPetToDelete] = useState<PetResponse | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await petService.getAllPets();
      setPets(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load pets");
      setPets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const filteredPets = useMemo(() => {
    let result = [...pets];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name ?? "").toLowerCase().includes(q) ||
          (p.species ?? "").toLowerCase().includes(q) ||
          (p.breed ?? "").toLowerCase().includes(q) ||
          (p.gender ?? "").toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    return result;
  }, [pets, search]);

  const stats = useMemo(
    () => ({
      total: pets.length,
      available: pets.filter((p) => p.available !== false).length,
    }),
    [pets]
  );

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  const openAddModal = useCallback(() => setFormModalOpen(true), []);
  const closeFormModal = useCallback(() => setFormModalOpen(false), []);

  const openEditModal = useCallback((pet: PetResponse) => {
    setPetToEdit(pet);
    setEditModalOpen(true);
  }, []);
  const closeEditModal = useCallback(() => {
    setEditModalOpen(false);
    setPetToEdit(null);
  }, []);

  const openSoldModal = useCallback((pet: PetResponse) => {
    setPetToMarkSold(pet);
    setSoldModalOpen(true);
  }, []);
  const closeSoldModal = useCallback(() => {
    setSoldModalOpen(false);
    setPetToMarkSold(null);
  }, []);

  const openDeleteModal = useCallback((pet: PetResponse) => {
    setPetToDelete(pet);
    setDeleteModalOpen(true);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setPetToDelete(null);
  }, []);

  const handleCreatePet = useCallback(
    async (payload: PetCreationRequest) => {
      try {
        await petService.createPet(payload);
        showToast("Thêm thú cưng thành công!", "success");
        closeFormModal();
        await fetchPets();
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Thêm thất bại", "error");
        throw e;
      }
    },
    [closeFormModal, fetchPets, showToast]
  );

  const handleUpdatePet = useCallback(
    async (id: string, payload: PetUpdateRequest) => {
      try {
        await petService.updatePet(id, payload);
        showToast("Cập nhật thú cưng thành công!", "success");
        closeEditModal();
        await fetchPets();
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Cập nhật thất bại", "error");
        throw e;
      }
    },
    [closeEditModal, fetchPets, showToast]
  );

  const handleMarkAsSold = useCallback(
    async (id: string) => {
      try {
        await petService.markAsSold(id);
        showToast("Đã đánh dấu đã bán!", "success");
        closeSoldModal();
        await fetchPets();
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Đánh dấu thất bại", "error");
        throw e;
      }
    },
    [closeSoldModal, fetchPets, showToast]
  );

  const handleDeletePet = useCallback(async () => {
    if (!petToDelete?.id) return;
    try {
      await petService.deletePet(petToDelete.id);
      showToast("Đã xóa thú cưng!", "success");
      closeDeleteModal();
      await fetchPets();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Xóa thất bại", "error");
    }
  }, [petToDelete, closeDeleteModal, fetchPets, showToast]);

  return {
    pets: filteredPets,
    allPets: pets,
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
    fetchPets,
  };
}
