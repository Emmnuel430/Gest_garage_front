import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import { Card, Button, Modal, Table } from "react-bootstrap";
import SearchBar from "../../components/Layout/SearchBar";
import { fetchWithToken } from "../../utils/fetchWithToken";
import moment from "moment";
import { format } from "date-fns";

const Reparations = () => {
  // const [reparations, setReparations] = useState([]);
  const [allReparations, setAllReparations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reparationsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedReparation, setSelectedReparation] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const userId = userInfo?.id;

  const handleOpenModal = (reparation) => {
    setSelectedReparation(reparation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Fonction pour ouvrir le modal de détails d'une réparation
  const handleShowDetails = (reparation) => {
    setSelectedReparation(reparation);
    setShowDetailsModal(true);
  };

  // Fonction pour fermer le modal de détails
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedReparation(null);
  };

  const fetchReparations = async () => {
    setLoading(true);
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/liste_reparations`
      );
      const data = await response.json();
      // const sorted = (data || []).sort(
      //   (a, b) => new Date(b.created_at) - new Date(a.created_at)
      // );
      setAllReparations(data || []);
      // setAllReparations(sorted || []);
    } catch (error) {
      setError("Erreur lors du chargement des réparations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReparations();
  }, []);

  const filteredReparations = allReparations.filter((reparation) =>
    reparation.reception?.vehicule?.immatriculation
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredReparations.length / reparationsPerPage);
  const startIndex = (currentPage - 1) * reparationsPerPage;
  const currentReparations = filteredReparations.slice(
    startIndex,
    startIndex + reparationsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleTerminerReparation = async () => {
    if (!selectedReparation.reception?.id) return;
    setLoading(true);

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/terminer/${selectedReparation.reception.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      const result = await response.json();
      alert(result.message);
      setLoading(false);
      setShowModal(false);
      // Attendre ≈1 seconde puis recharger la page
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      alert("Erreur lors de la terminaison.");
    }
  };

  const reparationsEnCours = allReparations.filter(
    (r) => r.statut !== "termine"
  );

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Réparations en cours</h2>
        <h5>Total : {reparationsEnCours.length}</h5>
        <br />

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="row justify-content-center">
            {reparationsEnCours.length === 0 ? (
              <div className="text-center">Aucune réparation en cours.</div>
            ) : (
              reparationsEnCours.map((rep) => (
                <div className="col-lg-4 col-md-6 mb-4" key={rep.id}>
                  <Card className="shadow-sm d-flex flex-column align-items-center">
                    <Card.Body className="d-flex flex-column justify-content-between align-items-center text-center">
                      <Card.Title>
                        <span className="text-muted fs-5">Immat. </span>
                        <br />
                        <strong>
                          {rep.reception.vehicule.immatriculation}
                        </strong>{" "}
                        <br />
                        <span className="text-muted fs-5">Vehicule </span>
                        <br />
                        <span className="italic">
                          <strong>{rep.reception.vehicule.marque}</strong>{" "}
                          {rep.reception.vehicule.modele}
                        </span>
                      </Card.Title>
                      <Card.Text>
                        Début :{" "}
                        {format(new Date(rep.created_at), "dd/MM/yyyy à HH:mm")}
                      </Card.Text>
                      <Card.Text>
                        Mécanicien : <br />
                        {rep.reception.vehicule.mecanicien.nom || ""}{" "}
                        {rep.reception.vehicule.mecanicien.prenom || ""}
                      </Card.Text>
                      <Button
                        variant="success"
                        onClick={() => handleOpenModal(rep)}
                      >
                        Terminer
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Tableau des réparations */}
      <div className="mt-5">
        <SearchBar
          placeholder="Rechercher une reparation par immatriculation..."
          onSearch={(query) => {
            setSearchQuery(query);
            setCurrentPage(1); // Revenir à la 1ère page après une recherche
          }}
          delay={300}
        />
        <h4>Historique des réparations</h4>
        <Table hover responsive className="centered-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Immatriculation</th>
              <th>Vehivlue</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReparations.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Aucune réparation trouvée.
                </td>
              </tr>
            ) : (
              currentReparations
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((rep) => (
                  <tr key={rep.id}>
                    <td>{rep.id}</td>
                    <td>{rep.reception.vehicule.immatriculation}</td>
                    <td>
                      <strong>{rep.reception.vehicule.marque}</strong> -{" "}
                      {rep.reception.vehicule.modele}
                    </td>
                    <td>
                      {moment(rep.reception.chrono.start_time).format(
                        "DD/MM/YY HH:mm:ss"
                      )}
                    </td>
                    <td>
                      {rep.created_at === rep.updated_at
                        ? "En cours ..."
                        : moment(rep.updated_at).format("DD/MM/YY HH:mm:ss")}
                    </td>
                    <td>
                      {rep.statut === "termine" ? (
                        <span className="badge bg-success">Terminée</span>
                      ) : (
                        <span className="badge bg-warning text-dark">
                          En cours
                        </span>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="info"
                        onClick={() => handleShowDetails(rep)}
                        className="btn-sm"
                      >
                        <i className="fa fa-eye"></i>
                      </Button>
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
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
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

      {/* Modal de détails */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails de la réparation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReparation && (
            <div>
              <p>
                <strong>Immatriculation :</strong>{" "}
                {selectedReparation.reception.vehicule.immatriculation}
              </p>
              <p>
                <strong>Véhicule :</strong>
                {""}
                <span className="italic">
                  <strong>
                    {selectedReparation.reception.vehicule.marque}
                  </strong>{" "}
                  {selectedReparation.reception.vehicule.modele}
                </span>
              </p>
              <p>
                <strong>Motif :</strong>{" "}
                {selectedReparation.reception.motif_visite}
              </p>
              <p>
                <strong>Début :</strong>{" "}
                {format(
                  new Date(selectedReparation.created_at),
                  "dd/MM/yyyy HH:mm:ss"
                )}
              </p>
              <p>
                <strong>Fin :</strong>{" "}
                {selectedReparation.created_at === selectedReparation.updated_at
                  ? "-"
                  : format(
                      new Date(selectedReparation.updated_at),
                      "dd/MM/yyyy HH:mm:ss"
                    )}
              </p>
              <p>
                <strong>Statut :</strong>{" "}
                {selectedReparation.statut === "termine" ? (
                  <span className="badge bg-success">Terminée</span>
                ) : (
                  <span className="badge bg-warning text-dark">En cours</span>
                )}
              </p>
              <p>
                <strong>Mécanicien :</strong>{" "}
                {selectedReparation.reception.vehicule.mecanicien.nom}{" "}
                {selectedReparation.reception.vehicule.mecanicien.prenom}
              </p>
              <p></p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal de confirmation */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Terminer la réparation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReparation && (
            <div>
              <p>
                Voulez-vous vraiment terminer la réparation du véhicule{" "}
                <strong>
                  {selectedReparation.reception.vehicule.immatriculation}
                </strong>
                ?
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
            onClick={handleTerminerReparation}
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
    </Layout>
  );
};

export default Reparations;
