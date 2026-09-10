import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import BadgeVehicule from "../others/BadgeVehicule";
import { formatRole } from "../../utils/helpers";

const ReceptionDetailsModalContent = ({
  reception,
  resolveStatusConfig,
  checkPage = false,
}) => {
  if (!reception) return null;

  const status = resolveStatusConfig(reception.statut);

  return (
    <div className="container-fluid px-1">
      <div className="bg-body-tertiary border rounded-3 p-3 mb-3">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center">
            <BadgeVehicule
              immatriculation={reception.vehicule?.immatriculation}
              marque={reception.vehicule?.marque}
              modele={reception.vehicule?.modele}
            />
          </div>

          <span
            className={`badge bg-${status.bg}-subtle text-${status.bg} border rounded-pill px-3 py-2 text-uppercase`}
          >
            {status.label}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Informations générales
        </div>

        <div className="border rounded-3 overflow-hidden">
          <div className="d-flex justify-content-between align-items-center px-3 py-2.5 border-bottom">
            <span className="text-muted small">ID réception</span>
            <span className="badge bg-body text-secondary border fw-medium">
              #{String(reception.id).padStart(4, "0")}
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Réceptionné par</span>

            <div className="text-end">
              {(() => {
                const agent = reception.cree_par || reception.creePar || reception.gardien || reception.user;
                return (
                  <>
                    <span className="fw-semibold d-block">
                      {agent ? (
                        <span>
                          {agent.first_name}{" "}
                          <span className="text-uppercase">
                            {agent.last_name}
                          </span>
                        </span>
                      ) : (
                        "Non assigné"
                      )}
                    </span>

                    {agent?.role && (
                      <span className="text-muted small">
                        {formatRole(agent.role)}
                      </span>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {(reception.valide_par || reception.validePar || reception.secretaire) && (
            <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
              <span className="text-muted small">Validé par</span>

              <div className="text-end">
                {(() => {
                  const agent = reception.valide_par || reception.validePar || reception.secretaire;
                  return (
                    <>
                      <span className="fw-semibold d-block">
                        {agent.first_name}{" "}
                        <span className="text-uppercase">{agent.last_name}</span>
                      </span>
                      {agent?.role && (
                        <span className="text-muted small">
                          {formatRole(agent.role)}
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {(reception.repare_par || reception.reparePar || reception.chefAtelier) && (
            <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
              <span className="text-muted small">Réparé par</span>

              <div className="text-end">
                {(() => {
                  const agent = reception.repare_par || reception.reparePar || reception.chefAtelier;
                  return (
                    <>
                      <span className="fw-semibold d-block">
                        {agent.first_name}{" "}
                        <span className="text-uppercase">{agent.last_name}</span>
                      </span>
                      {agent?.role && (
                        <span className="text-muted small">
                          {formatRole(agent.role)}
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Mécanicien</span>
            <span className="fw-semibold text-end">
              {reception.vehicule?.mecanicien
                ? `${reception.vehicule.mecanicien.prenom || ""} ${
                    reception.vehicule.mecanicien.nom || ""
                  }`.trim()
                : "Non assigné"}
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center px-3 py-3">
            <span className="text-muted small">Date d'arrivée</span>
            <div className="text-end">
              <span className="fw-semibold d-block">
                {format(new Date(reception.date_arrivee), "dd/MM/yyyy")}
              </span>
              <span className="text-muted small">
                {format(new Date(reception.date_arrivee), "HH:mm")}
              </span>
            </div>
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
            <span className="text-body">
              {reception.motif_visite || (
                <span className="text-muted fst-italic">
                  Aucun motif spécifié
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Documents
        </div>

        <div className="d-flex flex-column gap-2">
          <div className="border rounded-3 p-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "38px", height: "38px" }}
              >
                <i className="fas fa-file-pdf"></i>
              </div>

              <div>
                <span className="fw-semibold d-block">Fiche d'entrée</span>
                <span className="text-muted small">Document du véhicule</span>
              </div>
            </div>

            {reception.vehicule?.fiche_entree_vehicule ? (
              <Link
                to={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${reception.vehicule.fiche_entree_vehicule}`}
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

          {checkPage && (
            <div className="border rounded-3 p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "38px", height: "38px" }}
                >
                  <i className="fas fa-clipboard-check"></i>
                </div>

                <div>
                  <span className="fw-semibold d-block">
                    Fiche de réception
                  </span>
                  <span className="text-muted small">
                    Document de réception
                  </span>
                </div>
              </div>

              {reception.fiche_reception_vehicule ? (
                <Link
                  to={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${reception.fiche_reception_vehicule}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-success btn-sm"
                >
                  <i className="fas fa-external-link-alt me-1"></i>
                  Voir
                </Link>
              ) : (
                <span className="text-muted small">Non disponible</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Historique
        </div>

        <div className="border rounded-3 overflow-hidden">
          <div className="d-flex justify-content-between px-3 py-3 border-bottom">
            <span className="text-muted small">Date d'ajout</span>
            <span className="text-secondary small">
              {format(new Date(reception.created_at), "dd/MM/yyyy à HH:mm")}
            </span>
          </div>

          <div className="d-flex justify-content-between px-3 py-3">
            <span className="text-muted small">Dernière mise à jour</span>
            <span className="text-secondary small">
              {reception.updated_at === reception.created_at
                ? "Aucune modification"
                : format(new Date(reception.updated_at), "dd/MM/yyyy à HH:mm")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDetailsModalContent;
