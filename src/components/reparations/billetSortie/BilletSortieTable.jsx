import { Table } from "react-bootstrap";
import moment from "moment";
import UserCell from "../../common/UserCell";

const BilletSortieTable = ({ billets = [], onShowDetails }) => {
  const sortedBillets = [...billets].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  return (
    <div className="table-responsive">
      <Table hover align="middle" className="mb-0 table-borderless fs-6">
        <thead className="table-body rounded-3 text-muted small text-uppercase tracking-wider">
          <tr>
            <th scope="col" className="ps-3 py-3">
              ID
            </th>

            <th scope="col" className="py-3">
              Véhicule
            </th>

            <th scope="col" className="py-3">
              Enregistré par
            </th>

            <th scope="col" className="py-3">
              Date
            </th>

            <th scope="col" className="py-3 text-end pe-3">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedBillets.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-5 text-muted">
                <i className="fas fa-sign-out-alt fa-2x mb-2 d-block text-black-50"></i>
                Aucun billet de sortie trouvé.
              </td>
            </tr>
          ) : (
            sortedBillets.map((billet) => {
              const vehicule = billet.reception?.vehicule;

              const chefAtelier = billet.chef_atelier;

              return (
                <tr
                  key={billet.id}
                  className="align-middle"
                  onClick={() => onShowDetails(billet)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {/* ID */}
                  <td className="ps-3">
                    <span className="badge bg-body text-secondary border fw-medium px-2 py-1">
                      #{String(billet.id).padStart(4, "0")}
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

                  {/* Chef atelier */}
                  <td>
                    <UserCell
                      user={chefAtelier}
                      size={32}
                      fallback="Non renseigné"
                    />
                  </td>

                  {/* Date */}
                  <td>
                    <div className="text-secondary small">
                      <span className="fw-semibold d-block">
                        {moment(billet.created_at).format("DD/MM/YYYY")}
                      </span>

                      <span className="text-muted">
                        {moment(billet.created_at).format("HH:mm")}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="text-end pe-3">
                    <div
                      className="d-flex justify-content-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onShowDetails(billet)}
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

export default BilletSortieTable;
