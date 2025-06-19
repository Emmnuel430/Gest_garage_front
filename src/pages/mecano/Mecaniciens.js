import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout"; // Composant Layout qui contient la structure générale de la page
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter"; // Composant pour l'en-tête avec filtre
import Loader from "../../components/Layout/Loader"; // Composant pour le loader
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Composant de modal de confirmation pour la suppression d'utilisateur
import SearchBar from "../../components/Layout/SearchBar"; // Composant pour la barre de recherche
import { format } from "date-fns"; // Utilisation de la librairie date-fns pour formater les dates
import MecanicienUpdate from "./MecanicienUpdate"; // Composant pour la mise à jour d'un mécanicien

const Mecaniciens = () => {
  // États locaux pour gérer les mécaniciens, l'état de chargement, les erreurs et les modals
  const [mecaniciens, setMecaniciens] = useState([]); // Liste des mécaniciens
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState(""); // État pour les erreurs
  const [showModal, setShowModal] = useState(false); // État pour afficher ou cacher le modal de confirmation
  const [selectedMecanicien, setSelectedMecanicien] = useState(null); // Mécanicien sélectionné pour suppression
  const [filter, setFilter] = useState(""); // État pour le filtre
  const [sortOption, setSortOption] = useState(""); // État pour l'option de tri
  const [sortedMecaniciens, setSortedMecaniciens] = useState([]); // Liste des mécaniciens triés
  const [searchQuery, setSearchQuery] = useState(""); // Requête de recherche pour filtrer les mécaniciens
  const [showDetailsModal, setShowDetailsModal] = useState(false); // Contrôle de l'affichage du modal de détails
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [mecanicienToUpdate, setMecanicienToUpdate] = useState(null);
  const navigate = useNavigate(); // Hook pour la navigation

  // Récupérer l'ID de l'utilisateur connecté à partir du localStorage
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const userId = userInfo ? userInfo.id : null; // ID de l'utilisateur connecté

  // Récupérer la liste des mécaniciens lors du premier rendu
  useEffect(() => {
    const fetchMecaniciens = async () => {
      setLoading(true); // On commence par définir l'état de chargement à true
      setError(""); // Réinitialiser l'erreur

      try {
        // Requête pour récupérer la liste des mécaniciens
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/liste_mecaniciens`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des mécaniciens.");
        }
        const data = await response.json(); // Convertir la réponse en JSON
        setMecaniciens(data.mecaniciens); // Mettre à jour l'état mécaniciens avec les données récupérées
      } catch (err) {
        setError("Impossible de charger les données : " + err.message); // Si erreur, la définir dans l'état
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchMecaniciens(); // Appel de la fonction pour récupérer les mécaniciens
  }, []); // Dépendances vides, donc ce code est exécuté au premier rendu seulement

  // Ouvrir le modal de confirmation de suppression avec le mécanicien sélectionné
  const handleOpenModal = (mecanicien) => {
    setSelectedMecanicien(mecanicien); // On définit le mécanicien sélectionné
    setShowModal(true); // On affiche le modal
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setShowModal(false); // Cacher le modal
    setSelectedMecanicien(null); // Réinitialiser le mécanicien sélectionné
  };

  // Fonction pour ouvrir le modal de détails d'un mécanicien
  const handleShowDetails = (mecanicien) => {
    setSelectedMecanicien(mecanicien);

    setShowDetailsModal(true);
  };

  // Fonction pour fermer le modal de détails
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedMecanicien(null);
  };
  // -------------------
  const handleOpenUpdateModal = (mecanicien) => {
    setMecanicienToUpdate(mecanicien);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setMecanicienToUpdate(null);
  };

  const handleUpdateMecanicien = async (updatedMecanicien) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/update_mecanicien/${updatedMecanicien.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...updatedMecanicien,
            user_id: userId,
          }),
        }
      );

      if (!response.ok) throw new Error("Échec de la mise à jour");

      setMecaniciens((prevMecaniciens) =>
        prevMecaniciens.map((mecanicien) =>
          mecanicien.id === updatedMecanicien.id
            ? updatedMecanicien
            : mecanicien
        )
      );

      alert("Mécanicien mis à jour avec succès.");
      handleCloseUpdateModal();
      navigate("/mecaniciens");
    } catch (error) {
      alert("Erreur lors de la mise à jour.");
    }
  };

  // -------------------

  // Fonction pour supprimer le mécanicien sélectionné
  const handleDelete = async () => {
    if (!selectedMecanicien) return; // Si aucun mécanicien sélectionné, on ne fait rien

    try {
      // Requête DELETE pour supprimer le mécanicien
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/delete_mecanicien/${selectedMecanicien.id}?user_id=${userId}`,
        {
          method: "DELETE", // Méthode de suppression
          headers: { "Content-Type": "application/json" }, // Headers
        }
      );

      const result = await response.json(); // Convertir la réponse en JSON

      // Si le mécanicien a été supprimé
      if (result.status === "deleted") {
        alert("Mécanicien supprimé !"); // Afficher un message de succès
        setMecaniciens(
          mecaniciens.filter(
            (mecanicien) => mecanicien.id !== selectedMecanicien.id
          )
        ); // Mettre à jour la liste des mécaniciens
      } else {
        alert("Échec de la suppression."); // Si l'échec
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la suppression."); // En cas d'erreur
    } finally {
      handleCloseModal(); // Fermer le modal après la suppression
    }
  };

  // Fonction pour formater un numéro de téléphone
  const formatPhoneNumber = (number) => {
    return number.replace(/(\d{2})(?=(\d{2})+(?!\d))/g, "$1 "); // Formate le numéro en groupes de 2 chiffres
  };

  const filteredMecaniciens = sortedMecaniciens.filter(
    (mecanicien) =>
      mecanicien.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mecanicien.prenom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatStatut(statut) {
    if (!statut) return "";
    return statut
      .split("_") // coupe par "_"
      .join(" "); // re-colle avec des espaces
  }

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
              placeholder="Rechercher un mécanicien..."
              onSearch={(query) => setSearchQuery(query)}
              delay={300}
            />
            {/* Affichage de l'en-tête avec filtre et le bouton pour ajouter un mecanicien */}
            <HeaderWithFilter
              title="Mécaniciens"
              link="/add/mecanicien"
              linkText="Ajouter"
              main={mecaniciens.length || null}
              filter={filter}
              setFilter={setFilter}
              filterOptions={[
                { value: "", label: "Tous les mécaniciens" },
                { value: "interne", label: "Interne" },
                { value: "externe", label: "Externe" },
              ]}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={mecaniciens}
              setSortedList={setSortedMecaniciens}
              alphaField="nom"
              dateField="created_at"
            />
            {/* Affichage de la liste des utilisateurs dans un tableau */}
            <Table hover responsive className="centered-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Prenom</th>
                  <th>Type</th>
                  <th>Contact</th>
                  <th>Opérations</th>
                </tr>
              </thead>
              <tbody>
                {filteredMecaniciens.length > 0 ? (
                  // Si des utilisateurs existent, on les affiche dans des lignes de tableau
                  filteredMecaniciens
                    .filter(
                      (mecanicien) => !filter || mecanicien.type === filter
                    )
                    .sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )

                    .map((mecanicien) => (
                      <tr key={mecanicien.id}>
                        <td>MEC-{mecanicien.id}</td>
                        <td>{mecanicien.nom}</td>
                        <td>{mecanicien.prenom}</td>
                        <td>
                          {mecanicien.type === "interne" ? (
                            <span className="badge bg-success">Interne</span>
                          ) : (
                            <span className="badge bg-info">Externe</span> ||
                            "N/A"
                          )}
                        </td>
                        <td>{formatPhoneNumber(mecanicien.contact)}</td>
                        <td className="table-operations">
                          <div className="d-flex align-items-stretch justify-content-center gap-2 h-100">
                            <button
                              onClick={() => handleShowDetails(mecanicien)}
                              className="btn btn-info btn-sm me-2"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            {/* Lien pour modifier l'utilisateur */}
                            <button
                              onClick={() => handleOpenUpdateModal(mecanicien)}
                              className="btn btn-warning btn-sm me-2"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            {/* Bouton pour supprimer l'utilisateur (si ce n'est pas l'utilisateur connecté) */}

                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleOpenModal(mecanicien)} // Ouvre le modal pour la suppression
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Aucun mécanicien trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}
      </div>
      {/* Modal de détails */}
      <Modal
        show={showDetailsModal}
        onHide={handleCloseDetailsModal}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Détails du Mécanicien</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMecanicien && (
            <div className="container">
              {/* En-tête mécanicien */}
              <div className="text-center mb-4">
                <h2 className="text-primary mb-1">
                  {selectedMecanicien.nom} {selectedMecanicien.prenom}
                </h2>
                <h6 className="text-muted mb-2">
                  ID MEC-{selectedMecanicien.id}
                </h6>
                <span
                  className={`badge fs-6 ${
                    selectedMecanicien.type === "interne"
                      ? "bg-success-subtle text-success"
                      : "bg-info-subtle text-info"
                  }`}
                >
                  {selectedMecanicien.type === "interne"
                    ? "👷 Mécanicien Interne"
                    : "🔧 Mécanicien Externe"}
                </span>
              </div>

              {/* Informations personnelles */}
              <div className="bg-body rounded shadow-sm p-3 mb-3">
                <h5 className="mb-3">👤 Informations personnelles</h5>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <strong>Expérience :</strong>{" "}
                    {selectedMecanicien.experience || "N/A"} ans
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Numéro de téléphone :</strong>{" "}
                    {formatPhoneNumber(selectedMecanicien.contact) || "N/A"}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Contact d'urgence :</strong>{" "}
                    {formatPhoneNumber(selectedMecanicien.contact_urgence) ||
                      "N/A"}
                  </div>
                  <div className="col-md-6 mb-2 text-capitalize">
                    <strong>Véhicules maîtrisés :</strong>{" "}
                    {selectedMecanicien.vehicules_maitrises || "N/A"}
                  </div>
                </div>
              </div>

              {/* Historique */}
              <div className="bg-body rounded shadow-sm p-3 mb-3">
                <h5 className="mb-3">📅 Historique</h5>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <strong>Date d'ajout :</strong>{" "}
                    {format(
                      new Date(selectedMecanicien.created_at),
                      "dd/MM/yyyy HH:mm:ss"
                    )}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Dernière mise à jour :</strong>{" "}
                    {selectedMecanicien.updated_at ===
                    selectedMecanicien.created_at
                      ? "-"
                      : format(
                          new Date(selectedMecanicien.updated_at),
                          "dd/MM/yyyy HH:mm:ss"
                        )}
                  </div>
                </div>
              </div>

              {/* Fiche d'enrôlement */}
              <div className="bg-body rounded shadow-sm p-3 mb-3">
                <h5 className="mb-3">📄 Fiche d'enrôlement</h5>
                {selectedMecanicien.fiche_enrolement ? (
                  <Link
                    to={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${selectedMecanicien.fiche_enrolement}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Voir la fiche
                  </Link>
                ) : (
                  <span className="text-muted">Non disponible</span>
                )}
              </div>

              {selectedMecanicien.reparations &&
                selectedMecanicien.reparations.length > 0 && (
                  <>
                    <hr />
                    <h5 className="mt-3">Véhicules réparés</h5>
                    <div className="table-responsive">
                      <Table hover responsive className="centered-table mt-2">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Immat.</th>
                            <th>Marque</th>
                            <th>Modèle</th>
                            <th>Client</th>
                            <th>Date réception</th>
                            <th>Date de sortie</th>
                            <th>Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedMecanicien.reparations
                            .sort(
                              (a, b) =>
                                new Date(b.created_at) - new Date(a.created_at)
                            )
                            .map((rep, index) => (
                              <tr key={rep.id}>
                                <td>{index + 1}</td>
                                <td>
                                  {rep.reception?.vehicule?.immatriculation ||
                                    "N/A"}
                                </td>
                                <td>
                                  {rep.reception?.vehicule?.marque || "N/A"}
                                </td>
                                <td>
                                  {rep.reception?.vehicule?.modele || "N/A"}
                                </td>
                                <td>
                                  {rep.reception?.vehicule?.client_nom || "N/A"}
                                </td>
                                <td>
                                  {rep.reception?.date_arrivee
                                    ? format(
                                        new Date(rep.reception.date_arrivee),
                                        "dd/MM/yyyy HH:mm"
                                      )
                                    : "N/A"}
                                </td>
                                <td>
                                  {rep.updated_at
                                    ? format(
                                        new Date(rep.updated_at),
                                        "dd/MM/yyyy HH:mm"
                                      )
                                    : "N/A"}
                                </td>
                                <td>
                                  <span
                                    className={`text-uppercase badge ${
                                      rep.statut === "termine"
                                        ? "bg-success"
                                        : "bg-warning"
                                    }`}
                                  >
                                    {formatStatut(rep.statut)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </div>
                  </>
                )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal de mise à jour */}
      <Modal
        show={showUpdateModal}
        onHide={handleCloseUpdateModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Modifier un Mécanicien</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MecanicienUpdate
            onClose={handleCloseUpdateModal}
            mecanicien={mecanicienToUpdate}
            onUpdate={handleUpdateMecanicien} // Ajout de la fonction de mise à jour
          />
        </Modal.Body>
      </Modal>
      {/* Modal de confirmation pour la suppression d'un mécanicien */}
      <ConfirmPopup
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={
          <p>
            Voulez-vous vraiment supprimer le mécanicien{" "}
            <strong>{selectedMecanicien?.nom || "Inconnu"}</strong> ?
          </p>
        }
      />
    </Layout>
  );
};

export default Mecaniciens;
