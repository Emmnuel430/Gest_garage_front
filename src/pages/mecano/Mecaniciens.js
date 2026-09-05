import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import Pagination from "../../components/Layout/Pagination";
import MecanicienUpdate from "./MecanicienUpdate";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { useToast } from "../../contexts/ToastContext";
import MecanicienTable from "../../components/mecaniciens/MecanicienTable";
import MecanicienDetails from "../../components/mecaniciens/MecanicienDetails";
import { formatPhoneNumber } from "../../utils/helpers";

import usePagination from "../../hooks/usePagination";
import { useCrudModal } from "../../hooks/useCrudModal";
import { useListManager } from "../../hooks/useListManager";

const Mecaniciens = () => {
  const [mecaniciens, setMecaniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { filter, setFilter, sortOption, setSortOption, processedList } =
    useListManager({
      dataList: mecaniciens,
      alphaField: "nom",
      dateField: "created_at",
    });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { modal, open, openDelete, openDetails, close } = useCrudModal();

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

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchMecaniciens = async () => {
      setLoading(true);
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/liste_mecaniciens?page=${currentPage}&type=${filter}&search=${encodeURIComponent(searchQuery)}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Erreur lors de la récupération.");

        const data = await response.json();
        if (isMounted) {
          setMecaniciens(data.mecaniciens || []);
          if (data.pagination) setPagination(data.pagination);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        if (isMounted) {
          showToast(
            "Impossible de charger les données : " + err.message,
            "danger",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMecaniciens();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [currentPage, filter, searchQuery, showToast]);

  useEffect(() => {
    resetPagination();
  }, [filter, searchQuery, resetPagination]);

  const handleUpdateMecanicien = async (updatedMecanicien) => {
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/update_mecanicien/${updatedMecanicien.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMecanicien),
        },
      );

      if (!response.ok) throw new Error("Échec de la mise à jour");

      setMecaniciens((prevMecaniciens) =>
        prevMecaniciens.map((mecanicien) =>
          mecanicien.id === updatedMecanicien.id
            ? updatedMecanicien
            : mecanicien,
        ),
      );

      showToast("Mécanicien mis à jour avec succès.", "info");
      close();
      navigate("/mecaniciens");
    } catch (error) {
      showToast("Erreur lors de la mise à jour.", "danger");
    }
  };

  const handleDelete = async () => {
    const selectedMecanicien = modal.data;
    if (!selectedMecanicien) return;

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/delete_mecanicien/${selectedMecanicien.id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (result.status === "deleted") {
        showToast("Mécanicien supprimé !", "success");
        setMecaniciens((prev) =>
          prev.filter((m) => m.id !== selectedMecanicien.id),
        );
      } else {
        showToast("Échec de la suppression.", "danger");
      }
    } catch (err) {
      showToast("Une erreur est survenue lors de la suppression.", "danger");
    } finally {
      close();
    }
  };

  function formatStatut(statut) {
    if (!statut) return "";
    return statut.split("_").join(" ");
  }

  const filterOptions = [
    { value: "", label: "Tous les mécaniciens" },
    { value: "interne", label: "Interne" },
    { value: "externe", label: "Externe" },
  ];

  return (
    <Layout>
      <div className="container mt-2">
        <SearchBar
          placeholder="Rechercher un mécanicien..."
          value={searchQuery}
          onSearch={handleSearch}
          delay={300}
        />

        <HeaderWithFilter
          title="Mécaniciens"
          link="/add/mecanicien"
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
            <MecanicienTable
              mecaniciens={processedList}
              onShowDetails={openDetails}
              onEdit={(m) => open("update", m)}
              onDelete={openDelete}
              formatPhoneNumber={formatPhoneNumber}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={pagination.last_page || 1}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>

      {/* Modal de détails */}
      <Modal show={modal.mode === "details"} onHide={close} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Détails du Mécanicien</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal.data && (
            <MecanicienDetails
              mecanicien={modal.data}
              formatPhoneNumber={formatPhoneNumber}
              formatStatut={formatStatut}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de mise à jour */}
      <Modal show={modal.mode === "update"} onHide={close} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifier un Mécanicien</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal.data && (
            <MecanicienUpdate
              key={modal.data.id}
              onClose={close}
              mecanicien={modal.data}
              onUpdate={handleUpdateMecanicien}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Modal de confirmation pour la suppression d'un mécanicien */}
      <ConfirmPopup
        show={modal.mode === "delete"}
        onClose={close}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={
          <p>
            Voulez-vous vraiment supprimer le mécanicien{" "}
            <strong>{modal.data?.nom || "Inconnu"}</strong> ?
          </p>
        }
      />
    </Layout>
  );
};

export default Mecaniciens;
