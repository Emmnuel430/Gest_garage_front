import React from "react";
import UserCell from "../common/UserCell";
import { formatTableDate, STATUT_COLOR_CONFIG } from "../../utils/helpers";

const defaultStatusResolver = (status) => {
  const config = STATUT_COLOR_CONFIG[status] || {
    label: status || "Inconnu",
    bg: "secondary",
  };

  return config;
};

const ReceptionTableRow = ({
  reception,
  userRole,
  onShowDetails,
  onDelete,
  onUpdate,
  isDisabled = false,
  showUpdateButton = false,
  showDeleteButton = true,
  statusResolver = defaultStatusResolver,
}) => {
  const status = statusResolver(reception?.statut);

  return (
    <tr
      key={reception.id}
      onClick={() => onShowDetails(reception)}
      className="align-middle"
      style={{
        cursor: isDisabled ? "default" : "pointer",
        opacity: isDisabled ? 0.55 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      <td className="ps-3">
        <span className="badge bg-body text-secondary border fw-medium px-2 py-1">
          #{String(reception.id).padStart(4, "0")}
        </span>
      </td>

      <td>
        <UserCell user={reception.cree_par || reception.creePar || reception.user || reception.gardien} size={32} fallback="Non assigné" />
      </td>

      <td>
        <div>
          <span className="fw-bold font-monospace text-body text-uppercase d-block">
            {reception.vehicule?.immatriculation || "—"}
          </span>

          <span className="text-muted small">
            {reception.vehicule?.marque || "Inconnu"}{" "}
            {reception.vehicule?.modele || ""}
          </span>
        </div>
      </td>

      <td className="text-secondary small text-capitalize">
        {formatTableDate(reception.date_arrivee)}
      </td>

      <td className="text-center">
        <span
          className={`badge bg-${status.bg}-subtle text-${status.bg} border border-${status.bg}-subtle px-2.5 py-1.5 rounded-pill fw-semibold`}
          style={{ fontSize: "0.8rem" }}
        >
          {status.label}
        </span>
      </td>

      <td className="text-end pe-3">
        <div
          className="d-flex justify-content-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onShowDetails(reception)}
            className="btn btn-body border btn-sm rounded-circle"
            disabled={isDisabled}
            title="Voir les détails"
            style={{ width: "34px", height: "34px" }}
          >
            <i className="fas fa-eye text-secondary"></i>
          </button>

          {showUpdateButton && onUpdate && (
            <button
              type="button"
              onClick={() => onUpdate(reception)}
              className="btn btn-body border btn-sm rounded-circle"
              disabled={isDisabled}
              title="Mettre à jour"
              style={{ width: "34px", height: "34px" }}
            >
              <i className="fas fa-pencil-alt text-warning"></i>
            </button>
          )}

          {showDeleteButton &&
            (userRole === "admin" || userRole === "reception") && (
              <button
                type="button"
                onClick={() => onDelete(reception)}
                className="btn btn-body border btn-sm rounded-circle"
                disabled={isDisabled}
                title="Supprimer"
                style={{ width: "34px", height: "34px" }}
              >
                <i className="fas fa-trash text-danger"></i>
              </button>
            )}
        </div>
      </td>
    </tr>
  );
};

export default ReceptionTableRow;
