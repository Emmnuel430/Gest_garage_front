import React from "react";
import Pagination from "../Layout/Pagination";
import { Table } from "react-bootstrap";

const PretsOutilsTable = ({
  prets = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onEditPret,
  onRestituerPret,
  actionLoading = false,
}) => {
  return (
    <div className="card p-3 shadow-sm">
      <h5 className="mb-3">
        <i className="fas fa-clipboard-list me-2 text-primary"></i> Liste des
        prêts d'outils
      </h5>
      <div className="table-responsive">
        <Table hover align="middle" className="mb-0 fs-6">
          <thead>
            <tr>
              <th>ID</th>
              <th>Outil</th>
              <th>Véhicule</th>
              <th>Mécanicien</th>
              <th>Quantité</th>
              <th>Statut</th>
              <th>Partagé</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prets.length > 0 ? (
              prets.map((pret) => (
                <tr key={pret.id}>
                  <td className="ps-3">
                    <span className="badge bg-body text-secondary border fw-medium px-2 py-1">
                      #{String(pret.id).padStart(4, "0")}
                    </span>
                  </td>
                  <td>
                    <strong>{pret.outil?.libelle || "-"}</strong>
                    <br />
                    <small className="text-muted">
                      {pret.outil?.reference}
                    </small>
                  </td>
                  <td>
                    <span className="badge bg-dark border text-white font-monospace text-uppercase me-2 px-2 py-1">
                      {pret?.reparation?.reception?.vehicule?.immatriculation ||
                        "N/A"}
                    </span>
                    <br />
                    <small className="text-muted">
                      ({pret?.reparation?.reception?.vehicule?.marque || "N/A"}{" "}
                      {pret?.reparation?.reception?.vehicule?.modele || ""})
                    </small>
                  </td>
                  <td>
                    {pret.mecanicien?.prenom.trim().split(" ")[0] || "-"}{" "}
                    <span className="text-uppercase fw-bold">
                      {pret.mecanicien?.nom || "-"}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-secondary fs-6">
                      {pret.quantite}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        pret.statut === "restitue"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      } text-uppercase`}
                    >
                      {pret.statut === "prete" ? "En cours" : "Restitué"}
                    </span>
                  </td>
                  <td>
                    {pret.est_partage ? (
                      <span className="badge bg-info-subtle text-info border border-info-subtle">
                        <i className="fas fa-share-alt me-1"></i> Oui
                      </span>
                    ) : (
                      <span className="text-muted">Non</span>
                    )}
                  </td>
                  <td>
                    {pret.statut === "prete" ? (
                      <div className="d-flex gap-1 justify-content-center">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => onEditPret?.(pret)}
                          disabled={actionLoading}
                          title="Modifier la quantité prêtée"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => onRestituerPret?.(pret)}
                          disabled={actionLoading}
                          title="Restituer l'outil"
                        >
                          <i className="fas fa-check me-1"></i> Restituer
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted small">Restitué</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  Aucun prêt trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default PretsOutilsTable;
