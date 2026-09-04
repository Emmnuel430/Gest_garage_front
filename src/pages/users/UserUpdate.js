import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Importation du popup de confirmation
import { useToast } from "../../contexts/ToastContext";
import { fetchWithToken } from "../../utils/fetchWithToken";

const UserUpdate = () => {
  // Récupération de l'ID de l'utilisateur à partir des paramètres d'URL
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    pseudo: "",
    role: "",
    newPassword: "",
  }); // État pour stocker les données de l'utilisateur
  const [loading, setLoading] = useState(false); // État pour gérer l'état de chargement
  const [showModal, setShowModal] = useState(false); // État pour afficher ou non le modal de confirmation
  const [showPasswordInput, setShowPasswordInput] = useState(false); // État pour afficher ou masquer le champ de mot de passe
  const [showPassword, setShowPassword] = useState(false);

  const userInfo = JSON.parse(sessionStorage.getItem("user-info")); // Récupérer les informations de l'utilisateur connecté
  const userId = userInfo ? userInfo.id : null; // Récupérer l'ID de l'utilisateur connecté

  // Hook useEffect qui se déclenche une fois au montage du composant
  useEffect(() => {
    // Fonction pour récupérer les données d'un utilisateur via l'API
    const fetchUser = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/user/${id}`,
        ); // Requête pour récupérer l'utilisateur
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des données utilisateur.",
          );
        }
        const data = await response.json(); // Parse de la réponse JSON
        setUser({ ...data.user, newPassword: "" }); // Mise à jour des données utilisateur
      } catch (error) {
        showToast(
          "Erreur lors de la récupération des données utilisateur.",
          "danger",
        );
      }
    };

    fetchUser(); // Appel de la fonction pour récupérer les données de l'utilisateur
  }, [id]);

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Fonction pour confirmer la modification de l'utilisateur
  const handleConfirm = () => {
    setShowModal(false); // Ferme le modal
    updateUser(); // Appel de la fonction de mise à jour
  };

  // Fonction pour annuler la modification et fermer le modal
  const handleCancel = () => {
    setShowModal(false); // Ferme le modal
  };

  // Fonction pour mettre à jour les données de l'utilisateur via l'API
  const updateUser = async () => {
    setLoading(true); // Indique que l'on est en cours de traitement
    try {
      if (!userId) {
        showToast(
          "Utilisateur non authentifié. Veuillez vous connecter.",
          "danger",
        );
        navigate("/"); // Si l'utilisateur n'est pas authentifié, redirige vers la page de connexion
        return;
      }

      const { first_name, last_name, pseudo, role, newPassword } = user;

      const body = { prenom: first_name, nom: last_name, pseudo }; // Création du corps de la requête

      if (newPassword) {
        body.password = newPassword; // Si un nouveau mot de passe est fourni, l'ajouter au corps
      }

      if (userInfo.role === "admin" && role) {
        body.role = role;
      }

      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/update_user/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const data = await response.json(); // Parse de la réponse JSON

      if (response.ok) {
        showToast("Données mises à jour avec succès !", "success");
        if (parseInt(userId) === parseInt(id)) {
          sessionStorage.setItem("user-info", JSON.stringify(data.user));
        }
        navigate("/utilisateurs"); // Redirige vers la liste des utilisateurs après la mise à jour
      } else {
        showToast(data.message || "Échec de la mise à jour.", "danger");
      }
    } catch (error) {
      showToast("Erreur lors de la mise à jour de l'utilisateur.", "danger"); // Gère l'erreur éventuelle
    } finally {
      setLoading(false); // Fin du traitement
    }
  };

  const roles = [
    { value: "admin", label: "Gérant" },
    { value: "gardien", label: "Gardien" },
    { value: "reception", label: "Réception" },
    { value: "caisse_outils", label: "Caisse Outils" },
    { value: "caisse", label: "Caisse" },
  ];

  return (
    <Layout>
      <Back>utilisateurs</Back>
      <div className="col-sm-6 offset-sm-3">
        <h1>Modifier les données de l'utilisateur</h1>
        <br />
        {/* Champs de formulaire pour modifier les données de l'utilisateur */}
        <label htmlFor="last_name" className="form-label">
          Nom
        </label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          className="form-control"
          placeholder="Nom"
          value={user.last_name}
          onChange={handleChange} // Appel de la fonction de gestion des changements
        />
        <br />
        <label htmlFor="first_name" className="form-label">
          Prénom
        </label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          className="form-control"
          placeholder="Prénom"
          value={user.first_name}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="pseudo" className="form-label">
          Pseudo
        </label>
        <input
          type="text"
          id="pseudo"
          name="pseudo"
          className="form-control"
          placeholder="Pseudo"
          value={user.pseudo}
          onChange={handleChange}
        />
        <br />
        {userInfo.role === "admin" && (
          <>
            <label htmlFor="role" className="form-label">
              Rôle
            </label>
            <select
              id="role"
              name="role"
              className="form-select"
              value={user.role}
              onChange={handleChange}
            >
              <option value="">-- Sélectionner un rôle --</option>
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <br />
          </>
        )}
        <br />
        {/* Bouton pour afficher ou masquer le champ de mot de passe */}
        <button
          onClick={() => setShowPasswordInput(!showPasswordInput)}
          className="btn btn-secondary w-100"
        >
          {showPasswordInput
            ? "Masquer le champ de mot de passe"
            : "Modifier le mot de passe"}
        </button>
        <br />
        <br />
        {showPasswordInput && (
          <>
            {/* Champ pour modifier le mot de passe */}
            <label htmlFor="newPassword" className="form-label">
              Nouveau mot de passe
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                className="form-control"
                placeholder="Nouveau mot de passe *"
                value={user.newPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-outline-secondary"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
            <small className="text-muted">
              * Laissez vide si vous ne souhaitez pas modifier le mot de passe.
            </small>
            <br />
          </>
        )}
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
        body={<p>Voulez-vous vraiment modifier cet utilisateur ?</p>}
      />
    </Layout>
  );
};

export default UserUpdate;
