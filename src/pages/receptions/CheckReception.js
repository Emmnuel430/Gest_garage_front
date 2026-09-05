import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import Pagination from "../../components/Layout/Pagination";
import BadgeVehicule from "../../components/others/BadgeVehicule";
import Check from "./Check";
import ReceptionDetailsModalContent from "../../components/receptions/ReceptionDetailsModalContent";
import ReceptionTableRow from "../../components/receptions/ReceptionTableRow";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { useToast } from "../../contexts/ToastContext";
import {
  filterReceptionsOptions,
  STATUT_COLOR_CONFIG,
} from "../../utils/helpers";

import usePagination from "../../hooks/usePagination";
import { useCrudModal } from "../../hooks/useCrudModal";
import { useListManager } from "../../hooks/useListManager";

const resolveStatusConfig = (status) => {
  if (STATUT_COLOR_CONFIG[status]) {
    return STATUT_COLOR_CONFIG[status];
  }
};

const CheckReception = () => {
  const [receptions, setReceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { filter, setFilter, sortOption, setSortOption, processedList } =
    useListManager({
      dataList: receptions,
      dateField: "created_at",
    });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const { modal, open, openDelete, openDetails, close } = useCrudModal();
  const { showToast } = useToast();

  const {
    currentPage,
    goToPage,
    reset: resetPagination,
  } = usePagination(pagination.last_page || 1);

  const userInfo = JSON.parse(sessionStorage.getItem("user-info"));
  const userRole = userInfo ? userInfo.role : null;

  const handleSearch = (query) => {
    setSearchQuery(query);
    resetPagination();
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    resetPagination();
  };

  // fetchReceptions est accessible pour le update handler
  const fetchReceptionsRef = React.useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchReceptions = async () => {
      setLoading(true);

      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/liste_receptions?page=${currentPage}&statut=${filter}&search=${encodeURIComponent(searchQuery)}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des réceptions.");
        }

        const data = await response.json();
        if (isMounted) {
          setReceptions(data.receptions || []);

          if (data.pagination) {
            setPagination(data.pagination);
          }
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

    fetchReceptionsRef.current = fetchReceptions;
    fetchReceptions();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [currentPage, filter, searchQuery, showToast]);

  useEffect(() => {
    resetPagination();
  }, [filter, searchQuery, resetPagination]);

  const handleUpdateReception = async (updatedReception) => {
    setUpdateLoading(true);
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/check/${updatedReception.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedReception),
        },
      );

      if (!response.ok) {
        throw new Error("Échec de la mise à jour");
      }

      showToast("Réception mise à jour avec succès.", "info");
      close();
      if (fetchReceptionsRef.current) await fetchReceptionsRef.current();
    } catch (error) {
      showToast("Erreur lors de la mise à jour.", "danger");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    const selectedReception = modal.data;
    if (!selectedReception) return;

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/delete_reception/${selectedReception.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );

      const result = await response.json();

      if (result.status === "deleted") {
        showToast("Réception supprimée !", "success");
        setReceptions((prev) =>
          prev.filter((r) => r.id !== selectedReception.id),
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

  return (
    <Layout>
      <div className="container mt-2">
        <SearchBar
          placeholder="Rechercher une validation par immatriculation..."
          value={searchQuery}
          onSearch={handleSearch}
          delay={300}
        />

        <HeaderWithFilter
          title2="Validations"
          main={pagination.total}
          filter={filter}
          setFilter={handleFilterChange}
          filterOptions={filterReceptionsOptions}
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
            <Table hover responsive align="middle" className="mb-0 fs-6">
              <thead className="table-body rounded-3 text-muted small text-uppercase tracking-wider">
                <tr>
                  <th scope="col" className="ps-3 py-3">
                    ID
                  </th>
                  <th scope="col" className="py-3">
                    Agent
                  </th>
                  <th scope="col" className="py-3">
                    Véhicule
                  </th>
                  <th scope="col" className="py-3">
                    Date d'arrivée
                  </th>
                  <th scope="col" className="py-3 text-center">
                    Statut
                  </th>
                  <th scope="col" className="py-3 text-end pe-3">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {processedList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="fa fa-inbox fa-2x mb-2 d-block text-black-50"></i>
                      Aucune réception en attente trouvée.
                    </td>
                  </tr>
                ) : (
                  processedList.map((reception) => {
                    const isDisabled =
                      userRole !== "admin" && reception.statut === "termine";

                    return (
                      <ReceptionTableRow
                        key={reception.id}
                        reception={reception}
                        userRole={userRole}
                        onShowDetails={openDetails}
                        onDelete={openDelete}
                        onUpdate={
                          reception.statut === "attente"
                            ? (r) => open("update", r)
                            : null
                        }
                        isDisabled={isDisabled}
                        showDeleteButton={true}
                        showUpdateButton={reception.statut === "attente"}
                        statusResolver={(status) =>
                          STATUT_COLOR_CONFIG[status] || {
                            label: status,
                            bg: "body",
                          }
                        }
                      />
                    );
                  })
                )}
              </tbody>
            </Table>

            <Pagination
              currentPage={currentPage}
              totalPages={pagination.last_page || 1}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>

      <Modal show={modal.mode === "details"} onHide={close} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails de la Réception</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal.data && (
            <ReceptionDetailsModalContent
              reception={modal.data}
              resolveStatusConfig={resolveStatusConfig}
              checkPage={true}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={modal.mode === "update"} onHide={close} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Check-in du véhicule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal.data && (
            <>
              <BadgeVehicule
                immatriculation={modal.data.vehicule?.immatriculation}
                marque={modal.data.vehicule?.marque}
                modele={modal.data.vehicule?.modele}
                showDivider={true}
              />

              <Check
                loading={updateLoading}
                reception={modal.data}
                onClose={close}
                onUpdate={handleUpdateReception}
              />
            </>
          )}
        </Modal.Body>
      </Modal>

      <ConfirmPopup
        show={modal.mode === "delete"}
        onClose={close}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={
          <p>
            Voulez-vous vraiment supprimer la réception du véhicule{" "}
            <strong>
              {modal.data?.vehicule?.immatriculation || "Inconnue"}
            </strong>
            ?
          </p>
        }
      />
    </Layout>
  );
};

export default CheckReception;
