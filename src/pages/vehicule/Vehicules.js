import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import { Button, Modal, Table, Container, Row, Col } from "react-bootstrap";
import { format } from "date-fns";
import moment from "moment";

const Vehicule = () => {
  //   const [vehicules, setVehicules] = useState([]);
  const [allVehicules, setAllVehicules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const vehiculesPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const userId = userInfo?.id;

  const handleShowConfirmModal = (vehicule) => {
    setSelectedVehicule(vehicule);
    setShowConfirmModal(true);
  };

  const handleConfirmGeneration = () => {
    handleGenererBillet(selectedVehicule?.receptions?.[0]?.id);
  };

  const handleGenererBillet = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/generer_billet/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Échec de la génération du billet");
      }

      const result = await response.json();
      alert(result.message);
      setShowConfirmModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      alert("Erreur lors de la validation : " + error);
    } finally {
      setLoading(false); // Fin du traitement
    }
  };

  const fetchVehicules = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/liste_vehicules`
      );
      const data = await response.json();
      //   setVehicules(data || []);
      setAllVehicules(data || []);
    } catch (err) {
      setError("Erreur lors du chargement des véhicules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicules();
  }, []);

  // Pagination
  const totalPages = Math.ceil(allVehicules.length / vehiculesPerPage);
  const startIndex = (currentPage - 1) * vehiculesPerPage;
  const currentVehicules = allVehicules.slice(
    startIndex,
    startIndex + vehiculesPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleShowDetails = (vehicule) => {
    setSelectedVehicule(vehicule);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setSelectedVehicule(null);
    setShowDetailsModal(false);
  };

  return (
    <Layout>
      <div className="container mt-4">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            <Loader />
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <HeaderWithFilter
              title="Véhicules"
              main={allVehicules.length || null}
            />
            <div className="table-responsive">
              <Table hover responsive className="centered-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>#</th>
                    <th>Immatriculation.</th>
                    <th>Client</th>
                    <th>Marque / Modèle</th>
                    <th>Mécanicien</th>
                    <th>Billet de sortie</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVehicules.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Aucun véhicule trouvé.
                      </td>
                    </tr>
                  ) : (
                    currentVehicules
                      .sort(
                        (a, b) =>
                          new Date(b.created_at) - new Date(a.created_at)
                      )
                      .map((vehicule) => (
                        <tr key={vehicule.id}>
                          <td>
                            <Button
                              variant="info"
                              className="btn-sm"
                              onClick={() => handleShowDetails(vehicule)}
                            >
                              <i className="fa fa-eye"></i>
                            </Button>
                          </td>
                          <td>{vehicule.id || "-"}</td>
                          <td>{vehicule.immatriculation || "-"}</td>
                          <td>{vehicule.client_nom || "-"}</td>
                          <td>
                            <strong>{vehicule.marque || "N/A"}</strong>{" "}
                            {vehicule.modele || "N/A"}
                          </td>
                          <td>
                            {vehicule.mecanicien?.prenom || "N/A"}{" "}
                            {vehicule.mecanicien?.nom || "N/A"}
                          </td>
                          <td className="d-flex justify-content-center">
                            {vehicule.receptions.length > 0 ? (
                              (() => {
                                const reception = vehicule.receptions[0];
                                const facture = reception.facture;
                                const billetSortie = reception.billet_sortie;

                                if (facture?.statut === "payee") {
                                  if (billetSortie !== null) {
                                    return (
                                      <span className="text-success d-flex align-items-center gap-1 btn btn-sm">
                                        <i className="fa fa-check-circle" />{" "}
                                        Billet généré
                                      </span>
                                    );
                                  } else {
                                    return (
                                      <Button
                                        variant="primary"
                                        className="btn-sm d-flex align-items-center gap-1"
                                        onClick={() =>
                                          handleShowConfirmModal(vehicule)
                                        }
                                      >
                                        <i className="fa fa-file-invoice" />{" "}
                                        Générer billet
                                      </Button>
                                    );
                                  }
                                } else {
                                  return (
                                    <span className="text-muted fst-italic  btn btn-sm">
                                      Facture non réglée
                                    </span>
                                  );
                                }
                              })()
                            ) : (
                              <span className="text-muted">
                                Aucune réception
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </Table>

              {/* Pagination */}
              <nav>
                <ul className="pagination justify-content-center">
                  {/* Précédent */}
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Précédent
                    </button>
                  </li>

                  {/* Pages */}
                  {[...Array(totalPages).keys()].map((_, index) => {
                    const page = index + 1;
                    return (
                      <li
                        key={page}
                        className={`page-item ${
                          currentPage === page ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    );
                  })}

                  {/* Suivant */}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Suivant
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>

      <Modal
        show={showDetailsModal}
        onHide={handleCloseModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Détails du véhicule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVehicule && (
            <Container fluid>
              <Row>
                <Col md={6}>
                  <h5>Informations véhicule</h5>
                  <p>
                    <strong>Immatriculation :</strong>{" "}
                    {selectedVehicule.immatriculation}
                  </p>
                  <p>
                    <strong>Client :</strong>{" "}
                    {selectedVehicule.client_nom || "N/A"} (
                    {selectedVehicule.client_tel || "N/A"})
                  </p>
                  <p>
                    <strong>Marque / Modèle :</strong>{" "}
                    <strong>{selectedVehicule.marque}</strong>{" "}
                    {selectedVehicule.modele}
                  </p>
                  <p>
                    <strong>Fiche d’entrée :</strong>{" "}
                    <a
                      href={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${selectedVehicule.fiche_entree_vehicule}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      Voir le PDF
                    </a>
                  </p>
                </Col>

                <Col md={6}>
                  <h5>Mécanicien</h5>
                  <p>
                    <strong>Nom :</strong> {selectedVehicule.mecanicien.prenom}{" "}
                    {selectedVehicule.mecanicien.nom}
                  </p>
                  <p>
                    <strong>Type :</strong> {selectedVehicule.mecanicien.type}
                  </p>
                  <p>
                    <strong>Contact :</strong>{" "}
                    {selectedVehicule.mecanicien.contact}
                  </p>
                </Col>
              </Row>

              <hr />
              <h5>Historique des Réceptions</h5>
              {selectedVehicule.receptions.map((r) => (
                <div
                  key={r.id}
                  className="mb-4 border p-3 rounded shadow-sm bg-body"
                >
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Date d’arrivée :</strong>{" "}
                        {format(new Date(r.date_arrivee), "dd/MM/yyyy HH:mm")}
                      </p>
                      <p>
                        <strong>Motif :</strong> {r.motif_visite}
                      </p>
                      <p>
                        <strong>Fiche réception :</strong>{" "}
                        <a
                          href={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${r.fiche_reception_vehicule}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-secondary"
                        >
                          Voir le PDF
                        </a>
                      </p>
                    </Col>

                    <Col md={6}>
                      {r.reparation && (
                        <p>
                          <strong>Réparation :</strong>{" "}
                          <span
                            className={`badge ${
                              r.reparation.statut === "termine"
                                ? "bg-success"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {r.reparation.statut === "termine"
                              ? "Terminé"
                              : "En cours"}
                          </span>
                        </p>
                      )}

                      {r.facture?.date_generation && (
                        <>
                          <p>
                            <strong>Montant :</strong> {r.facture.montant} FCFA
                          </p>
                          <p>
                            <strong>Date paiement :</strong>{" "}
                            {r.facture.date_paiement
                              ? moment(r.facture.date_paiement).format(
                                  "DD/MM/YYYY HH:mm"
                                )
                              : "N/A"}
                          </p>
                          <p>
                            <strong>Reçu :</strong>{" "}
                            <a
                              href={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${r.facture.recu}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-success"
                            >
                              Voir le reçu
                            </a>
                          </p>
                        </>
                      )}

                      {r.billet_sortie && (
                        <p>
                          <strong>Billet de sortie :</strong>{" "}
                          <a
                            href={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${r.billet_sortie.fiche_sortie_vehicule}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-success"
                          >
                            Voir le billet
                          </a>
                        </p>
                      )}
                    </Col>
                  </Row>
                </div>
              ))}
            </Container>
          )}
        </Modal.Body>
      </Modal>

      {/* Generer */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVehicule ? (
            <>
              Voulez-vous générer le billet de sortie de{" "}
              <strong>{selectedVehicule.immatriculation}</strong> ?
            </>
          ) : (
            <>Chargement du véhicule...</>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmGeneration}
            disabled={loading}
          >
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin"></i> Chargement...
              </span>
            ) : (
              <span>Générer</span>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default Vehicule;
