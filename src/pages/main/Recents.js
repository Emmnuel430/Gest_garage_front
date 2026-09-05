import React from "react";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import Loader from "../../components/Layout/Loader";
import UserCell from "../../components/common/UserCell";
import { formatTableDate, STATUT_COLOR_CONFIG } from "../../utils/helpers";

const Recents = ({ loading = false, receptions = [] }) => {
  return (
    <div className="card border shadow-sm rounded-4 bg-body mb-4">
      {/* Header de la carte */}
      <div className="card-header bg-transparent border-0 pt-4 px-4 pb-2 d-flex align-items-center justify-content-between">
        <div>
          <h5 className="mb-1 fw-bold tracking-tight">Dernières réceptions</h5>
          <p className="mb-0 text-muted small">
            Les 10 derniers véhicules enregistrés à l'entrée
          </p>
        </div>
        <Link
          to="/receptions"
          className="btn btn-sm btn-body border rounded-pill px-3 fw-medium text-primary"
        >
          Voir tout <i className="fa fa-arrow-right ms-1 small"></i>
        </Link>
      </div>

      {/* Corps de la carte */}
      <div className="card-body px-4 pb-4">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <Loader />
          </div>
        ) : (
          <Table
            hover
            responsive
            align="middle"
            className="mb-0 table-borderless fs-6"
          >
            <thead className="table-body rounded-3 text-muted small text-uppercase tracking-wider">
              <tr>
                <th scope="col" className="ps-3 py-3">
                  ID
                </th>
                <th scope="col" className="py-3">
                  Véhicule
                </th>
                <th scope="col" className="py-3">
                  Reçu par
                  {/* (Gardien) */}
                </th>
                <th scope="col" className="py-3">
                  Motif de visite
                </th>
                <th scope="col" className="py-3 text-center">
                  Statut
                </th>
                <th scope="col" className="py-3 text-end pe-3">
                  Arrivée
                </th>
              </tr>
            </thead>
            <tbody>
              {receptions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <i className="fa fa-inbox fa-2x mb-2 d-block text-black-50"></i>
                    Aucune réception enregistrée pour le moment.
                  </td>
                </tr>
              ) : (
                receptions.map((item) => {
                  const status = STATUT_COLOR_CONFIG[item.statut] || {
                    label: item.statut,
                    bg: "body",
                  };
                  return (
                    <tr
                      key={item.id}
                      // onClick={() => navigate(`/reception/${item.id}`)}
                      style={{ cursor: "pointer" }}
                      className="align-middle"
                    >
                      {/* ID formaté en badge discret */}
                      <td className="ps-3">
                        <span className="badge bg-body text-secondary border fw-medium px-2 py-1">
                          #{String(item.id).padStart(4, "0")}
                        </span>
                      </td>

                      {/* Identité Véhicule */}
                      <td>
                        <div className="d-flex align-items-center">
                          <div>
                            <span className="fw-semibold d-block text-body">
                              {item.vehicule?.marque || "Inconnu"}
                            </span>
                            <span className="text-muted small">
                              {item.vehicule?.modele || "—"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Gardien / Responsable */}
                      <td>
                        <UserCell
                          user={item.cree_par || item.creePar || item.gardien || item.user}
                          size={32}
                          showSubtitle={false}
                          fallback="Non assigné"
                        />
                      </td>

                      {/* Motif de visite avec troncature CSS propre */}
                      <td style={{ maxWidth: "220px" }}>
                        <div
                          className="text-truncate text-secondary"
                          title={item.motif_visite}
                        >
                          {item.motif_visite || "Aucun motif spécifié"}
                        </div>
                      </td>

                      {/* Statut au format moderne (Subtle / Pastel) */}
                      <td className="text-center">
                        <span
                          className={`badge bg-${status.bg}-subtle text-${status.bg} border border-${status.bg}-subtle px-2.5 py-1.5 rounded-pill fw-semibold`}
                          style={{ fontSize: "0.8rem" }}
                        >
                          {status.label}
                        </span>
                      </td>

                      {/* Date d'arrivée */}
                      <td className="text-end pe-3 text-secondary font-monospace small text-capitalize">
                        {formatTableDate(item.date_arrivee || item.created_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Recents;
