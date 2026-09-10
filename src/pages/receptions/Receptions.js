import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import Pagination from "../../components/Layout/Pagination";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { useToast } from "../../contexts/ToastContext";
import ReceptionDetailsModalContent from "../../components/receptions/ReceptionDetailsModalContent";
import ReceptionTableRow from "../../components/receptions/ReceptionTableRow";
import {
  statutLabel,
  STATUT_COLOR_CONFIG,
  filterReceptionsOptions,
} from "../../utils/helpers";

import usePagination from "../../hooks/usePagination";
import { useCrudModal } from "../../hooks/useCrudModal";
import { useListManager } from "../../hooks/useListManager";

const Receptions = () => {
  const [receptions, setReceptions] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const { modal, openDelete, openDetails, close } = useCrudModal();
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

    fetchReceptions();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [currentPage, filter, searchQuery, showToast]);

  useEffect(() => {
    resetPagination();
  }, [filter, searchQuery, resetPagination]);

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
          placeholder="Rechercher une réception par immatriculation..."
          value={searchQuery}
          onSearch={handleSearch}
          delay={300}
        />

        <HeaderWithFilter
          title="Réceptions"
          link="/add/reception"
          linkText="Ajouter"
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
                    Fait par
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
                      Aucune réception trouvée.
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
                        isDisabled={isDisabled}
                        showDeleteButton={true}
                        showUpdateButton={false}
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

      {/* Modal de détails de la réception */}
      <Modal show={modal.mode === "details"} onHide={close} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails de la Réception</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal.data && (
            <ReceptionDetailsModalContent
              reception={modal.data}
              resolveStatusConfig={(status) => {
                const config = STATUT_COLOR_CONFIG[status] || {
                  label: status,
                  bg: "secondary",
                };

                return {
                  ...config,
                  label: config.label || statutLabel[status] || status,
                };
              }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmPopup
        show={modal.mode === "delete"}
        onClose={close}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={
          <p>
            Voulez-vous vraiment supprimer la réception <br /> du véhicule{" "}
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

export default Receptions;
