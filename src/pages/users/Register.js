import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Importation du modal de confirmation
import { useToast } from "../../contexts/ToastContext";
import { fetchWithToken } from "../../utils/fetchWithToken";

const Register = () => {
  // États pour stocker les données du formulaire et d'autres informations d'état
  const [nom, setNom] = useState(""); // Nom de l'utilisateur
  const [prenom, setPrenom] = useState(""); // Prénom de l'utilisateur
  const [pseudo, setPseudo] = useState(""); // Pseudo de l'utilisateur
  const [password, setPassword] = useState(""); // Mot de passe de l'utilisateur
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(""); // Rôle de l'utilisateur
  const [loading, setLoading] = useState(false); // Indicateur de chargement lors de la soumission
  const [showModal, setShowModal] = useState(false); // Contrôle l'affichage du modal de confirmation
  const navigate = useNavigate(); // Hook pour la navigation
  const { showToast } = useToast();

  // Récupération de l'utilisateur actuellement connecté depuis le sessionStorage
  const userInfo = JSON.parse(sessionStorage.getItem("user-info"));
  const userId = userInfo ? userInfo.id : null;

  // Si aucun utilisateur n'est authentifié, on redirige vers la page de connexion
  if (!userId) {
    showToast(
      "Utilisateur non authentifié. Veuillez vous connecter.",
      "warning",
    );
    navigate("/");
    return;
  }

  const roles = [
    { value: "admin", label: "Gérant" },
    { value: "gardien", label: "Gardien" },
    { value: "reception", label: "Réception" },
    { value: "caisse_outils", label: "Caisse Outils" },
    { value: "caisse", label: "Caisse" },
  ];

  // Fonction pour confirmer l'inscription
  const handleConfirm = () => {
    signUp(); // Lance la fonction d'inscription
  };

  // Fonction pour annuler l'inscription et fermer le modal
  const handleCancel = () => {
    setShowModal(false);
  };

  // Fonction pour envoyer les données du formulaire au backend
  const signUp = async () => {
    // Vérification que tous les champs sont remplis
    if (!nom || !prenom || !pseudo || !password) {
      showToast("Tous les champs sont requis.", "danger");
      return;
    }

    setLoading(true); // Active le chargement

    try {
      // Données à envoyer au serveur
      const item = { nom, prenom, pseudo, password, role };

      // Envoi des données au backend avec une requête POST
      let result = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/add_user`,
        {
          method: "POST",
          body: JSON.stringify(item),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      result = await result.json();

      // Si une erreur est retournée par le serveur, on l'affiche et on désactive le chargement
      if (result.error) {
        showToast(result.error, "danger");
        setLoading(false);
        return;
      }

      setLoading(false); // Désactive le chargement
      showToast("Utilisateur enregistré avec succès.", "success");
      setNom(""); // Réinitialise les champs du formulaire
      setPrenom("");
      setPseudo("");
      setPassword("");
      setRole("");
      navigate("/utilisateurs"); // Redirige vers la liste des utilisateurs
    } catch (e) {
      showToast(
        "Une erreur inattendue s'est produite. Veuillez réessayer.",
        "danger",
      );
      setLoading(false);
    } finally {
      setShowModal(false); // Ferme le modal de confirmation
    }
  };

  return (
    <Layout>
      <Back>utilisateurs</Back>
      <div className="col-sm-6 offset-sm-3 mt-5">
        <h1>Création d'un nouvel utilisateur</h1>

        {/* Formulaire d'inscription */}
        <label htmlFor="nom" className="form-label">
          Nom
        </label>
        <input
          type="text"
          id="nom"
          className="form-control"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)} // Mise à jour de l'état pour le champ nom
        />
        <br />

        <label htmlFor="prenom" className="form-label">
          Prénom
        </label>
        <input
          type="text"
          id="prenom"
          className="form-control"
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)} // Mise à jour de l'état pour le champ prénom
        />
        <br />

        <label htmlFor="pseudo" className="form-label">
          Pseudo
        </label>
        <input
          type="text"
          id="pseudo"
          className="form-control"
          placeholder="Pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)} // Mise à jour de l'état pour le champ pseudo
        />
        <br />

        <div className="mb-3 position-relative">
          <label htmlFor="password" className="form-label">
            Mot de passe
          </label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="form-control"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="btn btn-outline-secondary"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>
        </div>

        {/* Sélecteur du rôle de l'utilisateur (Admin ou Staff) */}
        <div className="mb-4">
          <label htmlFor="role" className="form-label font-semibold">
            Rôle de l'utilisateur :
          </label>
          <select
            id="role"
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">-- Sélectionner un rôle --</option>
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bouton pour soumettre le formulaire avec un modal de confirmation */}
        <button
          onClick={() => setShowModal(true)} // Ouvre le modal de confirmation
          className="btn btn-primary w-100"
          disabled={!nom || !prenom || !pseudo || !password || loading}
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

      {/* Modal de confirmation avant de soumettre l'inscription */}
      <ConfirmPopup
        show={showModal}
        onClose={handleCancel} // Annule et ferme le modal
        onConfirm={handleConfirm} // Confirme l'inscription et ferme le modal
        title="Confirmer l'inscription"
        body={<p>Voulez-vous vraiment ajouter cet utilisateur ?</p>}
      />
    </Layout>
  );
};

export default Register;
