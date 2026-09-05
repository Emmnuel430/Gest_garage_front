import React from "react";
import BadgeVehicule from "../../others/BadgeVehicule";
import {
  formatDateTime,
  formatMinutesToDHMM,
  formatMontant,
} from "../../../utils/helpers";

const FactureDetailsModalContent = ({ facture }) => {
  if (!facture) return null;

  const reception = facture.reception;
  const vehicle = reception?.vehicule;
  const mechanic = vehicle?.mecanicien;
  const isPaid = facture.statut === "payee";

  return (
    <div className="container-fluid px-1">
      <div className="bg-body-tertiary border rounded-3 p-3 mb-3">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <BadgeVehicule
            immatriculation={vehicle?.immatriculation}
            marque={vehicle?.marque}
            modele={vehicle?.modele}
          />
          <span
            className={`badge bg-${isPaid ? "success" : "warning"}-subtle text-${
              isPaid ? "success" : "warning-emphasis"
            } border border-${isPaid ? "success" : "warning"}-subtle rounded-pill px-3 py-2 text-uppercase`}
          >
            {isPaid ? "Payée" : "Non payée"}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Informations de la facture
        </div>
        <div className="border rounded-3 overflow-hidden">
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Numéro de facture</span>
            <span className="badge bg-body text-secondary border fw-medium">
              #{String(facture.id).padStart(4, "0")}
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Date de génération</span>
            <span className="fw-semibold text-end">
              {formatDateTime(facture.date_generation)}
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center px-3 py-3">
            <span className="text-muted small">Montant</span>
            <span className="fw-bold text-success">
              {formatMontant(facture.montant)}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Informations de réparation
        </div>
        <div className="border rounded-3 overflow-hidden">
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Mécanicien</span>
            <span className="fw-semibold text-end">
              {mechanic
                ? `${mechanic.prenom || ""} ${mechanic.nom || ""}`.trim()
                : "Non assigné"}
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Date d'arrivée</span>
            <span className="fw-semibold text-end">
              {formatDateTime(reception?.date_arrivee)}
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Début réparation</span>
            <span className="fw-semibold text-end">
              {formatDateTime(reception?.reparation?.created_at)}
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center px-3 py-3">
            <span className="text-muted small">Fin réparation</span>
            <span className="fw-semibold text-end">
              {formatDateTime(reception?.reparation?.updated_at)}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Motif de la visite
        </div>
        <div className="bg-body-tertiary border rounded-3 p-3">
          <div className="d-flex align-items-start gap-2">
            <i className="fas fa-comment-alt text-muted mt-1"></i>
            <span>
              {reception?.motif_visite || (
                <span className="text-muted fst-italic">
                  Aucun motif spécifié
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {facture.date_generation && (
        <div>
          <div className="small text-muted text-uppercase fw-bold mb-2">
            Documents et durée
          </div>
          <div className="border rounded-3 overflow-hidden">
            <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
              <span className="text-muted small">Durée au garage</span>
              <span className="fw-semibold">
                {formatMinutesToDHMM(reception?.chrono?.duree_total) || "N/A"}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center px-3 py-3">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "38px", height: "38px" }}
                >
                  <i className="fas fa-file-pdf"></i>
                </div>
                <div>
                  <span className="fw-semibold d-block">Reçu PDF</span>
                  <span className="text-muted small">
                    Justificatif de paiement
                  </span>
                </div>
              </div>
              {facture.recu ? (
                <a
                  href={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${facture.recu}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  <i className="fas fa-external-link-alt me-1"></i>
                  Voir
                </a>
              ) : (
                <span className="text-muted small">Non disponible</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactureDetailsModalContent;
