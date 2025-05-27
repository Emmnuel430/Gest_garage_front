import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import { Modal } from "react-bootstrap";
import { format } from "date-fns";

const Receptions = () => {
  const [receptions, setReceptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false); // Contrôle de l'affichage du modal de détails
  const [selectedReception, setSelectedReception] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [sortedReceptions, setSortedReceptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const userId = userInfo ? userInfo.id : null;

  useEffect(() => {
    const fetchReceptions = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/liste_receptions`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des réceptions.");
        }
        const data = await response.json();
        setReceptions(data.receptions);
        setSortedReceptions(data.receptions);
      } catch (err) {
        setError("Impossible de charger les données : " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReceptions();
  }, []);

  // Fonction pour ouvrir le modal de détails d'une réception
  const handleShowDetails = (reception) => {
    setSelectedReception(reception);

    setShowDetailsModal(true);
  };

  // Fonction pour fermer le modal de détails
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedReception(null);
  };

  const handleOpenModal = (reception) => {
    setSelectedReception(reception);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReception(null);
  };

  const handleDelete = async () => {
    if (!selectedReception) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/delete_reception/${selectedReception.id}?user_id=${userId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();

      if (result.status === "deleted") {
        alert("Réception supprimée !");
        setReceptions(receptions.filter((r) => r.id !== selectedReception.id));
        setSortedReceptions(
          sortedReceptions.filter((r) => r.id !== selectedReception.id)
        );
      } else {
        alert("Échec de la suppression.");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la suppression.");
    } finally {
      handleCloseModal();
    }
  };

  const filteredReceptions = sortedReceptions.filter((reception) =>
    reception.vehicule?.immatriculation
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const statutColors = {
    attente: "bg-secondary",
    validee: "bg-primary",
    termine: "bg-success",
  };

  const ordreStatut = ["attente", "validee", "termine"];

  return (
    <Layout>
      <div className="container mt-2">
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            <Loader />
          </div>
        ) : (
          <>
            <SearchBar
              placeholder="Rechercher une réception par immatriculation..."
              onSearch={(query) => setSearchQuery(query)}
              delay={300}
            />

            <HeaderWithFilter
              title="Réceptions"
              link="/add/reception"
              linkText="Ajouter"
              main={receptions.length || null}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={receptions}
              setSortedList={setSortedReceptions}
              dateField="created_at"
            />

            <Table hover responsive className="centered-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fait par</th>
                  <th>Immat.</th>
                  <th>Marque</th>
                  <th>Date d’arrivée</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceptions.length > 0 ? (
                  filteredReceptions
                    .sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )
                    .sort((a, b) => {
                      const statutA = a.statut || "";
                      const statutB = b.statut || "";
                      return (
                        ordreStatut.indexOf(statutA) -
                        ordreStatut.indexOf(statutB)
                      );
                    })
                    .map((reception) => {
                      const isDisabled = reception.statut !== "attente";

                      return (
                        <tr
                          key={reception.id}
                          style={isDisabled ? { opacity: 0.5 } : {}}
                        >
                          <td>{reception.id}</td>
                          <td>
                            {reception.gardien?.first_name}{" "}
                            {reception.gardien?.last_name}
                          </td>
                          <td>{reception.vehicule?.immatriculation || "—"}</td>
                          <td>{reception.vehicule?.marque || "—"}</td>
                          <td>{reception.date_arrivee}</td>
                          <td className="text-center text-uppercase">
                            <span
                              className={`badge ${
                                statutColors[reception.statut] || "bg-dark"
                              } text-white`}
                            >
                              {reception.statut}
                            </span>
                          </td>
                          <td
                            className={`table-operations d-flex justify-content-center`}
                          >
                            <button
                              onClick={() => handleShowDetails(reception)}
                              className="btn btn-info btn-sm me-2"
                              disabled={isDisabled}
                            >
                              <i className="fas fa-eye"></i>
                            </button>

                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleOpenModal(reception)}
                              disabled={isDisabled}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Aucune réception trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}
      </div>

      {/* Modal de détails de la réception */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails de la Réception</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReception && (
            <div className="container">
              <div className="row mb-2">
                <div className="col-6 fw-bold">ID :</div>
                <div className="col-6">REC-{selectedReception.id}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Gardien :</div>
                <div className="col-6">
                  {selectedReception.gardien?.first_name}{" "}
                  {selectedReception.gardien?.last_name}
                </div>
              </div>
              <span>-----------</span>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Immatriculation :</div>
                <div className="col-6">
                  {selectedReception.vehicule?.immatriculation || "—"}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Marque :</div>
                <div className="col-6">
                  {selectedReception.vehicule?.marque || "—"}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Modèle :</div>
                <div className="col-6">
                  {selectedReception.vehicule?.modele || "—"}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Mecanicien :</div>
                <div className="col-6">
                  {selectedReception.vehicule?.mecanicien?.nom || "—"}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Date d’arrivée :</div>
                <div className="col-6">
                  {format(
                    new Date(selectedReception.date_arrivee),
                    "dd/MM/yyyy HH:mm:ss"
                  )}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Motif de la visite :</div>
                <div className="col-6">
                  {selectedReception.motif_visite || "—"}
                </div>
              </div>
              <span>-------------</span>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Statut :</div>
                <div className="col-6 text-uppercase">
                  <span
                    className={`badge ${
                      statutColors[selectedReception.statut] || "bg-dark"
                    } text-white`}
                  >
                    {selectedReception.statut}
                  </span>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Fiche d'entrée :</div>
                <div className="col-6">
                  {selectedReception.vehicule?.fiche_entree_vehicule ? (
                    <Link
                      to={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${selectedReception.vehicule?.fiche_entree_vehicule}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Voir la fiche
                    </Link>
                  ) : (
                    "Non disponible"
                  )}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Date d’ajout :</div>
                <div className="col-6">
                  {format(
                    new Date(selectedReception.created_at),
                    "dd/MM/yyyy HH:mm:ss"
                  )}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Dernière mise à jour :</div>
                <div className="col-6">
                  {selectedReception.updated_at === selectedReception.created_at
                    ? "-"
                    : format(
                        new Date(selectedReception.updated_at),
                        "dd/MM/yyyy HH:mm:ss"
                      )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmPopup
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={
          <p>
            Voulez-vous vraiment supprimer la réception{" "}
            <strong>
              {selectedReception?.vehicule?.immatriculation || "Inconnue"}
            </strong>{" "}
            ?
          </p>
        }
      />
    </Layout>
  );
};

export default Receptions;
