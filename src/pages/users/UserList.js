import React, { useState, useEffect, useCallback } from "react";
import { Button } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import Pagination from "../../components/Layout/Pagination";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { useToast } from "../../contexts/ToastContext";
import UserTable from "../../components/users/UserTable";

import usePagination from "../../hooks/usePagination";
import { useCrudModal } from "../../hooks/useCrudModal";
import { useListManager } from "../../hooks/useListManager";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { filter, setFilter, sortOption, setSortOption, processedList } =
    useListManager({
      dataList: users,
      alphaField: "last_name",
      dateField: "created_at",
    });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const { showToast } = useToast();
  const {
    modal,
    selectedIds,
    setSelectedIds,
    toggleSelect,
    openDelete,
    openBulkDelete,
    close,
  } = useCrudModal();

  const {
    currentPage,
    goToPage,
    reset: resetPagination,
  } = usePagination(pagination.last_page || 1);

  const userInfo = JSON.parse(sessionStorage.getItem("user-info"));
  const userId = userInfo ? userInfo.id : null;

  const handleSearch = (query) => {
    setSearchQuery(query);
    resetPagination();
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    resetPagination();
  };

  const fetchUsers = useCallback(
    async (signal) => {
      setLoading(true);

      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/liste_user?page=${currentPage}&role=${filter}&search=${encodeURIComponent(searchQuery)}`,
          signal ? { signal } : undefined,
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des utilisateurs.");
        }

        const data = await response.json();
        setUsers(data.users || []);

        if (data.pagination) {
          setPagination(data.pagination);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        showToast(
          "Impossible de charger les données : " + err.message,
          "danger",
        );
      } finally {
        setLoading(false);
      }
    },
    [currentPage, filter, searchQuery, showToast],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchUsers]);

  useEffect(() => {
    resetPagination();
  }, [filter, searchQuery, resetPagination]);

  const handleDelete = async () => {
    const selectedUser = modal.data;
    if (!selectedUser) return;

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/delete_user/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );

      const result = await response.json();

      if (result.status === "deleted") {
        showToast("Utilisateur supprimé !", "success");
        fetchUsers();
      } else {
        showToast("Échec de la suppression.", "danger");
      }
    } catch (err) {
      showToast("Une erreur est survenue lors de la suppression.", "danger");
    } finally {
      close();
    }
  };

  const handleBulkDelete = async () => {
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/delete_users_multiple`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedIds }),
        },
      );

      const result = await response.json();

      if (result.status === "deleted") {
        showToast("Utilisateurs supprimés !", "success");
        setSelectedIds([]);
        fetchUsers();
      } else {
        showToast("Échec de la suppression groupée.", "danger");
      }
    } catch (err) {
      showToast(
        "Une erreur est survenue lors de la suppression groupée.",
        "danger",
      );
    } finally {
      close();
    }
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      const allSelectable = processedList
        .filter((u) => u.id !== userId)
        .map((u) => u.id);
      setSelectedIds(allSelectable);
    } else {
      setSelectedIds([]);
    }
  };

  const filterOptions = [
    { value: "", label: "Tous les utilisateurs" },
    { value: "admin", label: "Administrateur" },
    { value: "caisse", label: "Caisse" },
    { value: "gardien", label: "Gardien" },
    { value: "reception", label: "Réception" },
    { value: "caisse_outils", label: "Caisse Outils" },
  ];

  return (
    <Layout>
      <div className="container mt-2">
        <SearchBar
          placeholder="Rechercher un utilisateur..."
          value={searchQuery}
          onSearch={handleSearch}
          delay={300}
        />

        <HeaderWithFilter
          title="Utilisateurs"
          link="/register"
          linkText="Ajouter"
          main={pagination.total}
          filter={filter}
          setFilter={handleFilterChange}
          filterOptions={filterOptions}
          sortOption={sortOption}
          setSortOption={setSortOption}
          hasAlphaSort={true}
          hasDateSort={true}
        />

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <Loader />
          </div>
        ) : (
          <>
            {/* Barre d'action groupée si des utilisateurs sont sélectionnés */}
            {selectedIds.length > 0 && (
              <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
                <span>
                  <strong>{selectedIds.length}</strong> utilisateur(s)
                  sélectionné(s)
                </span>
                <Button variant="danger" size="sm" onClick={openBulkDelete}>
                  <i className="fas fa-trash me-2"></i>
                  <span className="d-none d-md-inline-block">Supprimer</span>
                </Button>
              </div>
            )}

            <UserTable
              users={processedList}
              currentUserId={userId}
              selectedUserIds={selectedIds}
              onToggleSelectAll={toggleSelectAll}
              onToggleSelectUser={toggleSelect}
              onDelete={openDelete}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={pagination.last_page || 1}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>

      {/* Modal suppression unique */}
      <ConfirmPopup
        show={modal.mode === "delete" && modal.variant === "single"}
        onClose={close}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={
          <p>
            Voulez-vous vraiment supprimer l'utilisateur{" "}
            <strong>{modal.data?.last_name || "Inconnu"}</strong> ?
          </p>
        }
      />

      {/* Modal suppression groupée */}
      <ConfirmPopup
        show={modal.mode === "delete" && modal.variant === "multiple"}
        onClose={close}
        onConfirm={handleBulkDelete}
        title="Confirmer la suppression groupée"
        body={
          <p>
            Voulez-vous vraiment supprimer les{" "}
            <strong>{selectedIds.length}</strong> utilisateurs sélectionnés ?
          </p>
        }
        btnColor="danger"
      />
    </Layout>
  );
};

export default UserList;
