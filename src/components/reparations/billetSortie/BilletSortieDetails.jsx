import { format } from "date-fns";
import BadgeVehicule from "../../others/BadgeVehicule";
import { formatMinutesToDHMM, formatRole } from "../../../utils/helpers";

const BilletSortieDetails = ({ billet }) => {
  if (!billet) return null;

  const reception = billet.reception;
  const vehicle = reception?.vehicule;
  const mechanic = vehicle?.mecanicien;
  const chrono = reception?.chrono;
  const chefAtelier = billet.chef_atelier;

  return (
    <div className="container-fluid px-1">
      {/* =========================
          VÉHICULE
      ========================== */}
      <div className="bg-body-tertiary border rounded-3 p-3 mb-3">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <BadgeVehicule
            immatriculation={vehicle?.immatriculation}
            marque={vehicle?.marque}
            modele={vehicle?.modele}
          />

          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2">
            <i className="fas fa-sign-out-alt me-1"></i>
            Sortie
          </span>
        </div>
      </div>

      {/* =========================
          INFORMATIONS DU BILLET
      ========================== */}
      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Informations du billet
        </div>

        <div className="border rounded-3 overflow-hidden">
          {/* Numéro */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Numéro du billet</span>

            <span className="badge bg-body text-secondary border fw-medium">
              BS-{String(billet.id).padStart(4, "0")}
            </span>
          </div>

          {/* Créateur */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3">
            <span className="text-muted small">Enregistré par</span>

            {chefAtelier ? (
              <div className="text-end">
                <span className="fw-semibold d-block">
                  {chefAtelier.first_name.trim().split(" ")[0] || ""}{" "}
                  {chefAtelier.last_name || ""}
                </span>

                <span className="text-muted small">
                  {formatRole(chefAtelier.role)}
                </span>
              </div>
            ) : (
              <span className="text-muted small">Non renseigné</span>
            )}
          </div>
        </div>
      </div>

      {/* =========================
          INFORMATIONS RÉPARATION
      ========================== */}
      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Informations de réparation
        </div>

        <div className="border rounded-3 overflow-hidden">
          {/* Mécanicien */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Mécanicien</span>

            <span className="fw-semibold text-end">
              {mechanic
                ? `${mechanic.prenom.trim().split(" ")[0] || ""} ${mechanic.nom || ""}`.trim()
                : "Non assigné"}
            </span>
          </div>

          {/* Arrivée */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Date d'arrivée</span>

            <span className="fw-semibold text-end">
              {reception?.date_arrivee
                ? format(
                    new Date(reception.date_arrivee),
                    "dd/MM/yyyy HH:mm:ss",
                  )
                : "Non disponible"}
            </span>
          </div>

          {/* Début */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Début réparation</span>

            <span className="fw-semibold text-end">
              {chrono?.start_time
                ? format(new Date(chrono.start_time), "dd/MM/yyyy HH:mm:ss")
                : "Non disponible"}
            </span>
          </div>

          {/* Fin */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3">
            <span className="text-muted small">Fin réparation</span>

            <span className="fw-semibold text-end">
              {chrono?.end_time
                ? format(new Date(chrono.end_time), "dd/MM/yyyy HH:mm:ss")
                : "Non disponible"}
            </span>
          </div>
        </div>
      </div>

      {/* =========================
          DURÉE
      ========================== */}
      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Durée de réparation
        </div>

        <div className="bg-body-tertiary border rounded-3 p-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "38px",
                  height: "38px",
                }}
              >
                <i className="fas fa-stopwatch"></i>
              </div>

              <div>
                <span className="fw-semibold d-block">
                  Temps passé au garage
                </span>

                <span className="text-muted small">
                  Durée totale de la réparation
                </span>
              </div>
            </div>

            <span className="fw-bold font-monospace text-primary">
              {chrono?.duree_total != null
                ? formatMinutesToDHMM(chrono.duree_total)
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* =========================
          DOCUMENT
      ========================== */}
      <div>
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Document de sortie
        </div>

        <div className="border rounded-3 overflow-hidden">
          <div className="d-flex align-items-center justify-content-between px-3 py-3">
            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "38px",
                  height: "38px",
                }}
              >
                <i className="fas fa-file-pdf"></i>
              </div>

              <div>
                <span className="fw-semibold d-block">Fiche de sortie</span>

                <span className="text-muted small">
                  Document de sortie du véhicule
                </span>
              </div>
            </div>

            {billet.fiche_sortie_vehicule ? (
              <a
                href={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${billet.fiche_sortie_vehicule}`}
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
    </div>
  );
};

export default BilletSortieDetails;
