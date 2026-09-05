import { Table } from "react-bootstrap";

const MecanicienTable = ({
  mecaniciens = [],
  onShowDetails,
  onEdit,
  onDelete,
  formatPhoneNumber,
}) => {
  const getTypeConfig = (type) => {
    const types = {
      interne: {
        label: "Interne",
        color: "success",
        icon: "fa-user-check",
      },
      externe: {
        label: "Externe",
        color: "info",
        icon: "fa-user-tie",
      },
    };

    return (
      types[type] || {
        label: type || "Non renseigné",
        color: "secondary",
        icon: "fa-question",
      }
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
              Mécanicien
            </th>

            <th scope="col" className="py-3 text-center">
              Type
            </th>

            <th scope="col" className="py-3">
              Contact
            </th>

            <th scope="col" className="py-3 text-end pe-3">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {mecaniciens.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-5 text-muted">
                <i className="fas fa-user-cog fa-2x mb-2 d-block text-black-50"></i>
                Aucun mécanicien trouvé.
              </td>
            </tr>
          ) : (
            mecaniciens.map((mecanicien) => {
              const type = getTypeConfig(mecanicien.type);

              return (
                <tr
                  key={mecanicien.id}
                  className="align-middle"
                  onClick={() => onShowDetails(mecanicien)}
                  style={{ cursor: "pointer" }}
                >
                  {/* ID */}
                  <td className="ps-3">
                    <span className="badge bg-body text-secondary border fw-medium px-2 py-1">
                      MEC-{String(mecanicien.id).padStart(4, "0")}
                    </span>
                  </td>

                  {/* Identité */}
                  <td>
                    <div className="d-flex align-items-center">
                      <div
                        className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                        style={{
                          width: "36px",
                          height: "36px",
                          flexShrink: 0,
                        }}
                      >
                        {mecanicien.prenom?.charAt(0)?.toUpperCase()}
                        {mecanicien.nom?.charAt(0)?.toUpperCase()}
                      </div>

                      <div className="ms-2">
                        <span className="fw-semibold d-block text-body">
                          {mecanicien.prenom || ""} {mecanicien.nom || ""}
                        </span>

                        <span className="text-muted small">Mécanicien</span>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="text-center">
                    <span
                      className={`badge bg-${type.color}-subtle text-${type.color} border border-${type.color}-subtle rounded-pill px-3 py-2 fw-semibold`}
                      style={{ fontSize: "0.8rem" }}
                    >
                      <i className={`fas ${type.icon} me-1`}></i>
                      {type.label}
                    </span>
                  </td>

                  {/* Contact */}
                  <td>
                    {mecanicien.contact ? (
                      <div className="d-flex align-items-center gap-2">
                        <i className="fas fa-phone-alt text-muted small"></i>

                        <span className="text-secondary">
                          {formatPhoneNumber(mecanicien.contact)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted small">Non renseigné</span>
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
                        onClick={() => onShowDetails(mecanicien)}
                        className="btn btn-body border btn-sm rounded-circle"
                        title="Voir les détails"
                        style={{ width: "34px", height: "34px" }}
                      >
                        <i className="fas fa-eye text-secondary"></i>
                      </button>

                      {/* Modifier */}
                      <button
                        type="button"
                        onClick={() => onEdit(mecanicien)}
                        className="btn btn-body border btn-sm rounded-circle"
                        title="Modifier le mécanicien"
                        style={{ width: "34px", height: "34px" }}
                      >
                        <i className="fas fa-pencil-alt text-warning"></i>
                      </button>

                      {/* Supprimer */}
                      <button
                        type="button"
                        onClick={() => onDelete(mecanicien)}
                        className="btn btn-body border btn-sm rounded-circle"
                        title="Supprimer le mécanicien"
                        style={{ width: "34px", height: "34px" }}
                      >
                        <i className="fas fa-trash text-danger"></i>
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

export default MecanicienTable;
