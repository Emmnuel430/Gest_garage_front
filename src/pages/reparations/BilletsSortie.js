import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import SearchBar from "../../components/Layout/SearchBar";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import { Button, Modal, Table } from "react-bootstrap";
import moment from "moment";
import { format } from "date-fns";

const BilletsSortie = () => {
  const [billetsSortie, setBilletsSortie] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBilletSortie, setSelectedBilletSortie] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [sortedBilletsSortie, setSortedBilletsSortie] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleShowDetails = (billetSortie) => {
    setSelectedBilletSortie(billetSortie);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedBilletSortie(null);
  };

  const fetchBilletsSortie = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/liste_billet_sortie`
      );
      const data = await response.json();
      setBilletsSortie(data || []);
      setSortedBilletsSortie(data || []);
    } catch (error) {
      setError("Erreur lors du chargement des billets de sortie.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilletsSortie();
  }, []);

  const filteredBilletsSortie = sortedBilletsSortie.filter((billet) =>
    billet.reception.vehicule?.immatriculation
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  function formatRole(role) {
    if (!role) return "";
    return role
      .split("_") // coupe par "_"
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // met en majuscule la première lettre
      .join(" "); // re-colle avec des espaces
  }

  const formatDuration = (minutes) => {
    const days = Math.floor(minutes / 1440); // 1440 min = 1 jour
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = minutes % 60;

    const parts = [];
    if (days) parts.push(`${days} j`);
    if (hours) parts.push(`${hours} h`);
    if (mins || parts.length === 0) parts.push(`${mins} min`);

    return parts.join(" ");
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
              placeholder="Rechercher un billet par immatriculation..."
              onSearch={(query) => setSearchQuery(query)}
              delay={300}
            />

            <HeaderWithFilter
              title2="Billets de sortie"
              main={billetsSortie.length || null}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={billetsSortie}
              setSortedList={setSortedBilletsSortie}
              dateField="created_at"
            />
            <div className="table-responsive">
              <Table hover responsive className="centered-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Immat.</th>
                    <th>Client</th>
                    <th>Marque / Modèle</th>
                    <th>Chef d’atelier</th>
                    <th>Début</th>
                    <th>Fin</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBilletsSortie.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        Aucun billet de sortie trouvé.
                      </td>
                    </tr>
                  ) : (
                    filteredBilletsSortie.map((billet) => (
                      <tr key={billet.id}>
                        <td>{billet.id}</td>
                        <td>{billet.reception.vehicule.immatriculation}</td>
                        <td>{billet.reception.vehicule.client_nom}</td>
                        <td>
                          <strong>{billet.reception.vehicule.marque}</strong>{" "}
                          {billet.reception.vehicule.modele}
                        </td>
                        <td>
                          {billet.chef_atelier.first_name}{" "}
                          {billet.chef_atelier.last_name}
                        </td>
                        <td>
                          {moment(billet.reception.chrono.start_time).format(
                            "DD/MM/YY HH:mm:ss"
                          )}
                        </td>
                        <td>
                          {moment(billet.reception.chrono.end_time).format(
                            "DD/MM/YY HH:mm:ss"
                          )}
                        </td>
                        <td>
                          <Button
                            variant="info"
                            onClick={() => handleShowDetails(billet)}
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
            </div>
          </>
        )}
      </div>

      {/* Modal de détails */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails du billet de sortie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBilletSortie && (
            <div>
              <p>
                <strong>Immat. :</strong>{" "}
                {selectedBilletSortie.reception.vehicule.immatriculation}
              </p>
              <p>
                <strong>Client :</strong>{" "}
                {selectedBilletSortie.reception.vehicule.client_nom} (
                {selectedBilletSortie.reception.vehicule.client_tel})
              </p>
              <p>
                <strong>Véhicule :</strong>{" "}
                <span className="italic">
                  <strong>
                    {selectedBilletSortie.reception.vehicule.marque}
                  </strong>{" "}
                  {selectedBilletSortie.reception.vehicule.modele}
                </span>
              </p>
              <p>
                <strong>Chef d’atelier :</strong>{" "}
                {selectedBilletSortie.chef_atelier.first_name}{" "}
                {selectedBilletSortie.chef_atelier.last_name} (
                {formatRole(selectedBilletSortie.chef_atelier.role)})
              </p>
              <p>
                <strong>Mécanicien :</strong>{" "}
                {selectedBilletSortie.reception.vehicule.mecanicien.prenom}{" "}
                {selectedBilletSortie.reception.vehicule.mecanicien.nom}
              </p>
              <p>
                <strong>Date arrivée :</strong>{" "}
                {format(
                  new Date(selectedBilletSortie.reception.date_arrivee),
                  "dd/MM/yyyy HH:mm:ss"
                )}
              </p>
              <p>
                <strong>Début réparation :</strong>{" "}
                {format(
                  new Date(selectedBilletSortie.reception.chrono.start_time),
                  "dd/MM/yyyy HH:mm:ss"
                )}
              </p>
              <p>
                <strong>Fin réparation :</strong>{" "}
                {format(
                  new Date(selectedBilletSortie.reception.chrono.end_time),
                  "dd/MM/yyyy HH:mm:ss"
                )}
              </p>
              <p>
                <strong>Durée de réparation :</strong>{" "}
                {formatDuration(
                  selectedBilletSortie.reception.chrono.duree_total
                )}
              </p>
              <p>
                <strong>Fiche de sortie :</strong>{" "}
                <a
                  href={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${selectedBilletSortie.fiche_sortie_vehicule}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  Voir le PDF
                </a>
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default BilletsSortie;
