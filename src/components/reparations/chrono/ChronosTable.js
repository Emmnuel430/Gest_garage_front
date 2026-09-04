import React from "react";
import { Table } from "react-bootstrap";
import moment from "moment";
import { formatMinutesToDHMM } from "../../../utils/helpers";

const ChronosTable = ({ rows = [] }) => {
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
              Temps écoulé
            </th>

            <th scope="col" className="py-3 text-center">
              Statut
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-5 text-muted">
                <i className="fas fa-stopwatch fa-2x mb-2 d-block text-body"></i>
                Aucun chrono trouvé.
              </td>
            </tr>
          ) : (
            rows.map((chrono) => {
                const isEnCours = !chrono.end_time;

                return (
                  <tr key={chrono.id} className="align-middle">
                    {/* ID */}
                    <td className="ps-3">
                      <span className="badge bg-body text-secondary border fw-medium px-2 py-1">
                        #{String(chrono.id).padStart(4, "0")}
                      </span>
                    </td>

                    {/* Véhicule */}
                    <td>
                      <div>
                        <span className="fw-bold font-monospace text-body text-uppercase d-block">
                          {chrono.reception?.vehicule?.immatriculation || "—"}
                        </span>

                        <span className="text-muted small">
                          {chrono.reception?.vehicule?.marque || "Inconnu"}{" "}
                          {chrono.reception?.vehicule?.modele || ""}
                        </span>
                      </div>
                    </td>

                    {/* Début */}
                    <td>
                      <div className="text-secondary small">
                        <span className="fw-semibold d-block">
                          {moment(chrono.start_time).format("DD/MM/YYYY")}
                        </span>

                        <span className="text-muted">
                          {moment(chrono.start_time).format("HH:mm:ss")}
                        </span>
                      </div>
                    </td>

                    {/* Fin */}
                    <td>
                      {chrono.end_time ? (
                        <div className="text-secondary small">
                          <span className="fw-semibold d-block">
                            {moment(chrono.end_time).format("DD/MM/YYYY")}
                          </span>

                          <span className="text-muted">
                            {moment(chrono.end_time).format("HH:mm:ss")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted small fst-italic">
                          En cours
                        </span>
                      )}
                    </td>

                    {/* Durée */}
                    <td className="text-center">
                      {isEnCours ? (
                        <span className="d-inline-flex align-items-center gap-1 text-warning fw-semibold">
                          <i className="fas fa-hourglass-half me-1"></i>
                          En cours
                        </span>
                      ) : (
                        <span className="font-monospace fw-semibold text-body">
                          {formatMinutesToDHMM(chrono.duree_total)}
                        </span>
                      )}
                    </td>

                    {/* Statut */}
                    <td className="text-center">
                      {isEnCours ? (
                        <span
                          className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2.5 py-1.5 rounded-pill fw-semibold"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <i className="fas fa-spinner me-1"></i>
                          En cours
                        </span>
                      ) : (
                        <span
                          className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-pill fw-semibold"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <i className="fas fa-check me-1"></i>
                          Terminé
                        </span>
                      )}
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

export default ChronosTable;
