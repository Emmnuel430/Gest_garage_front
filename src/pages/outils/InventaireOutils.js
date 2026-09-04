import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import { useToast } from "../../contexts/ToastContext";
import { fetchWithToken } from "../../utils/fetchWithToken";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import SearchBar from "../../components/Layout/SearchBar";
import Pagination from "../../components/Layout/Pagination";

import usePagination from "../../hooks/usePagination";
import { useCrudModal } from "../../hooks/useCrudModal";
import { useListManager } from "../../hooks/useListManager";
import OutilForm from "../../components/outils/OutilForm";
import OutilsTable from "../../components/outils/OutilsTable";

const InventaireOutils = () => {
  const [outils, setOutils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [libelle, setLibelle] = useState("");
  const [reference, setReference] = useState("");
  const [quantite, setQuantite] = useState(0);
  const [selected, setSelected] = useState(null);
  const formSectionRef = useRef(null);

  const { sortOption, setSortOption, processedList } = useListManager({
    dataList: outils,
    alphaField: "libelle",
    dateField: "created_at",
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const { showToast } = useToast();
  const { modal, openDelete, close } = useCrudModal();

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

    const fetchOutils = async () => {
      setLoading(true);
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/outils?page=${currentPage}&search=${encodeURIComponent(searchQuery)}`,
          { signal: controller.signal },
        );
        const data = await response.json();
        const outilsData = Array.isArray(data) ? data : data.outils || [];
        if (isMounted) {
          setOutils(outilsData);
          if (data.pagination) {
            setPagination(data.pagination);
          }
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        if (isMounted) {
          showToast("Impossible de charger l'inventaire.", "danger");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOutils();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [currentPage, searchQuery]);

  useEffect(() => {
    if (currentPage !== 1) {
      resetPagination();
    }
  }, [searchQuery]);

  const resetFields = () => {
    setLibelle("");
    setReference("");
    setQuantite(0);
    setSelected(null);
  };

  const handleSubmit = async () => {
    if (!libelle || !reference || quantite < 0) {
      showToast("Veuillez remplir tous les champs.", "danger");
      return;
    }

    setActionLoading(true);
    try {
      const url = selected
        ? `${process.env.REACT_APP_API_BASE_URL}/update_outil/${selected.id}`
        : `${process.env.REACT_APP_API_BASE_URL}/add_outil`;

      const response = await fetchWithToken(url, {
        method: "POST",
        body: JSON.stringify({ libelle, reference, quantite }),
      });

      const data = await response.json();
      if (!response.ok) {
        showToast(data.error || "Erreur lors de l'enregistrement.", "danger");
        return;
      }

      showToast(selected ? "Outil mis à jour." : "Outil ajouté.", "success");
      resetFields();
      // Refetch
      const refetchRes = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/outils?page=${currentPage}&search=${encodeURIComponent(searchQuery)}`,
      );
      const refetchData = await refetchRes.json();
      setOutils(
        Array.isArray(refetchData) ? refetchData : refetchData.outils || [],
      );
      if (refetchData.pagination) setPagination(refetchData.pagination);
    } catch (error) {
      showToast("Erreur lors de l'enregistrement.", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (outil) => {
    setSelected(outil);
    setLibelle(outil.libelle);
    setReference(outil.reference);
    setQuantite(outil.quantite);

    requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handleDelete = async () => {
    const selectedOutil = modal.data;
    if (!selectedOutil) return;

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/delete_outil/${selectedOutil.id}`,
        { method: "DELETE" },
      );
      const data = await response.json();
      if (!response.ok) {
        showToast(data.error || "Impossible de supprimer l'outil.", "danger");
        return;
      }
      showToast("Outil supprimé.", "success");
      // Refetch
      const refetchRes = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/outils?page=${currentPage}&search=${encodeURIComponent(searchQuery)}`,
      );
      const refetchData = await refetchRes.json();
      setOutils(
        Array.isArray(refetchData) ? refetchData : refetchData.outils || [],
      );
      if (refetchData.pagination) setPagination(refetchData.pagination);
    } catch (error) {
      showToast("Erreur lors de la suppression.", "danger");
    } finally {
      close();
    }
  };

  return (
    <Layout>
      <div className="container mt-2">
        <SearchBar
          placeholder="Rechercher un outil par libellé ou référence..."
          value={searchQuery}
          onSearch={handleSearch}
          delay={300}
        />

        <HeaderWithFilter
          title="Inventaire des Outils"
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
            <div className="row gy-4">
              <div className="col-lg-4" ref={formSectionRef}>
                <OutilForm
                  selected={selected}
                  libelle={libelle}
                  reference={reference}
                  quantite={quantite}
                  setLibelle={setLibelle}
                  setReference={setReference}
                  setQuantite={setQuantite}
                  onSubmit={handleSubmit}
                  onCancel={resetFields}
                  loading={actionLoading}
                />
              </div>

              <div className="col-lg-8">
                <OutilsTable
                  outils={processedList}
                  selectedId={selected?.id}
                  currentPage={currentPage}
                  totalPages={pagination.last_page || 1}
                  onPageChange={goToPage}
                  onEdit={handleEdit}
                  onDelete={openDelete}
                />
              </div>
            </div>

            {/* Modal de confirmation pour la suppression d'un outil */}
            <ConfirmPopup
              show={modal.mode === "delete"}
              onClose={close}
              onConfirm={handleDelete}
              btnColor="danger"
              title="Confirmer la suppression"
              body={
                <p>
                  Voulez-vous vraiment supprimer cet outil :{" "}
                  <strong>{modal.data?.libelle || "N/A"}</strong> ?
                </p>
              }
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default InventaireOutils;
