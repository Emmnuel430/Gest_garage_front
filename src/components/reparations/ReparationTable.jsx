import { Table } from "react-bootstrap";
import moment from "moment";

const ReparationTable = ({
  reparations = [],
  onShowDetails,
}) => {
  const sortedReparations = [...reparations].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  return (
    <div className="table-responsive">
      <Table hover align="middle" className="mb-0 fs-6">
        <thead className="table-body rounded-3 text-muted small text-uppercase tracking-wider">
          <tr>
            <th scope="col" className="ps-3 py-3">
              ID
            </th>

            <th scope="col" className="py-3">
              Véhicule
            </th>

            <th scope="col" className="py-3">
              Début
            </th>

            <th scope="col" className="py-3">
              Fin
            </th>

            <th scope="col" className="py-3 text-center">
              Statut
            </th>

            <th scope="col" className="py-3 text-end pe-3">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedReparations.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-5 text-muted">
                <i className="fas fa-tools fa-2x mb-2 d-block text-body"></i>
                Aucune réparation trouvée.
              </td>
            </tr>
          ) : (
            sortedReparations.map((rep) => {
              const isTerminee = rep.statut === "termine";

              const vehicule = rep.reception?.vehicule;
              const chrono = rep.reception?.chrono;

              return (
                <tr
                  key={rep.id}
                  className="align-middle"
                  onClick={() => onShowDetails(rep)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {/* ID */}
                  <td className="ps-3">
                    <span className="badge bg-body text-secondary border fw-medium px-2 py-1">
                      #{String(rep.id).padStart(4, "0")}
                    </span>
                  </td>

                  {/* Véhicule */}
                  <td>
                    <div>
                      <span className="fw-bold font-monospace text-body text-uppercase d-block">
                        {vehicule?.immatriculation || "—"}
                      </span>

                      <span className="text-muted small">
                        {vehicule?.marque || "Inconnu"} {vehicule?.modele || ""}
                      </span>
                    </div>
                  </td>

                  {/* Début */}
                  <td>
                    {chrono?.start_time ? (
                      <div className="text-secondary small">
                        <span className="fw-semibold d-block">
                          {moment(chrono.start_time).format("DD/MM/YYYY")}
                        </span>

                        <span className="text-muted">
                          {moment(chrono.start_time).format("HH:mm")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted small">—</span>
                    )}
                  </td>

                  {/* Fin */}
                  <td>
                    {isTerminee && rep.updated_at ? (
                      <div className="text-secondary small">
                        <span className="fw-semibold d-block">
                          {moment(rep.updated_at).format("DD/MM/YYYY")}
                        </span>

                        <span className="text-muted">
                          {moment(rep.updated_at).format("HH:mm")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-warning small fw-medium">
                        <i className="fas fa-hourglass-half me-1"></i>
                        En cours
                      </span>
                    )}
                  </td>

                  {/* Statut */}
                  <td className="text-center">
                    {isTerminee ? (
                      <span
                        className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-pill fw-semibold"
                        style={{ fontSize: "0.8rem" }}
                      >
                        <i className="fas fa-check me-1"></i>
                        Terminée
                      </span>
                    ) : (
                      <span
                        className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2.5 py-1.5 rounded-pill fw-semibold"
                        style={{ fontSize: "0.8rem" }}
                      >
                        <i className="fas fa-spinner me-1"></i>
                        En cours
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="text-end pe-3">
                    <div
                      className="d-flex justify-content-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onShowDetails(rep)}
                        className="btn btn-body border btn-sm rounded-circle"
                        title="Voir les détails"
                        style={{
                          width: "34px",
                          height: "34px",
                        }}
                      >
                        <i className="fas fa-eye text-secondary"></i>
                      </button>
                    </div>
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

export default ReparationTable;
