import { useState, useCallback } from "react";

/**
 * Gère l'état de la sélection de lignes et l'affichage des modals pour un CRUD.
 */
export const useCrudModal = () => {
  // 1. État pour la sélection de lignes (ex: pour les actions en masse)
  const [selectedIds, setSelectedIds] = useState([]);

  // 2. État de la modal active
  // mode: 'delete' | 'toggle' | 'details' | 'status' | 'confirm' | null
  const [modal, setModal] = useState({ mode: null, data: null, variant: null });

  // --- LOGIQUE SÉLECTION ---
  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const resetSelection = useCallback(() => setSelectedIds([]), []);

  // --- GESTION DES MODALS ---
  const open = useCallback((mode, data = null, variant = null) => {
    setModal({ mode, data, variant });
  }, []);

  const close = useCallback(() => {
    setModal({ mode: null, data: null, variant: null });
  }, []);

  return {
    // Sélection
    selectedIds,
    setSelectedIds,
    toggleSelect,
    resetSelection,

    // État de la modal
    modal,
    isOpen: modal.mode !== null,
    setModal,
    open,
    close,
    openModal: open,
    closeModal: close,

    // Raccourcis d'ouverture explicites
    openDelete: useCallback((item) => open("delete", item, "single"), [open]),
    openBulkDelete: useCallback(
      () => open("delete", selectedIds, "multiple"),
      [open, selectedIds],
    ),
    openToggle: useCallback((item) => open("toggle", item), [open]),
    openDetails: useCallback((item) => open("details", item), [open]),
    openStatus: useCallback(
      (item, status) => open("status", { order: item, status }),
      [open],
    ),
    openConfirm: useCallback((data = null) => open("confirm", data), [open]),

    // Exécution d'action après confirmation
    confirmToggle: useCallback(
      (callback) => {
        if (modal.data) callback(modal.data);
        close();
      },
      [modal.data, close],
    ),
  };
};
