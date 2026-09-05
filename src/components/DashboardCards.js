import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import {
  DashboardCard,
  EmptyState,
  renderChronoItem,
} from "./DashboardElements";
import { formatTableName } from "../utils/helpers";
import { useEffect, useState } from "react";

export default function DashboardCards({
  userInfo,
  facturesImpayees,
  logs,
  chronosEnCours,
  formatDateRelative,
  getActionColor,
  getActionLabel,
}) {
  const navigate = useNavigate();
  const [, setCurrentTime] = useState(Date.now());

  // Actualiser l'heure locale toutes les secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 59 * 1000);
    return () => clearInterval(interval);
  }, []);

  const isAdminOrCaisse = ["admin", "caisse"].includes(userInfo?.role);

  return (
    <div className="row g-4">
      {/* FACTURES */}
      {isAdminOrCaisse && (
        <DashboardCard
          icon="bi bi-receipt"
          iconClass="bg-danger-subtle text-danger"
          title="Factures impayées"
          count={facturesImpayees.length}
          link={facturesImpayees.length > 0 ? "/factures" : null}
        >
          {facturesImpayees.length > 0 ? (
            <div className="d-flex flex-column gap-2">
              {facturesImpayees.slice(0, 3).map((facture, index) => (
                <div
                  key={index}
                  onClick={() => navigate("/factures")}
                  className="p-3 rounded-3 bg-danger-subtle border border-danger-subtle dashboard-item"
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="text-danger">
                      <i className="bi bi-exclamation-circle-fill fs-5" />
                    </div>

                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-semibold text-truncate">
                        {facture.reception?.vehicule?.immatriculation ||
                          "Véhicule inconnu"}
                      </div>

                      <small className="text-muted">Facture impayée</small>
                    </div>

                    <i className="bi bi-chevron-right text-danger" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="bi bi-check-circle"
              message="Aucune facture impayée"
              type="success"
            />
          )}
        </DashboardCard>
      )}

      {/* LOGS */}
      {userInfo?.role === "admin" && (
        <DashboardCard
          icon="fas fa-history"
          iconClass="bg-primary-subtle text-primary"
          title="Activité récente"
          count={logs.length}
          link={logs.length > 0 ? "/logs" : null}
        >
          {logs.length > 0 ? (
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <tbody>
                  {logs.slice(0, 5).map((log, index) => {
                    const actionColor = getActionColor(log.action);
                    return (
                      <tr key={index}>
                        <td className="border-0 px-0">
                          <span
                            className={`badge bg-${actionColor}-subtle text-${actionColor} border border-${actionColor}-subtle text-uppercase rounded-pill px-2 py-1`}
                            style={{ fontSize: "0.7rem" }}
                          >
                            {getActionLabel(log.action)}
                          </span>
                        </td>

                        <td className="border-0 text-capitalize small">
                          {formatTableName(log.table_concernee)}
                        </td>

                        <td className="border-0 text-end text-muted small">
                          {formatDateRelative(log.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon="bi bi-activity"
              message="Aucune activité récente"
            />
          )}
        </DashboardCard>
      )}

      {/* CHRONOS */}
      <DashboardCard
        icon="bi bi-stopwatch"
        iconClass="bg-warning-subtle text-warning"
        title="Chronos"
        count={chronosEnCours.length}
        link={
          chronosEnCours.length > 0 && userInfo?.role !== "gardien"
            ? "/chronos"
            : null
        }
      >
        {chronosEnCours.length > 0 ? (
          <div className="d-flex flex-column gap-2">
            {chronosEnCours.length === 0 ? (
              <div className="p-3 text-center text-muted small bg-light rounded-3">
                Aucun chrono actif pour le moment.
              </div>
            ) : (
              chronosEnCours
                .slice(0, 3)
                .map((chrono) => renderChronoItem(chrono))
            )}
          </div>
        ) : (
          <EmptyState icon="bi bi-stopwatch" message="Aucun chrono en cours" />
        )}
      </DashboardCard>
    </div>
  );
}
