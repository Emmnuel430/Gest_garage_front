import { Link } from "react-router-dom";
import { formatDateRelative } from "../utils/helpers";
// ---

export const DashboardCard = ({
  icon,
  iconClass,
  title,
  count,
  link,
  children,
}) => (
  <div className="col-12 col-md-6 col-xl-4">
    <div className="card border shadow-sm rounded-4 h-100 overflow-hidden">
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className={`rounded-3 d-flex align-items-center justify-content-center ${iconClass}`}
              style={{
                width: "42px",
                height: "42px",
              }}
            >
              <i className={icon} style={{ fontSize: "1.1rem" }} />
            </div>

            <div>
              <h6 className="mb-0 fw-bold">{title}</h6>
              {count !== undefined && (
                <small className="text-muted">
                  {count} élément{count > 1 ? "s" : ""}
                </small>
              )}
            </div>
          </div>

          {link && (
            <Link
              to={link}
              className="btn btn-sm btn-body border rounded-pill px-3 fw-semibold"
            >
              Voir tout
            </Link>
          )}
        </div>

        {children}
      </div>
    </div>
  </div>
);

export const EmptyState = ({ icon, message, type = "muted" }) => (
  <div
    className={`d-flex flex-column align-items-center justify-content-center text-${type} py-4`}
  >
    <i className={`${icon} fs-2 mb-2`} />

    <span className="small fw-medium">{message}</span>
  </div>
);

export const renderChronoItem = (chrono) => {
  const isPaused = chrono.statut === "en_pause";

  return (
    <div
      key={chrono.id}
      className="d-flex align-items-center gap-3 p-3 border-bottom hover-actions"
    >
      {/* Icône dynamique (Animation Pulse si en cours, fixe si en pause) */}
      <div
        className={isPaused ? "text-secondary" : "text-warning animate-pulse"}
      >
        <i
          className={`bi ${isPaused ? "bi-pause-circle-fill" : "bi-stopwatch-fill"} fs-4`}
        />
      </div>

      {/* Informations Véhicule & Temps */}
      <div className="flex-grow-1">
        <div className="d-flex align-items-center gap-1.5">
          <span className="fw-bold text-body text-capitalize small">
            {chrono.reception?.vehicule?.marque}
          </span>
          <span className="text-muted small ms-1">
            {chrono.reception?.vehicule?.modele}
          </span>
        </div>

        <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
          {isPaused ? "Mis en pause" : "Temps écoulé"} •{" "}
          {formatDateRelative(chrono.start_time)}
        </small>
      </div>

      {/* Badge de statut moderne (Style Subtle Bootstrap 5) */}
      <span
        className={`badge px-2.5 py-1.5 rounded-pill fw-semibold ${
          isPaused
            ? "bg-secondary-subtle text-secondary border border-secondary-subtle"
            : "bg-warning-subtle text-warning border border-warning-subtle"
        }`}
        style={{ fontSize: "0.75rem" }}
      >
        {isPaused ? "En pause" : "En cours"}
      </span>
    </div>
  );
};
