import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import Pagination from "../../components/Layout/Pagination";
import { Modal, Button } from "react-bootstrap";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { useToast } from "../../contexts/ToastContext";
import { useCrudModal } from "../../hooks/useCrudModal";
import { useListManager } from "../../hooks/useListManager";
import usePagination from "../../hooks/usePagination";
import VehiculeTable from "../../components/vehicules/VehiculeTable";
import VehiculeDetailsModalContent from "../../components/vehicules/VehiculeDetailsModalContent";
import SearchBar from "../../components/Layout/SearchBar";

const Vehicules = () => {
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { sortOption, setSortOption, processedList } = useListManager({
    dataList: vehicules,
    alphaField: "immatriculation",
    dateField: "created_at",
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const { modal, openDetails, openConfirm, close } = useCrudModal();
  const { showToast } = useToast();

  const {
    currentPage,
    goToPage,
    reset: resetPagination,
  } = usePagination(pagination.last_page || 1);

  const handleSearch = (query) => {
    setSearchQuery(query);
    resetPagination();
  };

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchVehicules = async () => {
      setLoading(true);
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/liste_vehicules?page=${currentPage}&search=${encodeURIComponent(searchQuery)}`,
          { signal: controller.signal },
        );
        const data = await response.json();
        if (isMounted) {
          setVehicules(data.vehicules || []);
          if (data.pagination) {
            setPagination(data.pagination);
          }
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        if (isMounted) {
          showToast("Erreur lors du chargement des véhicules.", "danger");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVehicules();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [currentPage, searchQuery, showToast]);

  useEffect(() => {
    if (currentPage !== 1) {
      resetPagination();
    }
  }, [searchQuery, currentPage, resetPagination]);

  const handleConfirmGeneration = async () => {
    const receptionId = modal.data?.receptions?.[0]?.id;
    if (!receptionId) return;

    setLoading(true);
    close();

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/generer_billet/${receptionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Échec de la génération du billet");
      }

      const result = await response.json();
      showToast(result.message, "info");
      // Refetch
      const refetchResponse = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/liste_vehicules?page=${currentPage}&search=${encodeURIComponent(searchQuery)}`,
      );
      const refetchData = await refetchResponse.json();
      setVehicules(refetchData.vehicules || []);
      if (refetchData.pagination) setPagination(refetchData.pagination);
    } catch (error) {
      showToast("Erreur lors de la validation : " + error, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <SearchBar
          placeholder="Rechercher un véhicule par immatriculation..."
          value={searchQuery}
          onSearch={handleSearch}
          delay={300}
        />

        <HeaderWithFilter
          title="Véhicules"
          main={pagination.total}
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
            <VehiculeTable
              vehicules={processedList}
              onShowDetails={openDetails}
              onGenerateTicket={openConfirm}
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
          <Modal.Title>Détails du véhicule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal.data && <VehiculeDetailsModalContent vehicule={modal.data} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmation pour billet de sortie */}
      <ConfirmPopup
        show={modal.mode === "confirm"}
        onClose={close}
        onConfirm={handleConfirmGeneration}
        title="Confirmation"
        confirmText="Générer"
        btnColor="primary"
        body={
          modal.data ? (
            <>
              Voulez-vous générer le billet de sortie de{" "}
              <strong>{modal.data.immatriculation}</strong> ?
            </>
          ) : (
            <>Chargement du véhicule...</>
          )
        }
      />
    </Layout>
  );
};

export default Vehicules;
