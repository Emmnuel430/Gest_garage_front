import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Importation du popup de confirmation

const GarageUpdate = () => {
  // Récupération de l'ID de l'utilisateur à partir des paramètres d'URL
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(""); // État pour les erreurs
  const [garage, setGarage] = useState({
    nom: "",
    adresse: "",
  }); // État pour stocker les données du garage
  const [loading, setLoading] = useState(false); // État pour gérer l'état de chargement
  const [showModal, setShowModal] = useState(false); // État pour afficher ou non le modal de confirmation

  const userInfo = JSON.parse(localStorage.getItem("user-info")); // Récupérer les informations de l'utilisateur connecté
  const userId = userInfo ? userInfo.id : null; // Récupérer l'ID de l'utilisateur connecté

  // Hook useEffect qui se déclenche une fois au montage du composant
  useEffect(() => {
    // Fonction pour récupérer les données d'un garage via l'API
    const fetchGarage = async () => {
      setError(""); // Réinitialisation de l'erreur avant chaque appel
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/garage/${id}`
        ); // Requête pour récupérer le garage
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }
        const data = await response.json(); // Parse de la réponse JSON
        setGarage({ ...data.garage }); // Mise à jour des données du garage
      } catch (error) {
        setError("Erreur lors de la récupération des données.");
      }
    };

    fetchGarage(); // Appel de la fonction pour récupérer les données du garage
  }, [id]);

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGarage({ ...garage, [name]: value });
  };

  // Fonction pour confirmer la modification du garage
  const handleConfirm = () => {
    setShowModal(false); // Ferme le modal
    updateGarage(); // Appel de la fonction de mise à jour
  };

  // Fonction pour annuler la modification et fermer le modal
  const handleCancel = () => {
    setShowModal(false); // Ferme le modal
  };

  // Fonction pour mettre à jour les données du garage via l'API
  const updateGarage = async () => {
    setError(""); // Réinitialisation de l'erreur avant la mise à jour
    setLoading(true); // Indique que l'on est en cours de traitement
    try {
      if (!userId) {
        alert("Utilisateur non authentifié. Veuillez vous connecter.");
        navigate("/"); // Si l'utilisateur n'est pas authentifié, redirige vers la page de connexion
        return;
      }

      const body = { ...garage }; // Création du corps de la requête

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/update_garage/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...body,
            user_id: userId,
          }),
        }
      );

      if (response.ok) {
        alert("Données mises à jour !");
        navigate("/garages"); // Redirige vers la liste des garages après la mise à jour
      } else {
        const errorResponse = await response.json();
        alert(errorResponse.message || "Échec de la mise à jour.");
      }
    } catch (error) {
      setError("Erreur lors de la mise à jour du garage."); // Gère l'erreur éventuelle
    } finally {
      setLoading(false); // Fin du traitement
    }
  };

  return (
    <Layout>
      <Back>garages</Back>
      <div className="col-sm-6 offset-sm-3">
        {error && <div className="alert alert-danger">{error}</div>}{" "}
        {/* Affiche les erreurs, s'il y en a */}
        <h1>Modifier les données du garage</h1>
        <br />
        {/* Champs de formulaire pour modifier les données du garage */}
        <label htmlFor="nom" className="form-label">
          Nom
        </label>
        <input
          type="text"
          id="nom"
          name="nom"
          className="form-control"
          placeholder="Nom"
          value={garage.nom}
          onChange={handleChange} // Appel de la fonction de gestion des changements
        />
        <br />
        <label htmlFor="adresse" className="form-label">
          Adresse
        </label>
        <input
          type="text"
          id="adresse"
          name="adresse"
          className="form-control"
          placeholder="Adresse"
          value={garage.adresse}
          onChange={handleChange}
        />
        <br />
        {/* Bouton pour valider la modification */}
        <button
          onClick={() => setShowModal(true)} // Ouvre le modal de confirmation
          className="btn btn-primary w-100"
          disabled={loading} // Désactive le bouton pendant le chargement
        >
          {loading ? (
            <span>
              <i className="fas fa-spinner fa-spin"></i> Chargement...
            </span>
          ) : (
            <span>Modifier</span>
          )}
        </button>
      </div>

      {/* Modal de confirmation */}
      <ConfirmPopup
        show={showModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Confirmer la modification"
        body={<p>Voulez-vous vraiment modifier les infos de ce garage ?</p>}
      />
    </Layout>
  );
};

export default GarageUpdate;
