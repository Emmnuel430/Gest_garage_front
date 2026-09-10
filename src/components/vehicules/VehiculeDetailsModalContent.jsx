import React from "react";
import { Link } from "react-router-dom";
import BadgeVehicule from "../others/BadgeVehicule";
import {
  formatDateTime,
  formatMontant,
  formatPhoneNumber,
} from "../../utils/helpers";

const DocumentLink = ({ href, label, description, variant = "primary" }) => (
  <div className="border rounded-3 p-3 d-flex align-items-center justify-content-between gap-3">
    <div className="d-flex align-items-center gap-2">
      <div
        className={`bg-${variant}-subtle text-${variant} rounded-circle d-flex align-items-center justify-content-center`}
        style={{ width: "38px", height: "38px" }}
      >
        <i className="fas fa-file-pdf"></i>
      </div>
      <div>
        <span className="fw-semibold d-block">{label}</span>
        <span className="text-muted small">{description}</span>
      </div>
    </div>
    {href ? (
      <Link
        to={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn btn-outline-${variant} btn-sm`}
      >
        <i className="fas fa-external-link-alt me-1"></i>
        Voir
      </Link>
    ) : (
      <span className="text-muted small">Non disponible</span>
    )}
  </div>
);

const VehiculeDetailsModalContent = ({ vehicule }) => {
  if (!vehicule) return null;

  const reception = vehicule.receptions?.[0];
  const mechanic = vehicule.mecanicien;
  const facture = reception?.facture;
  const billetSortie = reception?.billet_sortie;

  return (
    <div className="container-fluid px-1">
      <div className="bg-body-tertiary border rounded-3 p-3 mb-3">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <BadgeVehicule
            immatriculation={vehicule.immatriculation}
            marque={vehicule.marque}
            modele={vehicule.modele}
          />
          <span className="badge bg-body text-secondary border rounded-pill px-3 py-2">
            Véhicule #{String(vehicule.id).padStart(4, "0")}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Informations du véhicule
        </div>
        <div className="border rounded-3 overflow-hidden">
          {/* <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Immatriculation</span>
            <span className="fw-bold font-monospace text-uppercase">
              {vehicule.immatriculation || "N/A"}
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Marque et modèle</span>
            <span className="fw-semibold text-end">
              {vehicule.marque || "N/A"} {vehicule.modele || ""}
            </span>
          </div> */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3">
            <span className="text-muted small">Fiche d'entrée</span>
            {vehicule.fiche_entree_vehicule ? (
              <Link
                to={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${vehicule.fiche_entree_vehicule}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                <i className="fas fa-external-link-alt me-1"></i>
                Voir
              </Link>
            ) : (
              <span className="text-muted small">Non disponible</span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Mécanicien
        </div>
        <div className="border rounded-3 overflow-hidden">
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Nom</span>
            <span className="fw-semibold text-end">
              {mechanic
                ? `${mechanic.prenom || ""} ${mechanic.nom || ""}`.trim()
                : "Non assigné"}
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Type</span>
            <span className="fw-semibold text-capitalize">
              {mechanic?.type || "N/A"}
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center px-3 py-3">
            <span className="text-muted small">Contact</span>
            <span className="fw-semibold">
              {formatPhoneNumber(mechanic?.contact)}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Dernière réception
        </div>
        {reception ? (
          <div className="border rounded-3 overflow-hidden">
            <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
              <span className="text-muted small">Date d'arrivée</span>
              <span className="fw-semibold">
                {formatDateTime(reception.date_arrivee)}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-start gap-3 px-3 py-3 border-bottom">
              <span className="text-muted small">Motif</span>
              <span className="fw-semibold text-end">
                {reception.motif_visite || "Aucun motif spécifié"}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center px-3 py-3">
              <span className="text-muted small">Réparation</span>
              {reception.reparation ? (
                <span
                  className={`badge ${
                    reception.reparation.statut === "termine"
                      ? "bg-success-subtle text-success border border-success-subtle"
                      : "bg-warning-subtle text-warning-emphasis border border-warning-subtle"
                  } rounded-pill px-3 py-2`}
                >
                  {reception.reparation.statut === "termine"
                    ? "Terminée"
                    : "En cours"}
                </span>
              ) : (
                <span className="text-muted small">Non renseignée</span>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-body-tertiary border rounded-3 p-3 text-muted">
            Aucune réception enregistrée.
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Facturation et sortie
        </div>
        <div className="d-flex flex-column gap-2">
          <div className="border rounded-3 p-3 d-flex justify-content-between align-items-center">
            <span className="text-muted small">Facture</span>
            {facture ? (
              <span
                className={`badge ${
                  facture.statut === "payee"
                    ? "bg-success-subtle text-success border border-success-subtle"
                    : "bg-warning-subtle text-warning-emphasis border border-warning-subtle"
                } rounded-pill px-3 py-2`}
              >
                {facture.statut === "payee" ? "Payée" : "Non réglée"}
              </span>
            ) : (
              <span className="text-muted small">Aucune facture</span>
            )}
          </div>
          {facture?.date_generation && (
            <div className="border rounded-3 p-3 d-flex justify-content-between align-items-center">
              <span className="text-muted small">Montant</span>
              <span className="fw-bold text-success">
                {formatMontant(facture.montant)}
              </span>
            </div>
          )}
          <DocumentLink
            href={
              facture?.recu
                ? `${process.env.REACT_APP_API_BASE_URL_STORAGE}/${facture.recu}`
                : null
            }
            label="Reçu de paiement"
            description="Justificatif de règlement"
            variant="success"
          />
          <DocumentLink
            href={
              billetSortie?.fiche_sortie_vehicule
                ? `${process.env.REACT_APP_API_BASE_URL_STORAGE}/${billetSortie.fiche_sortie_vehicule}`
                : null
            }
            label="Billet de sortie"
            description="Document de sortie du véhicule"
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default VehiculeDetailsModalContent;
