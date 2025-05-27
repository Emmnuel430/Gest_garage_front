import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import { Card, Button, Table } from "react-bootstrap";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import moment from "moment";
import "moment-duration-format";

const Chronos = () => {
  // const [chronos, setChronos] = useState([]);
  const [allChronos, setAllChronos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const chronosPerPage = 10;
  const [chronosEnCours, setChronosEnCours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReception, setSelectedReception] = useState(null);

  const handleCloseModal = () => setShowModal(false);
  const handleOpenModal = (chrono) => {
    setSelectedReception(chrono.reception);
    setShowModal(true);
  };

  const handleDelete = () => {
    if (selectedReception?.id) {
      handleStopChrono(selectedReception.id);
    }
    setShowModal(false);
  };

  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const userId = userInfo?.id;

  // Actualiser l'heure locale toutes les secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchChronos = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/liste_chronos`
        );
        const data = await response.json();
        // setChronos(data || []);
        setAllChronos(data || []);
        setChronosEnCours(data.filter((chrono) => !chrono.end_time));
      } catch (err) {
        setError("Erreur lors du chargement des chronos.");
      } finally {
        setLoading(false);
      }
    };

    fetchChronos();
  }, []);

  const filteredChronos = allChronos.filter((chrono) =>
    chrono.reception?.vehicule?.immatriculation
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredChronos.length / chronosPerPage);
  const startIndex = (currentPage - 1) * chronosPerPage;
  const currentChronos = filteredChronos.slice(
    startIndex,
    startIndex + chronosPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleStopChrono = async (chronoId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/stop_chrono/${chronoId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        }
      );
      const result = await response.json();
      alert(result.message);

      setAllChronos((prev) =>
        prev.map((c) =>
          c.id === chronoId ? { ...c, end_time: new Date().toISOString() } : c
        )
      );
    } catch (err) {
      alert("Erreur lors de l'arrêt du chrono.");
    }
  };

  // Fonction pour calculer le temps écoulé
  const renderElapsedTime = (start, end) => {
    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : currentTime;
    const duration = Math.floor((endTime - startTime) / 1000);

    const hours = String(Math.floor(duration / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((duration % 3600) / 60)).padStart(2, "0");
    const seconds = String(duration % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  const formatMinutesToHHMM = (minutes) => {
    const hrs = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mins = String(minutes % 60).padStart(2, "0");
    return `${hrs}h ${mins}min`;
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="mb-4">Chronos en cours</h2>
        <h5>Total : ({chronosEnCours.length || 0})</h5>
        <br />

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : chronosEnCours.length === 0 ? (
          <div className="text-center">Aucun chrono en cours.</div>
        ) : (
          <div className="row justify-content-center">
            {chronosEnCours
              .filter((c) => !c.end_time)
              .map((chrono) => (
                <div className="col-lg-4 col-md-6 mb-4" key={chrono.id}>
                  <Card className="shadow-sm h-100 d-flex flex-column align-items-center">
                    <Card.Body className="d-flex flex-column justify-content-between align-items-center text-center">
                      <div>
                        <Card.Title>
                          Immat. :{" "}
                          <strong>
                            {chrono.reception.vehicule.immatriculation}
                          </strong>{" "}
                          <br />
                          <span className="italic">
                            <strong>{chrono.reception.vehicule.marque}</strong>{" "}
                            {chrono.reception.vehicule.modele}
                          </span>
                        </Card.Title>
                        <Card.Text>
                          Démarré le <br />
                          {moment(chrono.start_time).format(
                            "DD/MM/YYYY à HH:mm:ss"
                          )}
                        </Card.Text>
                        <Card.Text>
                          Temps écoulé <br />
                          <span className="text-primary fw-bold">
                            {renderElapsedTime(
                              chrono.start_time,
                              chrono.end_time
                            )}
                          </span>
                        </Card.Text>
                      </div>
                      <div className="mt-3">
                        <Button
                          variant="danger"
                          onClick={() => handleOpenModal(chrono)}
                        >
                          Arrêter
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
          </div>
        )}
      </div>

      <ConfirmPopup
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Confirmer l'arrêt"
        body={
          <p>
            Voulez-vous vraiment arreter le chrono de{" "}
            <strong>
              {selectedReception?.vehicule?.immatriculation || "Inconnue"}
            </strong>{" "}
            ?
          </p>
        }
      />

      {/* Tableau des chronos */}
      <div className="mt-5">
        <SearchBar
          placeholder="Rechercher un chrono par immatriculation..."
          onSearch={(query) => {
            setSearchQuery(query);
            setCurrentPage(1); // Revenir à la 1ère page après une recherche
          }}
          delay={300}
        />
        <br />
        <h4>Liste complète des chronos</h4>
        <div className="table-responsive">
          <Table hover responsive className="centered-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Immat.</th>
                <th>Marque</th>
                <th>Modèle</th>
                <th>Date de début</th>
                <th>Date de fin</th>
                <th>Temps écoulé</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {currentChronos.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    Aucun chrono trouvé.
                  </td>
                </tr>
              ) : (
                currentChronos
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  )
                  .map((chrono) => {
                    const isEnCours = !chrono.end_time;
                    return (
                      <tr key={chrono.id}>
                        <td>{chrono.id}</td>
                        <td>{chrono.reception.vehicule.immatriculation}</td>
                        <td>{chrono.reception.vehicule.marque}</td>
                        <td>{chrono.reception.vehicule.modele}</td>
                        <td>
                          {moment(chrono.start_time).format(
                            "DD/MM/YYYY HH:mm:ss"
                          )}
                        </td>
                        <td>
                          {chrono.end_time
                            ? moment(chrono.end_time).format(
                                "DD/MM/YYYY HH:mm:ss"
                              )
                            : "-"}
                        </td>
                        <td>
                          {chrono.end_time
                            ? formatMinutesToHHMM(chrono.duree_total)
                            : "⏳"}
                        </td>
                        <td className="text-center">
                          {isEnCours ? (
                            <span className="badge bg-warning text-dark">
                              En cours
                            </span>
                          ) : (
                            <span className="badge bg-success">Terminé</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </Table>
          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center">
              {/* Précédent */}
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
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
      </div>
      {/* Fin du tableau des chronos */}
    </Layout>
  );
};

export default Chronos;
