import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import Select from "react-select";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ToastMessage from "../../components/Layout/ToastMessage";

const AddReception = () => {
  const navigate = useNavigate();

  const [vehicule, setVehicule] = useState({
    immatriculation: "",
    marque: "",
    modele: "",
    client_nom: "",
    client_tel: "",
    mecanicien_id: null,
  });
  const [mecaniciens, setMecaniciens] = useState([]);

  const [motif_visite, setMotifVisite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMecaniciens();
  }, []);

  const fetchMecaniciens = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/liste_mecaniciens`
      );
      const data = await response.json();
      if (response.ok) {
        setMecaniciens(data.mecaniciens);
      } else {
        setError(data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      setError("Une erreur inattendue s'est produite.");
    }
  };

  const handleShowModal = () => {
    if (
      !vehicule.immatriculation ||
      !vehicule.marque ||
      !vehicule.client_nom ||
      !vehicule.client_tel ||
      !motif_visite
    ) {
      setError("Tous les champs obligatoires doivent être remplis.");
      return;
    }
    setError("");
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const addReception = async () => {
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("user-info"));
      const gardien_id = userInfo ? userInfo.id : null;

      if (!gardien_id) {
        alert("Utilisateur non authentifié. Veuillez vous connecter.");
        navigate("/");
        return;
      }

      const payload = {
        ...vehicule,
        motif_visite,
        gardien_id,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/add_reception`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      alert("Réception enregistrée avec succès.");
      navigate("/receptions");
    } catch (e) {
      setError("Une erreur inattendue s'est produite.");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const options = mecaniciens.map((mecanicien) => ({
    value: mecanicien.id,
    label: `${mecanicien.nom} ${mecanicien.prenom}`,
  }));

  // Fonction pour récupérer le thème Bootstrap depuis l'attribut HTML
  const getBootstrapTheme = () => {
    return document.body.getAttribute("data-bs-theme") === "dark";
  };
  const [isDarkMode, setIsDarkMode] = useState(getBootstrapTheme());

  // Détecte le changement de thème Bootstrap (si data-bs-theme change dynamiquement)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(getBootstrapTheme());
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-bs-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const customTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      neutral0: isDarkMode ? "#212529" : "#fff", // fond du select
      neutral80: isDarkMode ? "#f8f9fa" : "#212529", // texte
      primary25: isDarkMode ? "#343a40" : "#e9ecef", // survol
      primary: "#0d6efd", // couleur principale Bootstrap
    },
  });

  return (
    <Layout>
      <Back>receptions</Back>
      <div className="col-sm-6 offset-sm-3 mt-5">
        <h1>Ajout d'une Réception</h1>
        <br />

        {error && <ToastMessage message={error} onClose={() => setError("")} />}

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

        <label className="form-label">Modèle</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ex: Corolla"
          value={vehicule.modele}
          onChange={(e) => setVehicule({ ...vehicule, modele: e.target.value })}
        />
        <br />

        <label className="form-label">Nom du client *</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ex: John Doe"
          value={vehicule.client_nom}
          onChange={(e) =>
            setVehicule({ ...vehicule, client_nom: e.target.value })
          }
        />
        <br />

        <label className="form-label">Téléphone du client *</label>
        <input
          type="number"
          className="form-control"
          placeholder="Ex: 0123456789"
          value={vehicule.client_tel}
          onChange={(e) =>
            setVehicule({ ...vehicule, client_tel: e.target.value })
          }
        />
        <br />

        <label className="form-label">Mecanicien</label>
        <Select
          className="bg-body"
          classNamePrefix="select"
          options={options}
          value={
            options.find((opt) => opt.value === vehicule.mecanicien_id) || null
          }
          onChange={(selectedOption) =>
            setVehicule({
              ...vehicule,
              mecanicien_id: selectedOption?.value || "",
            })
          }
          placeholder="Sélectionner un mécanicien"
          isClearable
          isSearchable
          theme={customTheme} // Appliquer le thème personnalisé
        />
        <br />

        <span>------------------------------------------------------</span>
        <br />
        <label className="form-label">Motif de la visite *</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ex: Révision"
          value={motif_visite}
          onChange={(e) => setMotifVisite(e.target.value)}
        />
        <br />

        <button
          onClick={handleShowModal}
          disabled={
            loading ||
            !vehicule.immatriculation ||
            !vehicule.marque ||
            !vehicule.modele ||
            !vehicule.mecanicien_id ||
            !vehicule.client_nom ||
            !vehicule.client_tel ||
            !motif_visite
          }
          className="btn btn-primary w-100"
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
            <strong>Client :</strong> {vehicule.client_nom} (
            {vehicule.client_tel})<br />
            <strong>Motif :</strong> {motif_visite}
          </div>
        }
      />
    </Layout>
  );
};

export default AddReception;
