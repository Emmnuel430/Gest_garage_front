import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import SearchBar from "../../components/Layout/SearchBar";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Pagination from "../../components/Layout/Pagination";
import { Modal } from "react-bootstrap";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { useToast } from "../../contexts/ToastContext";
import BilletSortieTable from "../../components/reparations/billetSortie/BilletSortieTable";
import BilletSortieDetails from "../../components/reparations/billetSortie/BilletSortieDetails";

import usePagination from "../../hooks/usePagination";
import { useCrudModal } from "../../hooks/useCrudModal";
import { useListManager } from "../../hooks/useListManager";

const BilletsSortie = () => {
  const [billetsSortie, setBilletsSortie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { sortOption, setSortOption, processedList } = useListManager({
    dataList: billetsSortie,
    dateField: "created_at",
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const { modal, openDetails, close } = useCrudModal();
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

    const fetchBilletsSortie = async () => {
      setLoading(true);
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/liste_billet_sortie?page=${currentPage}&search=${encodeURIComponent(searchQuery)}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        if (isMounted) {
          setBilletsSortie(data.billets_sortie || []);
          if (data.pagination) {
            setPagination(data.pagination);
          }
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        if (isMounted) {
          showToast("Erreur lors du chargement des billets de sortie.", "danger");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBilletsSortie();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [currentPage, searchQuery, showToast]);

  useEffect(() => {
    resetPagination();
  }, [searchQuery, resetPagination]);

  return (
    <Layout>
      <div className="container mt-4">
        <SearchBar
          placeholder="Rechercher un billet par immatriculation..."
          value={searchQuery}
          onSearch={handleSearch}
          delay={300}
        />

        <HeaderWithFilter
          title2="Billets de sortie"
          main={pagination.total}
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
          <div className="table-responsive">
            <BilletSortieTable
              billets={processedList}
              onShowDetails={openDetails}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={pagination.last_page || 1}
              onPageChange={goToPage}
            />
          </div>
        )}
      </div>

      {/* Modal de détails */}
      <Modal show={modal.mode === "details"} onHide={close} centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails du billet de sortie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal.data && <BilletSortieDetails billet={modal.data} />}
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default BilletsSortie;
