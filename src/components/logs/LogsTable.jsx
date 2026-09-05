import { Table } from "react-bootstrap";
import UserCell from "../common/UserCell";
import moment from "moment";
import { formatTableName } from "../../utils/helpers";

const LogsTable = ({
  logs = [],
  onShowDetails,
  getActionColor,
  getActionLabel,
}) => {
  const getActionConfig = (action) => {
    // Récupère directement la racine de la couleur (ex: "success")
    const colorName = getActionColor(action);

    return {
      color: colorName,
      label: getActionLabel?.(action) || action || "Inconnue",
    };
  };

  return (
    <div className="table-responsive">
      <Table hover align="middle" className="mb-0 fs-6">
        <thead className="table-body rounded-3 text-muted small text-uppercase tracking-wider">
          <tr>
            <th scope="col" className="ps-3 py-3">
              #
            </th>

            <th scope="col" className="py-3">
              Utilisateur
            </th>

            <th scope="col" className="py-3">
              Action
            </th>

            <th scope="col" className="py-3">
              Concerne
            </th>

            <th scope="col" className="py-3">
              Date
            </th>

            <th scope="col" className="py-3 text-end pe-3">
              Détails
            </th>
          </tr>
        </thead>

        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-5 text-muted">
                <i className="fas fa-history fa-2x mb-2 d-block text-black-50"></i>
                Aucun historique trouvé.
              </td>
            </tr>
          ) : (
            logs.map((log, index) => {
              const action = getActionConfig(log.action);

              const firstName = log.user_prenom || log.user?.first_name || "";

              const lastName = log.user_nom || log.user?.last_name || "";

              return (
                <tr
                  key={log.id || index}
                  className="align-middle"
                  onClick={() => onShowDetails(log)}
                >
                  {/* Numéro */}
                  <td className="ps-3">
                    <span className="text-muted small">{index + 1}</span>
                  </td>

                  {/* Utilisateur */}
                  <td>
                    <UserCell
                      user={
                        log.user
                          ? { ...log.user, first_name: firstName, last_name: lastName }
                          : (firstName || lastName || log.user_id)
                          ? { id: log.user_id, first_name: firstName, last_name: lastName }
                          : null
                      }
                      size={34}
                      subtitle={`ID utilisateur : ${log.user?.id || log.user_id || "—"}`}
                      fallback="Inconnu"
                    />
                  </td>

                  {/* Action */}
                  <td>
                    <span
                      className={`badge bg-${action.color}-subtle text-${action.color} border border-${action.color}-subtle rounded-pill px-3 py-2 fw-semibold`}
                      style={{ fontSize: "0.78rem" }}
                    >
                      {action.label}
                    </span>
                  </td>

                  {/* Ressource concernée */}
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <i className="fas fa-database text-muted small"></i>

                      <span className="font-monospace text-secondary small">
                        {formatTableName(log.table_concernee)}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="text-secondary font-monospace small">
                    {log.created_at ? (
                      <div className="text-secondary small">
                        <span className="fw-semibold d-block">
                          {moment(log.created_at).format("DD/MM/YYYY")}
                        </span>

                        <span className="text-muted">
                          {moment(log.created_at).format("HH:mm")}
                        </span>
                      </div>
                    ) : (
                      "Non disponible"
                    )}
                  </td>

                  {/* Détails */}
                  <td className="text-end pe-3">
                    <button
                      type="button"
                      onClick={() => onShowDetails(log)}
                      className="btn btn-body border btn-sm rounded-circle"
                      title="Voir les détails du log"
                      style={{
                        width: "34px",
                        height: "34px",
                      }}
                    >
                      <i className="fas fa-eye text-secondary"></i>
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default LogsTable;
