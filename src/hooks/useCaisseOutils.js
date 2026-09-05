import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchWithToken } from "../utils/fetchWithToken";
import { useToast } from "../contexts/ToastContext";
import usePagination from "./usePagination";
import { useListManager } from "./useListManager";

export const useCaisseOutils = () => {
  const { showToast } = useToast();

  const [prets, setPrets] = useState([]);
  const [outils, setOutils] = useState([]);
  const [reparations, setReparations] = useState([]);
  const [mecaniciens, setMecaniciens] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const { filter, setFilter, sortOption, setSortOption, processedList } =
    useListManager({
      dataList: prets,
      dateField: "created_at",
    });

  const {
    currentPage,
    goToPage,
    reset: resetPagination,
  } = usePagination(pagination.last_page || 1);

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      resetPagination();
    },
    [resetPagination],
  );

  const handleFilterChange = useCallback(
    (newFilter) => {
      setFilter(newFilter);
      resetPagination();
    },
    [setFilter, resetPagination],
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pretsRes, outilsRes, reparationsRes, mecanoRes] =
        await Promise.all([
          fetchWithToken(
            `${process.env.REACT_APP_API_BASE_URL}/prets_outils?page=${currentPage}&statut=${filter}&search=${encodeURIComponent(searchQuery)}`,
          ),
          fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/outils`),
          fetchWithToken(
            `${process.env.REACT_APP_API_BASE_URL}/liste_reparations?statut=en_cours&all=true`,
          ),
          fetchWithToken(
            `${process.env.REACT_APP_API_BASE_URL}/liste_mecaniciens?all=true`,
          ),
        ]);

      const [pretsData, outilsData, reparationsData, mecanoData] =
        await Promise.all([
          pretsRes.json(),
          outilsRes.json(),
          reparationsRes.json(),
          mecanoRes.json(),
        ]);

      setPrets(pretsData.prets || []);
      if (pretsData.pagination) {
        setPagination(pretsData.pagination);
      }
      setOutils(
        Array.isArray(outilsData) ? outilsData : outilsData.outils || [],
      );
      setReparations(reparationsData.reparations || []);
      setMecaniciens(mecanoData.mecaniciens || []);
    } catch (error) {
      if (error.name === "AbortError") return;
      showToast(
        "Impossible de charger les données de la caisse outils.",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter, searchQuery, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    resetPagination();
  }, [filter, searchQuery, resetPagination]);

  // Action : Exécuter un nouveau prêt
  const executePret = useCallback(
    async (pretPayload) => {
      setActionLoading(true);
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/prete_outil`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pretPayload),
          },
        );
        const data = await response.json();
        if (!response.ok) {
          showToast(
            data.error || "Erreur lors de l'enregistrement du prêt.",
            "danger",
          );
          return { success: false, error: data.error };
        }
        showToast(
          data.message || "Prêt d'outil enregistré avec succès.",
          "success",
        );
        await fetchData();
        return { success: true };
      } catch (error) {
        showToast("Erreur de communication avec le serveur.", "danger");
        return { success: false, error };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchData, showToast],
  );

  // Action : Restituer un outil
  const executeRestitution = useCallback(
    async (pretId) => {
      if (!pretId) return { success: false };
      setActionLoading(true);
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/restitue_outil/${pretId}`,
          { method: "POST" },
        );
        const data = await response.json();
        if (!response.ok) {
          showToast(data.error || "Erreur lors de la restitution.", "danger");
          return { success: false, error: data.error };
        }
        showToast(data.message || "Outil restitué avec succès.", "success");
        await fetchData();
        return { success: true };
      } catch (error) {
        showToast("Erreur lors de la restitution de l'outil.", "danger");
        return { success: false, error };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchData, showToast],
  );

  // Action : Modifier la quantité d'un prêt
  const executeEditQuantite = useCallback(
    async (pretId, quantite) => {
      if (!pretId || quantite < 1) return { success: false };
      setActionLoading(true);
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/update_pret/${pretId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantite_pretee: quantite }),
          },
        );
        const data = await response.json();
        if (!response.ok) {
          showToast(
            data.error || "Erreur lors de la modification.",
            "danger",
          );
          return { success: false, error: data.error };
        }
        showToast("Prêt mis à jour avec succès.", "success");
        await fetchData();
        return { success: true };
      } catch (error) {
        showToast("Erreur lors de la modification du prêt.", "danger");
        return { success: false, error };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchData, showToast],
  );

  // Détection des mécaniciens détenant plusieurs outils simultanément
  const multiToolMechanics = useMemo(() => {
    const activeLoans = prets.filter((p) => p.statut === "prete");
    const mecanoActiveLoanCounts = activeLoans.reduce((acc, pret) => {
      const mecanoId = pret.mecanicien_id || pret.mecanicien?.id;
      const name = pret.mecanicien
        ? `${pret.mecanicien.prenom} ${pret.mecanicien.nom}`
        : `Mécanicien #${mecanoId}`;
      if (mecanoId) {
        acc[mecanoId] = acc[mecanoId] || { name, count: 0, items: [] };
        acc[mecanoId].count += 1;
        acc[mecanoId].items.push(pret);
      }
      return acc;
    }, {});

    return Object.values(mecanoActiveLoanCounts).filter((m) => m.count > 1);
  }, [prets]);

  return {
    // Listes de données
    prets,
    outils,
    reparations,
    mecaniciens,
    processedList,
    multiToolMechanics,

    // États de chargement
    loading,
    actionLoading,

    // Pagination & Filtres
    pagination,
    currentPage,
    goToPage,
    resetPagination,
    searchQuery,
    setSearchQuery,
    handleSearch,
    filter,
    setFilter,
    handleFilterChange,
    sortOption,
    setSortOption,

    // Actions & reload
    fetchData,
    executePret,
    executeRestitution,
    executeEditQuantite,
  };
};

export default useCaisseOutils;
