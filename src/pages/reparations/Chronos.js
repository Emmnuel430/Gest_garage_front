import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Pagination from "../../components/Layout/Pagination";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { useToast } from "../../contexts/ToastContext";
import ChronoCard from "../../components/reparations/chrono/ChronoCard";
import ChronosTable from "../../components/reparations/chrono/ChronosTable";

import usePagination from "../../hooks/usePagination";
import { useCrudModal } from "../../hooks/useCrudModal";
import { useListManager } from "../../hooks/useListManager";

const Chronos = () => {
  const [chronos, setChronos] = useState([]);
  const [chronosEnCours, setChronosEnCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pauseLoadingIds, setPauseLoadingIds] = useState([]);
  const [resumeLoadingIds, setResumeLoadingIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { showToast } = useToast();

  const { modal, open, close } = useCrudModal();

  const { sortOption, setSortOption, processedList } = useListManager({
    dataList: chronos,
    dateField: "created_at",
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const {
    currentPage,
    goToPage,
    reset: resetPagination,
  } = usePagination(pagination.last_page || 1);

  const userInfo = JSON.parse(sessionStorage.getItem("user-info"));

  const handleSearch = (query) => {
    setSearchQuery(query);
    resetPagination();
  };

  const refreshChronos = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchChronos = async () => {
      setLoading(true);

      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/liste_chronos?page=${currentPage}&search=${encodeURIComponent(searchQuery)}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des chronos.");
        }
        const data = await response.json();
        if (isMounted) {
          setChronos(data.chronos || []);
          if (data.pagination) {
            setPagination(data.pagination);
          }
          if (data.chronos_en_cours) {
            setChronosEnCours(data.chronos_en_cours);
          } else {
            setChronosEnCours(
              (data.chronos || []).filter((chrono) => !chrono.end_time),
            );
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

    fetchChronos();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [currentPage, searchQuery, refreshTrigger, showToast]);

  useEffect(() => {
    resetPagination();
  }, [searchQuery, resetPagination]);

  const [, setCurrentTime] = useState(Date.now());

  // Actualiser l'heure locale toutes les secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePauseChrono = async () => {
    const receptionId = modal.data?.reception?.id;
    if (!receptionId) return;

    setPauseLoadingIds((prev) => [...prev, receptionId]);
    close();

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/pause_chrono/${receptionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      const result = await response.json();
      showToast(result.message, "info");

      setChronosEnCours((prev) =>
        prev.map((c) =>
          c.reception?.id === receptionId
            ? { ...c, pause_time: new Date().toISOString(), resume_time: null }
            : c,
        ),
      );
      setChronos((prev) =>
        prev.map((c) =>
          c.reception?.id === receptionId
            ? { ...c, pause_time: new Date().toISOString(), resume_time: null }
            : c,
        ),
      );
      setTimeout(() => {
        refreshChronos();
      }, 200);
    } catch (err) {
      showToast("Erreur lors de la mise en pause du chrono.", "danger");
    } finally {
      setPauseLoadingIds((prev) => prev.filter((id) => id !== receptionId));
    }
  };

  const handleResumeChrono = async (receptionId) => {
    setResumeLoadingIds((prev) => [...prev, receptionId]);

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/resume_chrono/${receptionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      const result = await response.json();
      showToast(result.message, "info");

      setChronosEnCours((prev) =>
        prev.map((c) =>
          c.reception?.id === receptionId
            ? { ...c, resume_time: new Date().toISOString(), pause_time: null }
            : c,
        ),
      );
      setChronos((prev) =>
        prev.map((c) =>
          c.reception?.id === receptionId
            ? { ...c, resume_time: new Date().toISOString(), pause_time: null }
            : c,
        ),
      );

      setTimeout(() => {
        refreshChronos();
      }, 200);
    } catch (err) {
      showToast("Erreur lors de la reprise du chrono.", "danger");
    } finally {
      setResumeLoadingIds((prev) => prev.filter((id) => id !== receptionId));
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="mb-4">Chronos en cours</h2>
        <h5>Total : ({chronosEnCours.length || 0})</h5>
        <br />

        {chronosEnCours.length === 0 ? (
          <div className="text-center text-muted py-3">
            Aucun chrono en cours.
          </div>
        ) : (
          <div className="row justify-content-center">
            {chronosEnCours
              .filter((c) => !c.end_time)
              .map((chrono) => (
                <ChronoCard
                  key={chrono.id}
                  chrono={chrono}
                  userRole={userInfo?.role}
                  onPause={(c) => open("pause", c)}
                  onResume={handleResumeChrono}
                  pauseLoadingIds={pauseLoadingIds}
                  resumeLoadingIds={resumeLoadingIds}
                />
              ))}
          </div>
        )}

        <div className="mt-5">
          <SearchBar
            placeholder="Rechercher un chrono par immatriculation..."
            value={searchQuery}
            onSearch={handleSearch}
            delay={300}
          />

          <HeaderWithFilter
            title2="Historique des Chronos"
            main={pagination.total}
            sortOption={sortOption}
            setSortOption={setSortOption}
            hasAlphaSort={false}
            hasDateSort={true}
          />

          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "30vh" }}
            >
              <Loader />
            </div>
          ) : (
            <>
              <ChronosTable rows={processedList} />

              <Pagination
                currentPage={currentPage}
                totalPages={pagination.last_page || 1}
                onPageChange={goToPage}
              />
            </>
          )}
        </div>
      </div>

      <ConfirmPopup
        show={modal.mode === "pause"}
        onClose={close}
        onConfirm={handlePauseChrono}
        title="Confirmer la pause du chrono"
        body={
          <p>
            Voulez-vous vraiment mettre en pause le chrono de{" "}
            <strong>
              {modal.data?.reception?.vehicule?.immatriculation || "Inconnue"}
            </strong>{" "}
            ?
          </p>
        }
      />
    </Layout>
  );
};

export default Chronos;
