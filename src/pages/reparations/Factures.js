import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import SearchBar from "../../components/Layout/SearchBar";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import Pagination from "../../components/Layout/Pagination";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { useToast } from "../../contexts/ToastContext";
import FactureTable from "../../components/reparations/facture/FactureTable";
import FactureDetailsModalContent from "../../components/reparations/facture/FactureDetailsModalContent";
import { formatMontant } from "../../utils/helpers";

import usePagination from "../../hooks/usePagination";
import { useCrudModal } from "../../hooks/useCrudModal";
import { useListManager } from "../../hooks/useListManager";

const Factures = () => {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { filter, setFilter, sortOption, setSortOption, processedList } =
    useListManager({
      dataList: factures,
      dateField: "created_at",
    });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const { modal, open, openDetails, close } = useCrudModal();
  const { showToast } = useToast();

  const {
    currentPage,
    goToPage,
    reset: resetPagination,
  } = usePagination(pagination.last_page || 1);

  const userInfo = JSON.parse(sessionStorage.getItem("user-info"));
  const userId = userInfo?.id;

  const handleSearch = (query) => {
    setSearchQuery(query);
    resetPagination();
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    resetPagination();
  };

  const fetchFactures = useCallback(
    async (signal) => {
      setLoading(true);
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/liste_factures?page=${currentPage}&statut=${filter}&search=${encodeURIComponent(searchQuery)}`,
          signal ? { signal } : undefined,
        );
        const data = await response.json();
        setFactures(data.factures || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        showToast("Erreur lors du chargement des factures.", "danger");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, filter, searchQuery, showToast],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchFactures(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchFactures]);

  useEffect(() => {
    if (currentPage !== 1) {
      resetPagination();
    }
  }, [filter, searchQuery]);

  const handleValiderPaiement = async () => {
    const selectedFacture = modal.data;
    if (!selectedFacture?.id) return;
    setLoading(true);
    close();

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/valider_paiement/${selectedFacture.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();
      showToast(result.message, "info");
      fetchFactures();
    } catch (error) {
      showToast("Erreur lors de la validation : " + error, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmGeneration = async () => {
    const selectedFacture = modal.data;
    if (!selectedFacture?.reception?.id) return;
    setLoading(true);
    close();

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/generer_facture/${selectedFacture.reception.id}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error("Échec de la génération de la facture");
      }

      const result = await response.json();
      showToast(result.message, "info");
      fetchFactures();
    } catch (error) {
      showToast("Erreur lors de la validation : " + error.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { value: "", label: "Tous les statuts" },
    { value: "en_attente", label: "En attente" },
    { value: "payee", label: "Payée" },
    { value: "annulee", label: "Annulée" },
  ];

  return (
    <Layout>
      <div className="container mt-4">
        <SearchBar
          placeholder="Rechercher une facture par immatriculation..."
          value={searchQuery}
          onSearch={handleSearch}
          delay={300}
        />

        <HeaderWithFilter
          title2="Factures"
          main={pagination.total}
          filter={filter}
          setFilter={handleFilterChange}
          filterOptions={filterOptions}
          sortOption={sortOption}
          setSortOption={setSortOption}
          hasAlphaSort={false}
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
            <FactureTable
              factures={processedList}
              onShowDetails={openDetails}
              onGenerate={(f) => open("generate", f)}
              onOpenPayment={(f) => open("pay", f)}
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
      <Modal show={modal.mode === "details"} onHide={close} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails de la facture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal.data && <FactureDetailsModalContent facture={modal.data} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de paiement */}
      <ConfirmPopup
        show={modal.mode === "pay"}
        onClose={close}
        onConfirm={handleValiderPaiement}
        title="Confirmer le paiement"
        confirmText="Terminer"
        btnColor="success"
        body={
          modal.data && (
            <p>
              Confirmer le paiement de la facture pour le véhicule <br />
              <strong>
                {modal.data.reception?.vehicule?.immatriculation || "Inconnu"}
              </strong>{" "}
              pour le montant de{" "}
              <strong>{formatMontant(modal.data.montant)}</strong> ?
              <br />
              <span>---------</span>
              <br />
              Motif de la visite :{" "}
              <strong>
                {modal.data.reception?.motif_visite || "Non spécifié"}
              </strong>
            </p>
          )
        }
      />

      {/* Modal de génération */}
      <ConfirmPopup
        show={modal.mode === "generate"}
        onClose={close}
        onConfirm={handleConfirmGeneration}
        title="Confirmation"
        body="Voulez-vous générer cette facture ?"
        confirmText="Générer"
        btnColor="primary"
      />
    </Layout>
  );
};

export default Factures;
