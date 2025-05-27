import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout"; // Composant Layout qui contient la structure générale de la page
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter"; // Composant pour l'en-tête avec filtre
import Loader from "../../components/Layout/Loader"; // Composant pour le loader
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Composant de modal de confirmation pour la suppression d'utilisateur
import SearchBar from "../../components/Layout/SearchBar"; // Composant pour la barre de recherche

const Garages = () => {
  // États locaux pour gérer les garages, l'état de chargement, les erreurs et les modals
  const [garages, setGarages] = useState([]); // Liste des garages
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState(""); // État pour les erreurs
  const [showModal, setShowModal] = useState(false); // État pour afficher ou cacher le modal de confirmation
  const [selectedGarage, setSelectedGarage] = useState(null); // Garage sélectionné pour suppression
  const [sortOption, setSortOption] = useState(""); // État pour l'option de tri
  const [sortedGarages, setSortedGarages] = useState([]); // Liste des garages triés
  const [searchQuery, setSearchQuery] = useState(""); // Requête de recherche pour filtrer les garages

  // Récupérer l'ID de l'utilisateur connecté à partir du localStorage
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const userId = userInfo ? userInfo.id : null; // ID de l'utilisateur connecté

  // Récupérer la liste des utilisateurs lors du premier rendu
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // On commence par définir l'état de chargement à true
      setError(""); // Réinitialiser l'erreur

      try {
        // Requête pour récupérer la liste des utilisateurs
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/liste_garage`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des utilisateurs.");
        }
        const data = await response.json(); // Convertir la réponse en JSON
        setGarages(data.garages); // Mettre à jour l'état garages avec les données récupérées
      } catch (err) {
        setError("Impossible de charger les données : " + err.message); // Si erreur, la définir dans l'état
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchUsers(); // Appel de la fonction pour récupérer les utilisateurs
  }, []); // Dépendances vides, donc ce code est exécuté au premier rendu seulement

  // Ouvrir le modal de confirmation de suppression avec l'utilisateur sélectionné
  const handleOpenModal = (user) => {
    setSelectedGarage(user); // On définit l'utilisateur sélectionné
    setShowModal(true); // On affiche le modal
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setShowModal(false); // Cacher le modal
    setSelectedGarage(null); // Réinitialiser l'utilisateur sélectionné
  };

  // Fonction pour supprimer l'utilisateur sélectionné
  const handleDelete = async () => {
    if (!selectedGarage) return; // Si aucun utilisateur sélectionné, on ne fait rien

    try {
      // Requête DELETE pour supprimer l'utilisateur
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/delete_garage/${selectedGarage.id}?user_id=${userId}`,
        {
          method: "DELETE", // Méthode de suppression
          headers: { "Content-Type": "application/json" }, // Headers
        }
      );

      const result = await response.json(); // Convertir la réponse en JSON

      // Si l'utilisateur a été supprimé
      if (result.status === "deleted") {
        alert("Garage supprimé !"); // Afficher un message de succès
        setGarages(garages.filter((garage) => garage.id !== selectedGarage.id)); // Mettre à jour la liste des garages
      } else {
        alert("Échec de la suppression."); // Si l'échec
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la suppression."); // En cas d'erreur
    } finally {
      handleCloseModal(); // Fermer le modal après la suppression
    }
  };

  const filteredGarages = sortedGarages.filter(
    (garage) =>
      garage.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      garage.adresse.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mt-2">
        {/* Affichage des erreurs s'il y en a */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Affichage du loader si on est en train de charger les données */}
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }} // Centrer Loader au milieu de l'écran
          >
            <Loader />
          </div>
        ) : (
          <>
            {/* Barre de recherche */}
            <SearchBar
              placeholder="Rechercher un garage..."
              onSearch={(query) => setSearchQuery(query)}
              delay={300}
            />
            {/* Affichage de l'en-tête avec filtre et le bouton pour ajouter un garage */}
            <HeaderWithFilter
              title="Garages"
              link="/add/garage"
              linkText="Ajouter"
              main={garages.length || null}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={garages}
              setSortedList={setSortedGarages}
              alphaField="nom"
              dateField="created_at"
            />
            {/* Affichage de la liste des utilisateurs dans un tableau */}
            <Table hover responsive className="centered-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Adresse</th>
                  <th>Opérations</th>
                </tr>
              </thead>
              <tbody>
                {filteredGarages.length > 0 ? (
                  // Si des utilisateurs existent, on les affiche dans des lignes de tableau
                  filteredGarages
                    .sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )
                    .map((garage) => (
                      <tr key={garage.id}>
                        <td>{garage.id}</td>
                        <td>{garage.nom}</td>
                        <td>{garage.adresse}</td>
                        <td className="table-operations d-flex justify-content-center">
                          {/* Lien pour modifier l'utilisateur */}
                          <Link
                            to={`/update/garage/${garage.id}`}
                            className="btn btn-warning btn-sm me-2"
                          >
                            Modifier
                          </Link>
                          {/* Bouton pour supprimer l'utilisateur (si ce n'est pas l'utilisateur connecté) */}

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleOpenModal(garage)} // Ouvre le modal pour la suppression
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                ) : (
                  // Si aucun utilisateur n'est trouvé
                  <tr>
                    <td colSpan="6" className="text-center">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}
      </div>

      {/* Modal de confirmation pour la suppression d'un utilisateur */}
      <ConfirmPopup
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={
          <p>
            Voulez-vous vraiment supprimer le garage{" "}
            <strong>{selectedGarage?.nom || "Inconnu"}</strong> ?
          </p>
        }
      />
    </Layout>
  );
};

export default Garages;
