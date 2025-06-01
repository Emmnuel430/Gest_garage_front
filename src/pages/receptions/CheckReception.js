import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import Check from "./Check";
import { Modal } from "react-bootstrap";
import { format } from "date-fns";

const CheckReception = () => {
  const [receptions, setReceptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false); // Contrôle de l'affichage du modal de détails
  const [selectedReception, setSelectedReception] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [sortedReceptions, setSortedReceptions] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [receptionToUpdate, setReceptionToUpdate] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const userId = userInfo ? userInfo.id : null;
  const userRole = userInfo ? userInfo.role : null;

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

  // -------------------
  const handleOpenUpdateModal = (reception) => {
    setReceptionToUpdate(reception);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setReceptionToUpdate(null);
  };

  const handleUpdateReception = async (updatedReception) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/check/${updatedReception.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...updatedReception,
            user_id: userId,
          }),
        }
      );

      if (!response.ok) throw new Error("Échec de la mise à jour");

      alert("Réception mise à jour avec succès.");
      handleCloseUpdateModal();
      // Attendre ≈1 seconde puis recharger la page
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      alert("Erreur lors de la mise à jour.");
    }
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

  const statutColors = {
    attente: "bg-secondary",
    validee: "bg-primary",
    termine: "bg-success",
  };

  const statutLabel = {
    attente: (
      <>
        En attente <br /> de validation
      </>
    ),
    validee: "Réception validée",
    termine: "Terminé",
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
            <HeaderWithFilter
              title2="Validations"
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
                {sortedReceptions.length > 0 ? (
                  sortedReceptions
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
                      // Désactivé seulement si l’utilisateur n’est pas super_admin ET statut est "termine"
                      const isDisabled =
                        userRole !== "super_admin" &&
                        reception.statut === "termine";

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
                              {statutLabel[reception.statut]}
                            </span>
                          </td>
                          <td className="table-operations d-flex justify-content-center">
                            <button
                              onClick={() => handleShowDetails(reception)}
                              className="btn btn-info btn-sm me-2"
                              disabled={isDisabled}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <Button
                              variant="warning"
                              size="sm"
                              disabled={isDisabled}
                              onClick={() => handleOpenUpdateModal(reception)}
                              className=" me-2"
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </Button>

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
                      Aucune réception en attente trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}
      </div>

      {/* Modal de détails de la réception */}
      <Modal
        show={showDetailsModal}
        onHide={handleCloseDetailsModal}
        centered
        size="lg"
      >
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
                    {statutLabel[selectedReception.statut]}
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
                      className="btn btn-outline-primary btn-sm"
                    >
                      Voir la fiche
                    </Link>
                  ) : (
                    "Non disponible"
                  )}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Fiche de réception :</div>
                <div className="col-6">
                  {selectedReception.fiche_reception_vehicule ? (
                    <Link
                      to={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${selectedReception.fiche_reception_vehicule}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm"
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

      {/* Modal de mise à jour */}
      <Modal
        show={showUpdateModal}
        onHide={handleCloseUpdateModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Check-in du véhicule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showUpdateModal && receptionToUpdate && (
            <>
              <div className="">
                <h6>
                  Immatriculation :{" "}
                  {receptionToUpdate.vehicule?.immatriculation || "Inconnue"}
                </h6>
                <h6>
                  Marque : {receptionToUpdate.vehicule?.marque || "Inconnue"}
                </h6>
                <h6>
                  Modèle : {receptionToUpdate.vehicule?.modele || "Inconnue"}
                </h6>
              </div>
              <span>-------------</span>
              <Check
                reception={receptionToUpdate}
                onClose={handleCloseUpdateModal}
                onUpdate={handleUpdateReception}
              />
            </>
          )}
        </Modal.Body>
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

export default CheckReception;
