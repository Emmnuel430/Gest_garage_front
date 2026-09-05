import { format } from "date-fns";
import BadgeVehicule from "../others/BadgeVehicule";

const ReparationDetails = ({ reparation }) => {
  if (!reparation) return null;

  const vehicule = reparation.reception?.vehicule;
  const chrono = reparation.reception?.chrono;
  const mecanicien = vehicule?.mecanicien;

  const isTerminee = reparation.statut === "termine";

  return (
    <div className="container-fluid px-1">
      {/* =========================
          VÉHICULE
      ========================== */}
      <div className="bg-body-tertiary border rounded-3 p-3 mb-3">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <BadgeVehicule
            immatriculation={vehicule?.immatriculation}
            marque={vehicule?.marque}
            modele={vehicule?.modele}
          />

          {isTerminee ? (
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2">
              <i className="fas fa-check me-1"></i>
              Terminée
            </span>
          ) : (
            <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-3 py-2">
              <i className="fas fa-spinner me-1"></i>
              En cours
            </span>
          )}
        </div>
      </div>

      {/* =========================
          INFORMATIONS
      ========================== */}
      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Informations de la réparation
        </div>

        <div className="border rounded-3 overflow-hidden">
          {/* ID */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">ID réparation</span>

            <span className="badge bg-body text-secondary border fw-medium">
              REP-{String(reparation.id).padStart(4, "0")}
            </span>
          </div>

          {/* Mécanicien */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Mécanicien</span>

            <span className="fw-semibold text-end">
              {mecanicien
                ? `${mecanicien.prenom || ""} ${mecanicien.nom || ""}`.trim()
                : "Non assigné"}
            </span>
          </div>

          {/* Début */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Début</span>

            {chrono?.start_time ? (
              <div className="text-end">
                <span className="fw-semibold d-block">
                  {format(new Date(chrono.start_time), "dd/MM/yyyy")}
                </span>

                <span className="text-muted small">
                  {format(new Date(chrono.start_time), "HH:mm:ss")}
                </span>
              </div>
            ) : (
              <span className="text-muted small">Non disponible</span>
            )}
          </div>

          {/* Fin */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3">
            <span className="text-muted small">Fin</span>

            {isTerminee ? (
              <div className="text-end">
                <span className="fw-semibold d-block">
                  {format(new Date(reparation.updated_at), "dd/MM/yyyy")}
                </span>

                <span className="text-muted small">
                  {format(new Date(reparation.updated_at), "HH:mm:ss")}
                </span>
              </div>
            ) : (
              <span className="text-warning small fw-semibold">
                <i className="fas fa-clock me-1"></i>
                Réparation en cours
              </span>
            )}
          </div>
        </div>
      </div>

      {/* =========================
          MOTIF
      ========================== */}
      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Motif de la réparation
        </div>

        <div className="bg-body-tertiary border rounded-3 p-3">
          <div className="d-flex align-items-start gap-2">
            <i className="fas fa-comment-alt text-muted mt-1"></i>

            <span>
              {reparation.reception?.motif_visite || (
                <span className="text-muted fst-italic">
                  Aucun motif spécifié
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReparationDetails;
