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
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-body border-bottom py-3 px-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 className="mb-0 fs-6 fw-bold text-body d-flex align-items-center">
          <i className="fas fa-clipboard-list me-2 text-primary"></i>
          Suivi des prêts d'outils
        </h5>
        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1">
          {prets.length} prêt{prets.length > 1 ? "s" : ""} affiché{prets.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="table-responsive">
        <Table hover align="middle" className="mb-0 align-middle">
          <thead className="table-light border-bottom">
            <tr className="text-secondary small text-uppercase">
              <th style={{ width: "80px" }}>ID</th>
              <th style={{ minWidth: "220px", maxWidth: "320px" }}>Outil</th>
              <th style={{ minWidth: "180px" }}>Véhicule concerné</th>
              <th style={{ minWidth: "160px" }}>Mécanicien</th>
              <th style={{ width: "80px" }} className="text-center">Qté</th>
              <th style={{ width: "110px" }} className="text-center">Statut</th>
              <th style={{ width: "110px" }} className="text-center">Affectation</th>
              <th style={{ minWidth: "170px" }} className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prets.length > 0 ? (
              prets.map((pret) => {
                const vehicule = pret?.reparation?.reception?.vehicule;
                const isSpecial = Boolean(pret.outil?.est_special);
                const isShared = Boolean(pret.est_partage);
                const isActive = pret.statut === "prete";

                return (
                  <tr key={pret.id} className={!isActive ? "opacity-75" : ""}>
                    {/* ID */}
                    <td>
                      <span className="badge bg-body text-secondary border font-monospace px-2 py-1">
                        #{String(pret.id).padStart(4, "0")}
                      </span>
                    </td>

                    {/* Outil & Spécial */}
                    <td>
                      <div className="d-flex flex-column align-items-start gap-1">
                        <span
                          className="fw-bold text-body text-break text-wrap"
                          style={{ maxWidth: "300px", lineHeight: "1.3" }}
                          title={pret.outil?.libelle || "-"}
                        >
                          {pret.outil?.libelle || "-"}
                        </span>
                        <div className="d-flex align-items-center gap-1 flex-wrap">
                          {pret.outil?.reference && (
                            <span className="badge bg-secondary-subtle text-secondary border font-monospace small">
                              {pret.outil.reference}
                            </span>
                          )}
                          {isSpecial && (
                            <span className="badge bg-warning text-dark border border-warning-subtle rounded-pill small">
                              <i className="fas fa-star me-1 text-dark"></i>
                              Spécial : {Number(pret.outil.prix_par_heure || 0).toLocaleString()} FCFA/h
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Véhicule */}
                    <td>
                      <div className="d-flex flex-column align-items-start gap-1">
                        <span className="badge bg-dark border text-white font-monospace text-uppercase px-2 py-1">
                          <i className="fas fa-car me-1 text-secondary"></i>
                          {vehicule?.immatriculation || "N/A"}
                        </span>
                        <small className="text-muted text-break">
                          {vehicule?.marque || ""} {vehicule?.modele || ""}
                        </small>
                      </div>
                    </td>

                    {/* Mécanicien */}
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <i className="fas fa-user-gear text-secondary"></i>
                        <div>
                          <div className="fw-semibold text-body small">
                            {pret.mecanicien?.prenom || ""}{" "}
                            <span className="text-uppercase">
                              {pret.mecanicien?.nom || "-"}
                            </span>
                          </div>
                          {pret.mecanicien?.type && (
                            <small className="text-muted" style={{ fontSize: "0.72rem" }}>
                              {pret.mecanicien.type}
                            </small>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Quantité */}
                    <td className="text-center">
                      <span className="badge bg-secondary-subtle text-body border px-2 py-1 fs-6">
                        {pret.quantite}
                      </span>
                    </td>

                    {/* Statut */}
                    <td className="text-center">
                      {isActive ? (
                        <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1">
                          <i className="fas fa-clock me-1"></i> En cours
                        </span>
                      ) : (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                          <i className="fas fa-check-circle me-1"></i> Restitué
                        </span>
                      )}
                    </td>

                    {/* Affectation / Partage */}
                    <td className="text-center">
                      {isShared ? (
                        <span
                          className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1"
                          title="Outil utilisé simultanément sur plusieurs véhicules par ce mécanicien"
                        >
                          <i className="fas fa-share-nodes me-1"></i> Partagé
                        </span>
                      ) : (
                        <span className="text-muted small">Unique</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      {isActive ? (
                        <div className="d-flex gap-1 justify-content-center flex-wrap">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                            onClick={() => onEditPret?.(pret)}
                            disabled={actionLoading}
                            title="Gérer la quantité ou affecter également à un autre véhicule"
                          >
                            <i className="fas fa-sliders"></i>
                            <span className="d-none d-md-inline">Gérer</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
                            onClick={() => onRestituerPret?.(pret)}
                            disabled={actionLoading}
                            title="Restituer cet outil"
                          >
                            <i className="fas fa-arrow-rotate-left"></i>
                            <span className="d-none d-md-inline">Restituer</span>
                          </button>
                        </div>
                      ) : (
                        <span className="badge bg-light text-muted border small">
                          <i className="fas fa-check me-1 text-success"></i> Clos
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-5 text-muted">
                  <i className="fas fa-box-open fa-2x mb-3 d-block opacity-25"></i>
                  Aucun prêt d'outil trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <div className="card-footer bg-body border-top py-2 px-3">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default PretsOutilsTable;
