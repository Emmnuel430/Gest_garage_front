import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatRole } from "../../utils/helpers";
import UserCell from "../common/UserCell";
import { ROLE_COLORS } from "../../constants/RoleColors";

const UserTable = ({
  users = [],
  currentUserId,
  selectedUserIds = [],
  onToggleSelectAll,
  onToggleSelectUser,
  onDelete,
}) => {
  const selectableUsers = users.filter((user) => user.id !== currentUserId);

  const isAllSelected =
    selectableUsers.length > 0 &&
    selectableUsers.every((user) => selectedUserIds.includes(user.id));

  return (
    <div className="table-responsive">
      <Table hover align="middle" className="mb-0 fs-6">
        <thead className="table-body rounded-3 text-muted small text-uppercase tracking-wider">
          <tr>
            {/* Sélection globale */}
            <th scope="col" className="ps-3 py-3" style={{ width: "45px" }}>
              <input
                type="checkbox"
                className="form-check-input"
                onChange={onToggleSelectAll}
                checked={isAllSelected}
                title="Tout sélectionner"
              />
            </th>

            <th scope="col" className="py-3">
              ID
            </th>

            <th scope="col" className="py-3">
              Utilisateur
            </th>

            <th scope="col" className="py-3">
              Pseudo
            </th>

            <th scope="col" className="py-3 text-center">
              Rôle
            </th>

            <th scope="col" className="py-3 text-end pe-3">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-5 text-muted">
                <i className="fas fa-users fa-2x mb-2 d-block text-black-50"></i>
                Aucun utilisateur trouvé.
              </td>
            </tr>
          ) : (
            users.map((user) => {
              const isCurrentUser = user.id === currentUserId;

              return (
                <tr
                  key={user.id}
                  className={`align-middle ${
                    isCurrentUser ? "bg-body-tertiary" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td className="ps-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => onToggleSelectUser(user.id)}
                      disabled={isCurrentUser}
                      title={
                        isCurrentUser
                          ? "Vous ne pouvez pas sélectionner votre propre compte"
                          : "Sélectionner cet utilisateur"
                      }
                    />
                  </td>

                  {/* ID */}
                  <td>
                    <span className="badge bg-body text-secondary border fw-medium px-2 py-1">
                      #{String(user.id).padStart(4, "0")}
                    </span>
                  </td>

                  {/* Utilisateur */}
                  <td>
                    <UserCell
                      user={user}
                      size={34}
                      subtitle={user.email || "Utilisateur"}
                      isCurrentUser={isCurrentUser}
                    />
                  </td>

                  {/* Pseudo */}
                  <td>
                    {user.pseudo ? (
                      <span className="font-monospace text-secondary">
                        @{user.pseudo}
                      </span>
                    ) : (
                      <span className="text-muted small">Non renseigné</span>
                    )}
                  </td>

                  {/* Rôle */}
                  <td className="text-center">
                    <span
                      className={`badge ${
                        ROLE_COLORS[user.role] || "bg-secondary"
                      } border rounded-pill px-3 py-2 fw-semibold`}
                      style={{ fontSize: "0.78rem" }}
                    >
                      {formatRole(user.role)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="text-end pe-3">
                    <div className="d-flex justify-content-end gap-2">
                      {/* Modifier */}
                      <Link
                        to={`/update/user/${user.id}`}
                        className="btn btn-body border btn-sm rounded-circle"
                        title="Modifier l'utilisateur"
                        style={{
                          width: "34px",
                          height: "34px",
                        }}
                      >
                        <i className="fas fa-pencil-alt text-warning"></i>
                      </Link>

                      {/* Supprimer */}
                      {!isCurrentUser && (
                        <button
                          type="button"
                          onClick={() => onDelete(user)}
                          className="btn btn-body border btn-sm rounded-circle"
                          title="Supprimer l'utilisateur"
                          style={{
                            width: "34px",
                            height: "34px",
                          }}
                        >
                          <i className="fas fa-trash text-danger"></i>
                        </button>
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

export default UserTable;
