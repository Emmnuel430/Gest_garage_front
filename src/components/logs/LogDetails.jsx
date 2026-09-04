import { format } from "date-fns";
import UserCell from "../common/UserCell";
import { ROLE_COLORS } from "../../constants/RoleColors";

const LogDetails = ({ log, formatRole, getActionColor, getActionLabel }) => {
  if (!log) return null;

  const firstName = log.user_prenom || log.user?.first_name || "";

  const lastName = log.user_nom || log.user?.last_name || "";

  const userName = `${firstName} ${lastName}`.trim() || "Utilisateur inconnu";

  const role = log.user_role || log.user?.role;

  const formatDateTime = (date) => {
    if (!date) return "Non disponible";

    return format(new Date(date), "dd/MM/yyyy HH:mm:ss");
  };

  const formatTableName = (tableName) => {
    if (!tableName) return "Non disponible";

    return tableName
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const actionColor = getActionColor(log.action);
  const actionLabel =
    getActionLabel?.(log.action) || log.action || "Action inconnue";

  return (
    <div className="container-fluid px-1">
      {/* =============================
          HEADER
      ============================= */}
      <div className="bg-body-tertiary border rounded-3 p-3 mb-3">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5"
              style={{
                width: "52px",
                height: "52px",
                flexShrink: 0,
              }}
            >
              <i className="fas fa-history"></i>
            </div>

            <div>
              <h6 className="fw-bold mb-1">Détail de l'activité</h6>

              <span className="text-muted small">
                Historique et traçabilité
              </span>
            </div>
          </div>

          <span
            className={`badge bg-${actionColor}-subtle text-${actionColor} border border-${actionColor}-subtle rounded-pill px-3 py-2`}
          >
            {actionLabel}
          </span>
        </div>
      </div>

      {/* =============================
          UTILISATEUR
      ============================= */}
      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Utilisateur concerné
        </div>

        <div className="border rounded-3 overflow-hidden">
          {/* Identité */}
          <div className="d-flex align-items-center px-3 py-3 border-bottom">
            <UserCell
              user={
                log.user
                  ? { ...log.user, first_name: firstName, last_name: lastName }
                  : { id: log.user_id, first_name: firstName, last_name: lastName }
              }
              size={42}
              subtitle={`ID utilisateur : ${log.user?.id || log.user_id || "—"}`}
              className="flex-grow-1"
            />

            {role && (
              <span
                className={`badge ${
                  ROLE_COLORS[role] || "bg-secondary"
                } border rounded-pill px-3 py-2`}
              >
                {formatRole?.(role) || role}
              </span>
            )}
          </div>

          {/* Date de création utilisateur */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3">
            <span className="text-muted small">Compte créé le</span>

            <span className="fw-semibold text-end">
              {formatDateTime(log.user_doc)}
            </span>
          </div>
        </div>
      </div>

      {/* =============================
          INFORMATIONS DU LOG
      ============================= */}
      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Informations de l'activité
        </div>

        <div className="border rounded-3 overflow-hidden">
          {/* Date */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Date et heure</span>

            <span className="fw-semibold text-end">
              {formatDateTime(log.created_at)}
            </span>
          </div>

          {/* Action */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Action effectuée</span>

            <span
              className={`badge bg-${actionColor}-subtle text-${actionColor} border border-${actionColor}-subtle rounded-pill px-3 py-2`}
            >
              {actionLabel}
            </span>
          </div>

          {/* Table */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3">
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-database text-muted small"></i>

              <span className="text-muted small">Élément concerné</span>
            </div>

            <span className="font-monospace text-secondary small text-end">
              {formatTableName(log.table_concernee)}
            </span>
          </div>
        </div>
      </div>

      {/* =============================
          DÉTAILS
      ============================= */}
      <div>
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Détails de l'action
        </div>

        <div className="bg-body-tertiary border rounded-3 p-3">
          <div className="d-flex align-items-start gap-2">
            <i className="fas fa-align-left text-muted mt-1"></i>

            {log.details ? (
              <div
                className="text-body"
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {log.details}
              </div>
            ) : (
              <span className="text-muted fst-italic">
                Aucun détail disponible pour cette action.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogDetails;
