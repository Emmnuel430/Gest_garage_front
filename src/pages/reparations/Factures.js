import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import SearchBar from "../../components/Layout/SearchBar";
import moment from "moment";
import { format } from "date-fns";
import { fetchWithToken } from "../../utils/fetchWithToken";

const Factures = () => {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [sortedFactures, setSortedFactures] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const userId = userInfo?.id;

  const handleShowDetails = (facture) => {
    setSelectedFacture(facture);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedFacture(null);
  };

  const handleOpenModal = (facture) => {
    setSelectedFacture(facture);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowConfirmModal = (facture) => {
    setSelectedFacture(facture);
    setShowConfirmModal(true);
  };

  const handleConfirmGeneration = () => {
    handleGenererFacture(selectedFacture.id);
    setShowConfirmModal(false);
  };

  const fetchFactures = async () => {
    setLoading(true);
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/liste_factures`
      );
      const data = await response.json();
      setFactures(data || []);
    } catch (error) {
      setError("Erreur lors du chargement des factures.");
    } finally {
      setLoading(false);
    }
  };

  const handleValiderPaiement = async (factureId) => {
    if (!selectedFacture.reception?.id) return;
    setLoading(true);

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/valider_paiement/${selectedFacture.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
          }),
        }
      );

      const result = await response.json();
      alert(result.message);
      setShowModal(false);
      setLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      alert("Erreur lors de la validation : " + error);
      setLoading(false);
    }
  };

  const handleGenererFacture = async (factureId) => {
    setLoading(true);
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/generer_facture/${factureId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Échec de la génération de la facture");
      }

      const result = await response.json();
      alert(result.message);
      setShowModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      alert("Erreur lors de la validation : " + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactures();
  }, []);

  const filteredFactures = sortedFactures.filter((facture) =>
    facture.reception?.vehicule?.immatriculation
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const ordreStatut = ["en_attente", "payee"];

  const formatMinutesToDDHHMM = (minutes) => {
    const jours = Math.floor(minutes / (60 * 24));
    const hrs = Math.floor((minutes % (60 * 24)) / 60);
    const mins = minutes % 60;

    const joursStr = jours > 0 ? `${jours}j ` : "";
    const hrsStr = hrs > 0 ? `${hrs}h ` : "";
    const minsStr = `${mins}min`;

    return `${joursStr}${hrsStr}${minsStr}`.trim();
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
            <SearchBar
              placeholder="Rechercher une facture par immatriculation..."
              onSearch={(query) => setSearchQuery(query)}
              delay={300}
            />
            <HeaderWithFilter
              title2="Factures"
              main={factures.length || null}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={factures}
              setSortedList={setSortedFactures}
              dateField="created_at"
            />
            <Table hover responsive className="centered-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Actions</th>
                  <th>Immat.</th>
                  <th>Vehicule</th>
                  <th>Client</th>
                  <th>Statut</th>
                  <th>Date de génération</th>
                  <th>Générer</th>
                </tr>
              </thead>
              <tbody>
                {filteredFactures.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Aucune facture trouvée.
                    </td>
                  </tr>
                ) : (
                  filteredFactures
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

                    .map((facture) => (
                      <tr key={facture.id}>
                        <td>{facture.id}</td>
                        <td className="d-flex gap-2 justify-content-center">
                          <Button
                            variant="info"
                            onClick={() => handleShowDetails(facture)}
                            className="btn-sm"
                          >
                            <i className="fa fa-eye"></i>
                          </Button>
                          {facture.statut === "generee" && (
                            <Button
                              variant="success-outline"
                              onClick={() => handleOpenModal(facture)}
                              className="btn-sm border-success hover"
                            >
                              <i className="fa fa-check"></i>
                            </Button>
                          )}
                        </td>
                        <td>{facture.reception?.vehicule?.immatriculation}</td>
                        <td>
                          <strong>{facture.reception?.vehicule?.marque}</strong>{" "}
                          - <em>{facture.reception?.vehicule?.modele}</em>
                        </td>
                        <td>{facture.reception?.vehicule?.client_nom}</td>
                        <td>
                          <span
                            className={`badge ${
                              facture.statut === "payee"
                                ? "bg-success"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {facture.statut === "payee" ? "Payée" : "Non payée"}
                          </span>
                        </td>
                        <td>
                          {facture.date_generation
                            ? moment(facture.date_generation).format(
                                "DD/MM/YY HH:mm:ss"
                              )
                            : "-"}
                        </td>
                        <td>
                          {facture.statut === "en_attente" ? (
                            <Button
                              variant="primary"
                              className="btn-sm"
                              onClick={() => handleShowConfirmModal(facture)}
                            >
                              <i className="fa fa-file-invoice"></i>
                            </Button>
                          ) : (
                            "✅"
                          )}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </Table>
          </>
        )}
      </div>

      {/* Modal de détails */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails de la facture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFacture && (
            <div>
              <p>
                <strong>Immatriculation :</strong>{" "}
                {selectedFacture.reception.vehicule.immatriculation || "N/A"}
              </p>
              <p>
                <strong>Client :</strong>{" "}
                {selectedFacture.reception.vehicule.client_nom || "N/A"} (
                {selectedFacture.reception.vehicule.client_tel || "N/A"})
              </p>
              <p>
                <strong>Véhicule :</strong>{" "}
                {selectedFacture.reception.vehicule.marque || "N/A"}{" "}
                {selectedFacture.reception.vehicule.modele || "N/A"}
              </p>
              <p>
                <strong>Mécanicien :</strong>{" "}
                {selectedFacture.reception.vehicule.mecanicien.prenom || "N/A"}{" "}
                {selectedFacture.reception.vehicule.mecanicien.nom || "N/A"}
              </p>
              <p>
                <strong>Date arrivée :</strong>{" "}
                {format(
                  new Date(selectedFacture.reception.date_arrivee),
                  "dd/MM/yyyy HH:mm:ss"
                ) || "N/A"}
              </p>
              <p>
                <strong>Début réparation :</strong>{" "}
                {format(
                  new Date(selectedFacture.reception.reparation.created_at),
                  "dd/MM/yyyy HH:mm:ss"
                ) || "N/A"}
              </p>
              <p>
                <strong>Fin réparation :</strong>{" "}
                {format(
                  new Date(selectedFacture.reception.reparation.updated_at),
                  "dd/MM/yyyy HH:mm:ss"
                ) || "N/A"}
              </p>

              {selectedFacture.date_generation ? (
                <>
                  <p>
                    <strong>Durée au garage :</strong>{" "}
                    {formatMinutesToDDHHMM(
                      selectedFacture.reception.chrono.duree_total
                    ) || "N/A"}
                  </p>
                  <p>
                    <strong>Montant :</strong>{" "}
                    {selectedFacture.montant || "N/A"} FCFA
                  </p>
                  <p>
                    <strong>Reçu PDF :</strong>{" "}
                    <a
                      href={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${selectedFacture.recu}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm"
                    >
                      Voir le PDF
                    </a>
                  </p>
                </>
              ) : (
                ""
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Confimer le paiement */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confimer le paiement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFacture && (
            <div>
              <p>
                Confimer le paiement de la facture pour le véhicule <br />
                <strong>
                  {selectedFacture.reception.vehicule.immatriculation}
                </strong>{" "}
                pour le montant de{" "}
                <strong>{selectedFacture.montant} FCFA</strong>?
                <br />
                <span>---------</span>
                <br />
                Motif de la visite :{" "}
                <strong>
                  {selectedFacture.reception.motif_visite || "Non spécifié"}
                </strong>
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Annuler
          </button>
          <button
            className="btn btn-success"
            onClick={handleValiderPaiement}
            disabled={loading}
          >
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin"></i> Chargement...
              </span>
            ) : (
              <span>Terminer</span>
            )}
          </button>
        </Modal.Footer>
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
        <Modal.Body>Voulez-vous générer cette facture ?</Modal.Body>
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

export default Factures;
