import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ToastMessage from "../../components/Layout/ToastMessage";

const AddGarage = () => {
  const navigate = useNavigate();

  const [garage, setGarage] = useState({
    nom: "",
    adresse: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    if (!garage.nom || !garage.adresse) {
      setError("Tous les champs sont requis.");
      return;
    }
    setError("");
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const addGarage = async () => {
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("user-info"));
      const userId = userInfo ? userInfo.id : null;

      if (!userId) {
        alert("Utilisateur non authentifié. Veuillez vous connecter.");
        navigate("/");
        return;
      }

      const payload = { ...garage, admin_id: userId };

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/add_garage`,
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

      alert("Garage ajouté avec succès.");
      setGarage({ nom: "", adresse: "" });
      navigate("/garages");
    } catch (e) {
      setError("Une erreur inattendue s'est produite.");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <Layout>
      <Back>garages</Back>
      <div className="col-sm-6 offset-sm-3 mt-5">
        <h1>Ajout d'un Garage</h1>

        {error && (
          <ToastMessage
            message={error}
            onClose={() => {
              setError(null);
            }}
          />
        )}

        <label className="form-label">Nom du garage</label>
        <input
          type="text"
          className="form-control"
          placeholder="Nom du garage"
          value={garage.nom}
          onChange={(e) => setGarage({ ...garage, nom: e.target.value })}
        />
        <br />

        <label className="form-label">Adresse</label>
        <input
          type="text"
          className="form-control"
          placeholder="Adresse du garage"
          value={garage.adresse}
          onChange={(e) => setGarage({ ...garage, adresse: e.target.value })}
        />
        <br />

        <button
          onClick={handleShowModal}
          disabled={loading}
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
        onConfirm={addGarage}
        title="Confirmer l'ajout"
        body={
          <p>
            Êtes-vous sûr de vouloir ajouter ce garage ?<br />
            <strong>Nom :</strong> {garage.nom}
            <br />
            <strong>Adresse :</strong> {garage.adresse}
            <br />
          </p>
        }
      />
      <br />
      <br />
    </Layout>
  );
};

export default AddGarage;
