import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import { Card, Button, Modal } from "react-bootstrap";
import SearchBar from "../../components/Layout/SearchBar";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Pagination from "../../components/Layout/Pagination";
import { fetchWithToken } from "../../utils/fetchWithToken";
import moment from "moment";
import "moment-duration-format";
import { useToast } from "../../contexts/ToastContext";
import BadgeVehicule from "../../components/others/BadgeVehicule";
import ReparationTable from "../../components/reparations/ReparationTable";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ReparationDetails from "../../components/reparations/ReparationDetails";

import usePagination from "../../hooks/usePagination";
import { useCrudModal } from "../../hooks/useCrudModal";
import { useListManager } from "../../hooks/useListManager";

const Reparations = () => {
  const [allReparations, setAllReparations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast } = useToast();
  const { modal, open, openDetails, close } = useCrudModal();

  const userInfo = JSON.parse(sessionStorage.getItem("user-info"));
  const userId = userInfo?.id;

  const filteredReparations = allReparations.filter((reparation) =>
    reparation.reception?.vehicule?.immatriculation
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const { sortOption, setSortOption, processedList } = useListManager({
    dataList: filteredReparations,
    dateField: "created_at",
  });

  const reparationsPerPage = 10;
  const totalPages = Math.ceil(processedList.length / reparationsPerPage) || 1;

  const {
    currentPage,
    goToPage,
    reset: resetPagination,
  } = usePagination(totalPages);

  const startIndex = (currentPage - 1) * reparationsPerPage;
  const currentReparations = processedList.slice(
    startIndex,
    startIndex + reparationsPerPage,
  );

  const fetchReparations = async () => {
    setLoading(true);
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/liste_reparations`,
      );
      const data = await response.json();
      const reparations = Array.isArray(data) ? data : data?.reparations || [];
      setAllReparations(reparations);
    } catch (error) {
      showToast("Erreur lors du chargement des réparations.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReparations();
  }, []);

  useEffect(() => {
    resetPagination();
  }, [searchQuery]);

  const handleTerminerReparation = async () => {
    const selectedReparation = modal.data;
    if (!selectedReparation?.reception?.id) return;
    setLoading(true);
    close();

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/terminer/${selectedReparation.reception.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      const result = await response.json();
      showToast(result.message, result.toast || "info");
      fetchReparations();
    } catch (error) {
      showToast("Erreur lors de la terminaison.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const reparationsEnCours = allReparations.filter(
    (r) => r.statut !== "termine",
  );

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Réparations en cours</h2>
        <h5>Total : {reparationsEnCours.length}</h5>
        <br />

        {loading ? (
          <Loader />
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
                        <BadgeVehicule
                          immatriculation={
                            rep.reception?.vehicule?.immatriculation
                          }
                          marque={rep.reception?.vehicule?.marque}
                          modele={rep.reception?.vehicule?.modele}
                          orientation="vertical"
                        />
                      </Card.Title>
                      <Card.Text className="text-muted small mb-3">
                        Démarré le{" "}
                        {moment(rep.created_at).format("DD/MM/YYYY à HH:mm")}
                      </Card.Text>
                      <Card.Text>
                        Mécanicien : <br />
                        <span className="fw-bold text-uppercase">
                          {rep.reception?.vehicule?.mecanicien?.nom || ""}
                        </span>{" "}
                        {rep.reception?.vehicule?.mecanicien?.prenom || ""}
                      </Card.Text>
                      <Button
                        variant="success"
                        onClick={() => open("finish", rep)}
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

        {/* Tableau des réparations */}
        <div className="mt-5">
          <h2>Historique des réparations</h2>
          <SearchBar
            placeholder="Rechercher une reparation par immatriculation..."
            value={searchQuery}
            onSearch={(query) => {
              setSearchQuery(query);
            }}
            delay={300}
          />

          <HeaderWithFilter
            title2="Historique des Réparations"
            main={null}
            sortOption={sortOption}
            setSortOption={setSortOption}
            hasAlphaSort={false}
            hasDateSort={true}
          />

          <ReparationTable
            reparations={currentReparations}
            onShowDetails={openDetails}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      </div>

      {/* Modal de détails */}
      <Modal show={modal.mode === "details"} onHide={close} centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails de la réparation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal.data && (
            <ReparationDetails reparation={modal.data} />
          )}
        </Modal.Body>
      </Modal>

      {/* Modal de confirmation */}
      <ConfirmPopup
        show={modal.mode === "finish"}
        onClose={close}
        onConfirm={handleTerminerReparation}
        title="Terminer la réparation"
        btnColor="success"
        body={
          <p>
            Voulez-vous vraiment terminer la réparation <br /> du véhicule{" "}
            <strong>
              {modal.data?.reception?.vehicule?.immatriculation}
            </strong>
            ?
          </p>
        }
      />
    </Layout>
  );
};

export default Reparations;
