import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Layout from "../components/Layout/Layout";
import Loader from "../components/Layout/Loader";
import HeaderWithFilter from "../components/Layout/HeaderWithFilter";
import Pagination from "../components/Layout/Pagination";
import { fetchWithToken } from "../utils/fetchWithToken";

import { ACTION_LABELS, formatRole } from "../utils/helpers";
import { useToast } from "../contexts/ToastContext";

import { getActionColor, getActionLabel } from "../utils/helpers";
import LogsTable from "../components/logs/LogsTable";
import LogDetails from "../components/logs/LogDetails";

import usePagination from "../hooks/usePagination";
import { useCrudModal } from "../hooks/useCrudModal";
import { useListManager } from "../hooks/useListManager";

const Logs = () => {
  // États pour gérer les données
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // On utilise notre hook. Il lit l'URL et nous donne tout prêt !
  const { filter, setFilter, sortOption, setSortOption, processedList } =
    useListManager({
      dataList: logs, // On lui donne la liste brute
      alphaField: "nom",
      dateField: "created_at",
    });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const { showToast } = useToast();
  const { modal, openDetails, close } = useCrudModal();

  const {
    currentPage,
    goToPage,
    reset: resetPagination,
  } = usePagination(pagination.last_page || 1);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchLogs = async () => {
      setLoading(true);

      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/logs?page=${currentPage}&action=${filter}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des logs");
        }

        const data = await response.json();
        const logsData = data.logs || [];
        const logItems = Array.isArray(logsData)
          ? logsData
          : logsData.data || [];

        if (isMounted) {
          setLogs(logItems);
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

    fetchLogs();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [currentPage, filter, showToast]);

  useEffect(() => {
    resetPagination();
  }, [filter, resetPagination]);

  const handleShowDetails = (log) => {
    openDetails(log);
  };

  const filterOptions = [
    { value: "", label: "Tous les logs" },
    ...Object.entries(ACTION_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  return (
    <Layout>
      <div className="container mt-2">
        <HeaderWithFilter
          title2="Logs"
          main={pagination.total}
          filter={filter}
          setFilter={setFilter}
          filterOptions={filterOptions}
          sortOption={sortOption}
          setSortOption={setSortOption}
          hasDateSort={true}
          hasAlphaSort={false}
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
            <LogsTable
              logs={processedList}
              onShowDetails={handleShowDetails}
              getActionColor={getActionColor}
              getActionLabel={getActionLabel}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={pagination.last_page || 1}
              onPageChange={goToPage}
            />

            {/* Modal pour afficher les détails d'un log */}
            <Modal
              show={modal.mode === "details"}
              onHide={close}
              centered
              size="lg"
            >
              <Modal.Header closeButton>
                <Modal.Title>Détails du Log</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {modal.data && (
                  <LogDetails
                    log={modal.data}
                    formatRole={formatRole}
                    getActionColor={getActionColor}
                    getActionLabel={getActionLabel}
                  />
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={close}>
                  Fermer
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Logs;
