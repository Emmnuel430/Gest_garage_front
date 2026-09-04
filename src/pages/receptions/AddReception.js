import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import Select from "react-select";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import { useToast } from "../../contexts/ToastContext";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { useTheme } from "../../contexts/ThemeContext";
import { getBootstrapSelectTheme } from "../../utils/helpers";

const AddReception = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [vehicule, setVehicule] = useState({
    immatriculation: "",
    marque: "",
    modele: "",
    mecanicien_id: null,
  });
  const [mecaniciens, setMecaniciens] = useState([]);
  // const [activeTools, setActiveTools] = useState([]);

  const [motifsList, setMotifsList] = useState([]);
  const [motifInput, setMotifInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAddMotif = (e) => {
    if (e.key === "Enter" && motifInput.trim() !== "") {
      e.preventDefault();
      setMotifsList((prev) => [...prev, motifInput.trim()]);
      setMotifInput("");
    }
  };

  const removeMotif = (index) => {
    setMotifsList((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchMecaniciens();
  }, []);

  // const checkActiveTools = async (mecanicienId) => {
  //   if (!mecanicienId) {
  //     setActiveTools([]);
  //     return;
  //   }
  //   try {
  //     const response = await fetchWithToken(
  //       `${process.env.REACT_APP_API_BASE_URL}/mecaniciens/${mecanicienId}/outils-actifs`,
  //     );
  //     const data = await response.json();
  //     if (response.ok) {
  //       setActiveTools(data || []);
  //     } else {
  //       setActiveTools([]);
  //     }
  //   } catch (error) {
  //     setActiveTools([]);
  //   }
  // };

  const fetchMecaniciens = async () => {
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/liste_mecaniciens`,
      );
      const data = await response.json();
      if (response.ok) {
        setMecaniciens(data.mecaniciens);
      } else {
        showToast(data.error || "Une erreur est survenue.", "danger");
      }
    } catch (error) {
      showToast("Une erreur inattendue s'est produite.", "danger");
    }
  };

  const handleShowModal = () => {
    if (
      !vehicule.immatriculation ||
      !vehicule.marque ||
      !vehicule.modele ||
      motifsList.length === 0
    ) {
      showToast("Tous les champs obligatoires doivent être remplis.", "danger");
      return;
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const addReception = async () => {
    setLoading(true);
    try {
      const payload = {
        ...vehicule,
        motif_visite: motifsList.join(", "),
      };

      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/add_reception`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        showToast(result.error || "Une erreur est survenue.", "danger");
        setLoading(false);
        return;
      }

      showToast("Réception enregistrée avec succès.", "success");
      navigate("/receptions");
    } catch (e) {
      showToast("Une erreur inattendue s'est produite.", "danger");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const mecanicienOptions = useMemo(
    () =>
      mecaniciens.map((mecanicien) => ({
        value: mecanicien.id,
        label: `${mecanicien.nom} ${mecanicien.prenom}`,
      })),
    [mecaniciens],
  );

  const customTheme = getBootstrapSelectTheme(isDarkMode);

  return (
    <Layout>
      <Back>receptions</Back>
      <div className="col-sm-6 offset-sm-3 mt-5">
        <h1>Ajout d'une Réception</h1>
        <br />

        <div>
          <h4>Infos du véhicule</h4>
        </div>
        <label className="form-label">Immatriculation *</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ex: AA-123-BC ou 1234-AA-01"
          value={vehicule.immatriculation}
          onChange={(e) =>
            setVehicule({ ...vehicule, immatriculation: e.target.value })
          }
        />
        <br />

        <label className="form-label">Marque *</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ex: Toyota"
          value={vehicule.marque}
          onChange={(e) => setVehicule({ ...vehicule, marque: e.target.value })}
        />
        <br />

        <label className="form-label">Modèle *</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ex: Corolla"
          value={vehicule.modele}
          onChange={(e) => setVehicule({ ...vehicule, modele: e.target.value })}
        />
        <br />

        <label className="form-label">Mecanicien *</label>
        <Select
          className="bg-body"
          classNamePrefix="select"
          options={mecanicienOptions}
          value={
            mecanicienOptions.find(
              (opt) => opt.value === vehicule.mecanicien_id,
            ) || null
          }
          onChange={(selectedOption) => {
            setVehicule({
              ...vehicule,
              mecanicien_id: selectedOption?.value || null,
            });
            // checkActiveTools(selectedOption?.value);
          }}
          placeholder="Sélectionner un mécanicien"
          isClearable
          isSearchable
          theme={customTheme} // Appliquer le thème personnalisé
        />
        {/* {activeTools.length > 0 && (
          <>
            <div className="alert alert-warning mt-2 mb-0">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Ce mécanicien utilise l'outil{" "}
              <strong>
                {activeTools.map((t) => t.outil?.libelle || "Outil").join(", ")}
              </strong>{" "}
              sur une autre réparation en cours. Veuillez déclarer cet(ces)
              outil(s) comme partagé(s) dans la page "Prêt / Restitution" après
              l'enregistrement !
            </div>
            <br />

            <hr />
          </>
        )} */}
        <br />
        <label className="form-label">
          Motif(s) de la visite * (Entrée pour ajouter)
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Ex: Révision, Vidange..."
          value={motifInput}
          onChange={(e) => setMotifInput(e.target.value)}
          onKeyDown={handleAddMotif}
        />
        <div className="mt-2 d-flex flex-wrap gap-2">
          {motifsList.map((motif, index) => (
            <span
              key={index}
              className="badge bg-secondary d-flex align-items-center"
            >
              {motif}
              <button
                type="button"
                className="btn-close btn-close-white ms-2"
                style={{ fontSize: "0.5rem" }}
                onClick={() => removeMotif(index)}
              ></button>
            </span>
          ))}
        </div>
        {motifsList.length === 0 && (
          <small className="text-muted">
            Aucun motif ajouté. Appuyez sur Entrée pour valider chaque motif.
          </small>
        )}
        <br />

        <button
          onClick={handleShowModal}
          disabled={
            loading ||
            !vehicule.immatriculation ||
            !vehicule.marque ||
            !vehicule.modele ||
            !vehicule.mecanicien_id ||
            motifsList.length === 0
          }
          className="btn btn-primary w-100 mt-3"
        >
          {loading ? (
            <span>
              <i className="fas fa-spinner fa-spin"></i> Chargement...
            </span>
          ) : (
            <span>Ajouter</span>
          )}
        </button>
      </div>

      <ConfirmPopup
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={addReception}
        title="Confirmer l'ajout"
        body={
          <div>
            <p>Êtes-vous sûr de vouloir enregistrer cette réception ?</p>
            <strong>Immatriculation :</strong> {vehicule.immatriculation}
            <br />
            <strong>Marque :</strong> {vehicule.marque}
            <br />
            <strong>Modèle :</strong> {vehicule.modele || "-"}
            <br />
            <strong>Motif(s) :</strong> {motifsList.join(", ")}
          </div>
        }
      />
    </Layout>
  );
};

export default AddReception;
