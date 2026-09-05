import { Table } from "react-bootstrap";
import moment from "moment";
import { getStatus } from "../../../utils/helpers";

const FactureTable = ({
  factures = [],
  onShowDetails,
  onOpenPayment,
  onGenerate,
}) => {
  const sortedFactures = [...factures].sort((a, b) => {
    const ordreStatut = {
      en_attente: 0,
      generee: 1,
      payee: 2,
    };

    const statutDiff =
      (ordreStatut[a.statut] ?? 99) - (ordreStatut[b.statut] ?? 99);

    if (statutDiff !== 0) return statutDiff;

    return new Date(b.created_at) - new Date(a.created_at);
  });

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

            <th scope="col" className="py-3 text-center">
              Statut
            </th>

            <th scope="col" className="py-3">
              Date de génération
            </th>

            <th scope="col" className="py-3 text-end pe-3">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedFactures.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-5 text-muted">
                <i className="fas fa-file-invoice-dollar fa-2x mb-2 d-block text-black-50"></i>
                Aucune facture trouvée.
              </td>
            </tr>
          ) : (
            sortedFactures.map((facture) => {
              const status = getStatus(facture.statut);

              const vehicule = facture.reception?.vehicule;

              return (
                <tr
                  key={facture.id}
                  className="align-middle"
                  onClick={() => onShowDetails(facture)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {/* ID */}
                  <td className="ps-3">
                    <span className="badge bg-body text-secondary border fw-medium px-2 py-1">
                      #{String(facture.id).padStart(4, "0")}
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

                  {/* Statut */}
                  <td className="text-center">
                    <span
                      className={`badge bg-${status.color}-subtle text-${
                        status.color
                      } border border-${status.color}-subtle px-2.5 py-1.5 rounded-pill fw-semibold`}
                      style={{
                        fontSize: "0.8rem",
                      }}
                    >
                      <i className={`fas ${status.icon} me-1`}></i>

                      {status.label}
                    </span>
                  </td>

                  {/* Date */}
                  <td>
                    {facture.date_generation ? (
                      <div className="text-secondary small">
                        <span className="fw-semibold d-block">
                          {moment(facture.date_generation).format("DD/MM/YYYY")}
                        </span>

                        <span className="text-muted">
                          {moment(facture.date_generation).format("HH:mm")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted small fst-italic">
                        Non générée
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="text-end pe-3">
                    <div
                      className="d-flex justify-content-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Voir */}
                      <button
                        type="button"
                        onClick={() => onShowDetails(facture)}
                        className="btn btn-body border btn-sm rounded-circle"
                        title="Voir les détails"
                        style={{
                          width: "34px",
                          height: "34px",
                        }}
                      >
                        <i className="fas fa-eye text-secondary"></i>
                      </button>

                      {/* Générer */}
                      {facture.statut === "en_attente" && (
                        <button
                          type="button"
                          onClick={() => onGenerate(facture)}
                          className="btn btn-body border btn-sm rounded-circle"
                          title="Générer la facture"
                          style={{
                            width: "34px",
                            height: "34px",
                          }}
                        >
                          <i className="fas fa-file-invoice text-primary"></i>
                        </button>
                      )}

                      {/* Payer / valider */}
                      {facture.statut === "generee" && (
                        <button
                          type="button"
                          onClick={() => onOpenPayment(facture)}
                          className="btn btn-body border btn-sm rounded-circle"
                          title="Enregistrer le paiement"
                          style={{
                            width: "34px",
                            height: "34px",
                          }}
                        >
                          <i className="fas fa-check text-success"></i>
                        </button>
                      )}

                      {/* Facture payée */}
                      {facture.statut === "payee" && (
                        <span
                          className="d-flex align-items-center justify-content-center text-success"
                          title="Facture payée"
                          style={{
                            width: "34px",
                            height: "34px",
                          }}
                        >
                          <i className="fas fa-check-circle"></i>
                        </span>
                      )}
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

export default FactureTable;
