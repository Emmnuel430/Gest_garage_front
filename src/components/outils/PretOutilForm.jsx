import React, { useState, useEffect, useMemo } from "react";
import { Collapse } from "react-bootstrap";
import Select from "react-select";
import { useToast } from "../../contexts/ToastContext";
import { useTheme } from "../../contexts/ThemeContext";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { getBootstrapSelectTheme } from "../../utils/helpers";
import PretConfirmModal from "./PretConfirmModal";

const PretOutilForm = ({
  mecaniciens = [],
  reparations = [],
  outils = [],
  prets = [],
  executePret,
  actionLoading = false,
}) => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  const [showPretForm, setShowPretForm] = useState(false);
  const [selectedMecanicien, setSelectedMecanicien] = useState("");
  const [selectedReparation, setSelectedReparation] = useState("");
  const [selectedOutilOption, setSelectedOutilOption] = useState(null);
  const [quantite, setQuantite] = useState(1);
  const [estPartage, setEstPartage] = useState(false);
  const [partagerTousVehicules, setPartagerTousVehicules] = useState(false);

  const [mechanicReparations, setMechanicReparations] = useState([]);
  const [loadingReparations, setLoadingReparations] = useState(false);
  const [showPretConfirm, setShowPretConfirm] = useState(false);

  // Chargement dynamique des réparations du mécanicien sélectionné
  useEffect(() => {
    if (!selectedMecanicien) {
      setMechanicReparations([]);
      setSelectedReparation("");
      setPartagerTousVehicules(false);
      return;
    }

    let isMounted = true;
    const fetchMechanicVehicles = async () => {
      setLoadingReparations(true);
      try {
        const res = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/liste_reparations?mecanicien_id=${selectedMecanicien}&statut=en_cours&all=true`,
        );
        const data = await res.json();
        if (isMounted) {
          const list = data.reparations || [];
          setMechanicReparations(list);
          if (list.length === 1) {
            setSelectedReparation(String(list[0].id));
          } else {
            setSelectedReparation("");
          }
        }
      } catch (err) {
        if (isMounted) {
          const fallbackList = reparations.filter(
            (r) =>
              (Number(r.reception?.vehicule?.mecanicien_id) ===
                Number(selectedMecanicien) ||
                Number(r.reception?.vehicule?.mecanicien?.id) ===
                  Number(selectedMecanicien)) &&
              r.statut === "en_cours",
          );
          setMechanicReparations(fallbackList);
          if (fallbackList.length === 1) {
            setSelectedReparation(String(fallbackList[0].id));
          } else {
            setSelectedReparation("");
          }
        }
      } finally {
        if (isMounted) {
          setLoadingReparations(false);
        }
      }
    };

    fetchMechanicVehicles();

    return () => {
      isMounted = false;
    };
  }, [selectedMecanicien, reparations]);

  // Options React-Select pour les outils
  const customSelectTheme = getBootstrapSelectTheme(isDarkMode);

  const customSelectStyles = useMemo(
    () => ({
      control: (base, state) => ({
        ...base,
        backgroundColor: isDarkMode ? "#212529" : "#ffffff",
        borderColor: state.isFocused
          ? "#0d6efd"
          : isDarkMode
            ? "#495057"
            : "#dee2e6",
        color: isDarkMode ? "#f8f9fa" : "#212529",
        minHeight: "40px",
        boxShadow: state.isFocused
          ? "0 0 0 0.25rem rgba(13,110,253,.25)"
          : null,
      }),
      singleValue: (base) => ({
        ...base,
        color: isDarkMode ? "#f8f9fa" : "#212529",
      }),
      input: (base) => ({
        ...base,
        color: isDarkMode ? "#f8f9fa" : "#212529",
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: isDarkMode ? "#2b3035" : "#ffffff",
        zIndex: 9999,
        border: isDarkMode ? "1px solid #495057" : "1px solid #dee2e6",
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? "#0d6efd"
          : state.isFocused
            ? isDarkMode
              ? "#373b3e"
              : "#f1f3f5"
            : isDarkMode
              ? "#2b3035"
              : "#ffffff",
        color: state.isSelected
          ? "#ffffff"
          : isDarkMode
            ? "#f8f9fa"
            : "#212529",
        cursor: state.isDisabled ? "not-allowed" : "pointer",
      }),
    }),
    [isDarkMode],
  );

  const outilOptions = useMemo(() => {
    return outils.map((o) => ({
      value: o.id,
      label: `${o.libelle} [${o.reference}] — Stock: ${o.quantite}`,
      outil: o,
    }));
  }, [outils]);

  const formatOutilOptionLabel = ({ outil }) => (
    <div className="d-flex align-items-center justify-content-between py-1">
      <div>
        <i className="fas fa-wrench me-2 text-primary"></i>
        <strong>{outil.libelle}</strong>
        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle ms-2">
          {outil.reference}
        </span>
      </div>
      <div>
        {outil.quantite > 0 ? (
          <span className="badge bg-success-subtle text-success border border-success-subtle">
            {outil.quantite} en stock
          </span>
        ) : (
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
            Stock épuisé
          </span>
        )}
      </div>
    </div>
  );

  // Mécanicien actuellement sélectionné
  const currentMecanicien = useMemo(() => {
    return mecaniciens.find((m) => String(m.id) === String(selectedMecanicien));
  }, [mecaniciens, selectedMecanicien]);

  // Réparation actuellement sélectionnée
  const currentReparation = useMemo(() => {
    return mechanicReparations.find(
      (r) => String(r.id) === String(selectedReparation),
    );
  }, [mechanicReparations, selectedReparation]);

  // Vérifier si le mécanicien sélectionné a déjà cet outil emprunté
  const mecanoAlreadyHasOutil = useMemo(() => {
    if (!selectedMecanicien || !selectedOutilOption) return false;
    return prets.some(
      (p) =>
        Number(p.mecanicien_id || p.mecanicien?.id) ===
          Number(selectedMecanicien) &&
        Number(p.outil_id || p.outil?.id) ===
          Number(selectedOutilOption.value) &&
        p.statut === "prete",
    );
  }, [prets, selectedMecanicien, selectedOutilOption]);

  const handlePretButtonClick = () => {
    if (!selectedMecanicien) {
      showToast("Veuillez sélectionner un mécanicien (Étape 1).", "warning");
      return;
    }
    if (!selectedReparation) {
      showToast(
        "Veuillez sélectionner le véhicule concerné (Étape 2).",
        "warning",
      );
      return;
    }
    if (!selectedOutilOption) {
      showToast("Veuillez sélectionner l'outil requis (Étape 3).", "warning");
      return;
    }
    if (quantite < 1) {
      showToast("La quantité prêtée doit être d'au moins 1.", "warning");
      return;
    }
    if (
      !mecanoAlreadyHasOutil &&
      selectedOutilOption.outil?.quantite < quantite
    ) {
      showToast(
        `Stock insuffisant : seulement ${selectedOutilOption.outil?.quantite} unité(s) disponible(s).`,
        "danger",
      );
      return;
    }

    setShowPretConfirm(true);
  };

  const handleConfirmPret = async () => {
    const payload = {
      mecanicien_id: Number(selectedMecanicien),
      reparation_id: Number(selectedReparation),
      outil_id: Number(selectedOutilOption.value),
      quantite: Number(quantite),
      est_partage: estPartage || partagerTousVehicules,
      partager_tous_vehicules: partagerTousVehicules,
    };

    const res = await executePret(payload);
    if (res?.success) {
      setSelectedOutilOption(null);
      setSelectedReparation("");
      setSelectedMecanicien("");
      setQuantite(1);
      setEstPartage(false);
      setPartagerTousVehicules(false);
      setShowPretConfirm(false);
      setShowPretForm(false);
    }
  };

  return (
    <>
      <div className="card p-4 mb-4 border shadow-sm bg-body rounded-3">
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
          <div>
            <h5 className="mb-1 text-primary fw-bold">
              <i className="fas fa-tools me-2 text-warning"></i> Nouveau prêt
              d'outil
            </h5>
            <small className="text-muted">
              Suivez les étapes dans l'ordre : Mécanicien → Véhicule assigné →
              Outil → Partage → Validation
            </small>
          </div>
          <button
            className="btn btn-outline-primary btn-sm px-3"
            onClick={() => setShowPretForm(!showPretForm)}
            aria-controls="pretFormCollapse"
            aria-expanded={showPretForm}
          >
            <span className="me-2">
              {showPretForm ? "Masquer le formulaire" : "Ouvrir le formulaire"}
            </span>
            <i className={`fas fa-chevron-${showPretForm ? "up" : "down"}`}></i>
          </button>
        </div>

        <Collapse in={showPretForm}>
          <div id="pretFormCollapse">
            <div className="row g-3">
              {/* 1. QUI : Mécanicien */}
              <div className="col-md-6">
                <label className="form-label text-primary small fw-bold">
                  <span className="badge bg-primary me-2">1</span>
                  Sélectionner le Mécanicien{" "}
                  <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select border-secondary-subtle"
                  value={selectedMecanicien}
                  onChange={(e) => setSelectedMecanicien(e.target.value)}
                >
                  <option value="">
                    -- 1. Choisir le mécanicien demandeur --
                  </option>
                  {mecaniciens.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.prenom} {m.nom?.toUpperCase()} ({m.type || "Général"})
                    </option>
                  ))}
                </select>
                {currentMecanicien && (
                  <div className="form-text small text-success mt-1">
                    <i className="fas fa-user-check me-1"></i>
                    Mécanicien actif :{" "}
                    <strong>
                      {currentMecanicien.nom?.toUpperCase()}{" "}
                      {currentMecanicien.prenom}
                    </strong>
                  </div>
                )}
              </div>

              {/* 2. SUR QUOI : Véhicule lié au mécanicien */}
              <div className="col-md-6">
                <label className="form-label text-primary small fw-bold">
                  <span className="badge bg-primary me-2">2</span>
                  Véhicule concerné (assigné à ce mécanicien){" "}
                  <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select border-secondary-subtle ${!selectedMecanicien ? "bg-light-subtle" : ""}`}
                  value={selectedReparation}
                  onChange={(e) => setSelectedReparation(e.target.value)}
                  disabled={!selectedMecanicien || loadingReparations}
                >
                  <option value="">
                    {!selectedMecanicien
                      ? "⚠️ Sélectionnez d'abord le mécanicien à l'étape 1"
                      : loadingReparations
                        ? "Chargement des véhicules en cours..."
                        : mechanicReparations.length === 0
                          ? "Aucun véhicule en cours pour ce mécanicien"
                          : "-- 2. Choisir le véhicule en réparation --"}
                  </option>
                  {mechanicReparations.map((rep) => (
                    <option key={rep.id} value={rep.id}>
                      {rep?.reception?.vehicule?.immatriculation || "N/A"} —{" "}
                      {rep?.reception?.vehicule?.marque || ""}{" "}
                      {rep?.reception?.vehicule?.modele || ""} (Motif :{" "}
                      {rep?.reception?.motif_visite ||
                        rep?.description ||
                        "En cours"}
                      )
                    </option>
                  ))}
                </select>

                {selectedMecanicien &&
                  !loadingReparations &&
                  mechanicReparations.length === 0 && (
                    <div className="alert alert-warning py-2 px-3 mt-2 mb-0 small">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      Ce mécanicien n'a aucun véhicule actuellement en cours de
                      réparation.
                    </div>
                  )}

                {currentReparation && (
                  <div className="form-text small text-success mt-1">
                    <i className="fas fa-car me-1"></i>
                    Véhicule sélectionné :{" "}
                    <strong>
                      {currentReparation.reception?.vehicule?.immatriculation}
                    </strong>{" "}
                    ({currentReparation.reception?.vehicule?.marque}{" "}
                    {currentReparation.reception?.vehicule?.modele})
                  </div>
                )}
              </div>

              {/* 3. QUOI : Outil requis (React Select) */}
              <div className="col-md-7">
                <label className="form-label text-primary small fw-bold">
                  <span className="badge bg-primary me-2">3</span>
                  Outil requis <span className="text-danger">*</span> (Recherche
                  par nom ou référence)
                </label>
                <Select
                  className="bg-body"
                  classNamePrefix="select"
                  options={outilOptions}
                  value={selectedOutilOption}
                  onChange={(option) => {
                    setSelectedOutilOption(option);
                    setQuantite(1);
                  }}
                  formatOptionLabel={formatOutilOptionLabel}
                  placeholder="Tapez pour rechercher un outil dans le stock..."
                  isClearable
                  isSearchable
                  theme={customSelectTheme}
                  styles={customSelectStyles}
                />

                {mecanoAlreadyHasOutil && (
                  <div className="alert alert-info py-2 px-3 mt-2 mb-0 small">
                    <i className="fas fa-info-circle me-1"></i>
                    Ce mécanicien détient déjà cet outil sur un autre véhicule.
                    En le déclarant comme <strong>partagé</strong> ci-dessous,
                    le stock ne sera pas décrémenté une seconde fois.
                  </div>
                )}
              </div>

              {/* Quantité */}
              <div className="col-md-2">
                <label className="form-label text-primary small fw-bold">
                  Quantité <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control border-secondary-subtle"
                  min="1"
                  max={
                    selectedOutilOption?.outil
                      ? Math.max(selectedOutilOption.outil.quantite, 1)
                      : 1
                  }
                  value={quantite}
                  onChange={(e) =>
                    setQuantite(Math.max(1, Number(e.target.value)))
                  }
                  disabled={!selectedOutilOption}
                />
                {selectedOutilOption && (
                  <small className="text-muted d-block mt-1">
                    Max stock : {selectedOutilOption.outil?.quantite}
                  </small>
                )}
              </div>

              {/* 4. COMMENT : Outil partagé */}
              <div className="col-md-3">
                <label className="form-label text-primary small fw-bold">
                  <span className="badge bg-primary me-2">4</span>
                  Modalité de partage
                </label>
                <div className="p-2 bg-body border rounded-3 border-secondary-subtle">
                  <div className="form-check d-flex align-items-center mb-0">
                    <input
                      className="form-check-input my-0 me-2"
                      type="checkbox"
                      checked={estPartage}
                      onChange={(e) => {
                        setEstPartage(e.target.checked);
                        if (!e.target.checked) setPartagerTousVehicules(false);
                      }}
                      id="partageCheck"
                    />
                    <label
                      className="form-check-label fw-bold text-body small cursor-pointer"
                      htmlFor="partageCheck"
                    >
                      Outil Partagé
                    </label>
                  </div>
                  <small
                    className="text-muted d-block mt-1"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Utilisable sur d'autres véhicules du mécanicien
                  </small>
                </div>
              </div>

              {/* Option supplémentaire si le mécanicien a plusieurs véhicules en cours */}
              {estPartage && mechanicReparations.length > 1 && (
                <div className="col-12">
                  <div className="p-3 bg-body-tertiary border rounded-3 border-info-subtle">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="partagerTousCheck"
                        checked={partagerTousVehicules}
                        onChange={(e) =>
                          setPartagerTousVehicules(e.target.checked)
                        }
                      />
                      <label
                        className="form-check-label fw-bold text-body small"
                        htmlFor="partagerTousCheck"
                      >
                        <i className="fas fa-layer-group me-1 text-info"></i>
                        Partager automatiquement sur TOUS les véhicules
                        actuellement en réparation avec lui (
                        {mechanicReparations.length} véhicules)
                      </label>
                    </div>
                    <div className="small text-muted mt-1 ps-4">
                      Plaques concernées :{" "}
                      {mechanicReparations.map((r) => (
                        <span
                          key={r.id}
                          className="badge bg-secondary-subtle text-secondary border me-1"
                        >
                          {r.reception?.vehicule?.immatriculation}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Validation sécurisée avec ConfirmPopup */}
            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top flex-wrap gap-2">
              <span className="small text-muted">
                <i className="fas fa-shield-alt me-1 text-success"></i>
                Étape 5 : Une fenêtre de confirmation récapitulative sécurisera
                votre enregistrement.
              </span>
              <button
                className="btn btn-primary px-4 py-2 rounded-pill shadow-sm"
                onClick={handlePretButtonClick}
                disabled={
                  actionLoading ||
                  !selectedOutilOption ||
                  !selectedReparation ||
                  !selectedMecanicien ||
                  quantite < 1
                }
              >
                <i className="fas fa-check-circle me-2"></i>
                Vérifier & Valider le Prêt
              </button>
            </div>
          </div>
        </Collapse>
      </div>

      <PretConfirmModal
        show={showPretConfirm}
        onClose={() => setShowPretConfirm(false)}
        onConfirm={handleConfirmPret}
        mecanicien={currentMecanicien}
        reparation={currentReparation}
        selectedOutilOption={selectedOutilOption}
        quantite={quantite}
        estPartage={estPartage}
        partagerTousVehicules={partagerTousVehicules}
        mechanicReparationsCount={mechanicReparations.length}
        mecanoAlreadyHasOutil={mecanoAlreadyHasOutil}
      />
    </>
  );
};

export default PretOutilForm;
