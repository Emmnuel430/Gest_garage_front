import { Table } from "react-bootstrap";
import Pagination from "../Layout/Pagination";

const OutilsTable = ({
  outils,
  selectedId,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="card shadow-sm h-100">
      {/* Header */}
      <div className="card-header bg-transparent border-bottom px-3 py-3">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div>
            <h6 className="mb-0 fw-bold">Liste des outils</h6>

            <small className="text-muted">
              Gérez les outils disponibles dans le garage
            </small>
          </div>

          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2">
            {outils.length} outil{outils.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="table-responsive">
        <Table hover align="middle" className="mb-0 fs-6">
          <thead className="table-body text-muted small text-uppercase">
            <tr>
              <th className="ps-3 py-3">ID</th>
              <th className="py-3">Outil</th>
              <th className="py-3">Référence</th>
              <th className="py-3 text-center">Stock</th>
              <th className="py-3 text-end pe-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {outils.length > 0 ? (
              outils.map((outil) => {
                const isEditing = outil.id === selectedId;

                return (
                  <tr
                    key={outil.id}
                    className={`align-middle ${
                      isEditing
                        ? "bg-primary bg-opacity-10 border-start border-2 border-primary shadow-sm"
                        : ""
                    }`}
                    style={{
                      transition: "background-color 0.2s ease",
                    }}
                    onClick={() => onEdit(outil)}
                  >
                    {/* ID */}
                    <td className="ps-3">
                      <span className="badge bg-body text-secondary border fw-medium px-2 py-1">
                        #{String(outil.id).padStart(4, "0")}
                      </span>
                    </td>

                    {/* Libellé */}
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: "36px",
                            height: "36px",
                          }}
                        >
                          <i className="fas fa-tools"></i>
                        </div>

                        <span className="fw-semibold text-body">
                          {outil.libelle}
                        </span>
                      </div>
                    </td>

                    {/* Référence */}
                    <td>
                      <span className="font-monospace text-secondary small">
                        {outil.reference}
                      </span>
                    </td>

                    {/* Quantité */}
                    <td className="text-center">
                      <span
                        className={`badge rounded-pill px-3 py-2 ${
                          outil.quantite > 0
                            ? "bg-success-subtle text-success border border-success-subtle"
                            : "bg-danger-subtle text-danger border border-danger-subtle"
                        }`}
                      >
                        <i className="fas fa-cubes me-1"></i>
                        {outil.quantite}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="text-end pe-3">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          className={`btn btn-sm rounded-circle border ${
                            isEditing ? "btn-primary" : "btn-body"
                          }`}
                          onClick={() => onEdit(outil)}
                          title={
                            isEditing ? "Modification en cours" : "Modifier"
                          }
                          style={{
                            width: "34px",
                            height: "34px",
                          }}
                        >
                          <i
                            className={`fas ${
                              isEditing ? "fa-check" : "fa-edit text-warning"
                            }`}
                          ></i>
                        </button>

                        <button
                          type="button"
                          className="btn btn-body border btn-sm rounded-circle"
                          onClick={() => onDelete(outil)}
                          title="Supprimer"
                          style={{
                            width: "34px",
                            height: "34px",
                          }}
                        >
                          <i className="fas fa-trash text-danger"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted">
                  <i className="fas fa-tools fa-2x mb-3 d-block text-black-50"></i>

                  <span className="fw-medium d-block">Aucun outil trouvé</span>

                  <small>Commencez par ajouter un outil au stock.</small>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="card-footer bg-transparent border-top">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default OutilsTable;
