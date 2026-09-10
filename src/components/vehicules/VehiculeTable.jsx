import React from "react";
import { Table } from "react-bootstrap";

const VehiculeTable = ({
  vehicules = [],
  onShowDetails,
  onGenerateTicket,
}) => {
  const sortedVehicules = [...vehicules].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  const renderTicketStatus = (vehicule) => {
    const reception = vehicule.receptions?.[0];
    const facture = reception?.facture;
    const billetSortie = reception?.billet_sortie;

    if (!reception) {
      return <span className="text-muted small">Aucune réception</span>;
    }

    if (facture?.statut !== "payee") {
      return (
        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-3 py-2">
          Facture non réglée
        </span>
      );
    }

    if (billetSortie) {
      return (
        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2">
          <i className="fas fa-check-circle me-1"></i>
          Billet généré
        </span>
      );
    }

    return (
      <button
        type="button"
        className="btn btn-primary btn-sm d-flex align-items-center gap-2"
        onClick={() => onGenerateTicket(vehicule)}
        title="Générer le billet de sortie"
      >
        <i className="fas fa-file-invoice"></i>
        Générer billet
      </button>
    );
  };

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
              Mécanicien
            </th>
            <th scope="col" className="py-3 text-end pe-3">
              Billet de sortie
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedVehicules.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-5 text-muted">
                <i className="fas fa-car fa-2x mb-2 d-block text-black-50"></i>
                Aucun véhicule trouvé.
              </td>
            </tr>
          ) : (
            sortedVehicules.map((vehicule) => (
              <tr
                key={vehicule.id}
                className="align-middle"
                onClick={() => onShowDetails(vehicule)}
                style={{ cursor: "pointer" }}
              >
                <td className="ps-3">
                  <span className="badge bg-body text-secondary border fw-medium px-2 py-1">
                    #{String(vehicule.id).padStart(4, "0")}
                  </span>
                </td>
                <td>
                  <div>
                    <span className="fw-bold font-monospace text-body text-uppercase d-block">
                      {vehicule.immatriculation || "N/A"}
                    </span>
                    <span className="text-muted small">
                      {vehicule.marque || "Inconnu"} {vehicule.modele || ""}
                    </span>
                  </div>
                </td>
                <td>
                  {vehicule.mecanicien ? (
                    <span className="fw-semibold">
                      {vehicule.mecanicien.prenom?.split(" ")[0] || "N/A"}{" "}
                      <span className="text-uppercase">
                        {vehicule.mecanicien.nom || ""}
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted">Non assigné</span>
                  )}
                </td>
                <td className="text-end pe-3">
                  <div
                    className="d-flex justify-content-end align-items-center gap-2"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => onShowDetails(vehicule)}
                      className="btn btn-body border btn-sm rounded-circle"
                      title="Voir les détails"
                      style={{ width: "34px", height: "34px" }}
                    >
                      <i className="fas fa-eye text-secondary"></i>
                    </button>
                    {renderTicketStatus(vehicule)}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default VehiculeTable;
