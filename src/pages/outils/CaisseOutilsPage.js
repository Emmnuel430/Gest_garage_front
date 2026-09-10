import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import SearchBar from "../../components/Layout/SearchBar";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import useCaisseOutils from "../../hooks/useCaisseOutils";
import MultiToolWarningBanner from "../../components/outils/MultiToolWarningBanner";
import PretOutilForm from "../../components/outils/PretOutilForm";
import PretsOutilsTable from "../../components/outils/PretsOutilsTable";
import RestitutionConfirmModal from "../../components/outils/RestitutionConfirmModal";
import EditPretModal from "../../components/outils/EditPretModal";

const CaisseOutilsPage = () => {
  const {
    prets,
    outils,
    reparations,
    mecaniciens,
    processedList,
    multiToolMechanics,
    loading,
    actionLoading,
    pagination,
    currentPage,
    goToPage,
    searchQuery,
    setSearchQuery,
    handleSearch,
    filter,
    handleFilterChange,
    sortOption,
    setSortOption,
    executePret,
    executeRestitution,
    executeEditQuantite,
  } = useCaisseOutils();

  // Modals de restitution et d'édition
  const [showRestitutionConfirm, setShowRestitutionConfirm] = useState(false);
  const [pretToRestituer, setPretToRestituer] = useState(null);
  const [pretToEdit, setPretToEdit] = useState(null);

  const handleRestitutionClick = (pret) => {
    setPretToRestituer(pret);
    setShowRestitutionConfirm(true);
  };

  const handleConfirmRestitution = async () => {
    if (!pretToRestituer) return;
    const res = await executeRestitution(pretToRestituer.id);
    if (res?.success) {
      setShowRestitutionConfirm(false);
      setPretToRestituer(null);
    }
  };

  const handleEditClick = (pret) => {
    setPretToEdit(pret);
  };

  const handleSaveEdit = async (pretId, quantite) => {
    const res = await executeEditQuantite(pretId, quantite);
    if (res?.success) {
      setPretToEdit(null);
    }
  };

  const filterOptions = [
    { value: "", label: "Tous les statuts" },
    { value: "prete", label: "En cours (Prêté)" },
    { value: "restitue", label: "Restitué" },
  ];

  return (
    <Layout>
      <div className="container mt-2">
        <SearchBar
          placeholder="Rechercher un prêt par mécanicien, véhicule ou outil..."
          value={searchQuery}
          onSearch={handleSearch}
          delay={300}
        />

        <HeaderWithFilter
          title2="Prêts & Restitutions d'outils"
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
            {/* Bandeau d'avertissement multi-outils */}
            <MultiToolWarningBanner
              multiToolMechanics={multiToolMechanics}
              onFilterMechanic={setSearchQuery}
            />

            {/* Formulaire de prêt ordonné en 5 étapes */}
            <PretOutilForm
              mecaniciens={mecaniciens}
              reparations={reparations}
              outils={outils}
              prets={prets}
              executePret={executePret}
              actionLoading={actionLoading}
            />

            {/* Tableau des prêts d'outils */}
            <PretsOutilsTable
              prets={processedList}
              currentPage={currentPage}
              totalPages={pagination.last_page || 1}
              onPageChange={goToPage}
              onEditPret={handleEditClick}
              onRestituerPret={handleRestitutionClick}
              actionLoading={actionLoading}
            />
          </>
        )}
      </div>

      {/* Modal de confirmation de restitution */}
      <RestitutionConfirmModal
        show={showRestitutionConfirm}
        onClose={() => {
          setShowRestitutionConfirm(false);
          setPretToRestituer(null);
        }}
        onConfirm={handleConfirmRestitution}
        pret={pretToRestituer}
      />

      {/* Modal de modification de la quantité */}
      <EditPretModal
        show={Boolean(pretToEdit)}
        onClose={() => setPretToEdit(null)}
        onSave={handleSaveEdit}
        pret={pretToEdit}
        actionLoading={actionLoading}
      />
    </Layout>
  );
};

export default CaisseOutilsPage;
