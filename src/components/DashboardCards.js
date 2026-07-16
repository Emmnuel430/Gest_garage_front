import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";

export default function DashboardCards({
  userInfo,
  facturesImpayees,
  logs,
  chronosEnCours,
  formatDateRelative,
  getActionColor,
  getActionLabel,
}) {
  const navigate = useNavigate();

  const cards = [
    {
      key: "factures",
      visible: ["super_admin", "caisse"].includes(userInfo?.role),
      link_visibility: facturesImpayees.length > 0,
      title: "Factures impayées",
      link:
        (["super_admin", "caisse"].includes(userInfo?.role) && "/factures") ||
        null,
      content: (
        <>
          {facturesImpayees.length > 0 ? (
            facturesImpayees
              .slice(0, 3) // Limite à 3 factures
              .map((facture, index) => (
                <div
                  key={index}
                  className={`d-flex align-items-center border shadow-sm rounded p-3 mb-2 
                          border-danger bg-danger-subtle
                      `}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate(`/factures`);
                  }}
                >
                  <i
                    className={`bi
                              bi-exclamation-triangle-fill text-danger
                          `}
                    style={{ fontSize: "2rem" }}
                  ></i>
                  <div className="w-100 ms-3">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className={`mb-0 fw-bold text-danger`}>
                        {userInfo?.role === "super_admin" ||
                        userInfo?.role === "caisse" ? (
                          <>
                            La facture du véhicule{" "}
                            <strong>
                              {facture.reception?.vehicule?.immatriculation}
                            </strong>{" "}
                            n'a pas encore été réglée !
                          </>
                        ) : (
                          <>
                            Vous n'avez pas les droits pour voir les factures.
                          </>
                        )}
                      </h6>
                      <small className="text-muted">
                        {formatDateRelative(facture.date_generation)}
                      </small>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center text-muted h-100 d-flex align-items-center justify-content-center">
              Tout baigne pour l'instant. Personne ne doit.
            </div>
          )}
        </>
      ),
    },
    {
      key: "logs",
      visible: userInfo?.role === "super_admin",
      link_visibility: logs.length > 0,
      title: "Logs",
      link: "/logs",
      content: (
        <div className="d-flex flex-column align-items-center">
          {userInfo?.role === "super_admin" ? (
            logs.length > 0 ? (
              <>
                <Table hover className="centered-table w-100">
                  <tbody>
                    {logs.map((log, index) => (
                      <tr key={index}>
                        <td>
                          <span
                            className={`${getActionColor(
                              log.action
                            )} text-uppercase text-white rounded-pill px-2 py-1`}
                          >
                            {getActionLabel(log.action)}
                          </span>
                        </td>
                        <td className="text-capitalize">
                          {log.table_concernee}
                        </td>
                        <td>{formatDateRelative(log.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <div className="text-center text-muted h-100 d-flex align-items-center justify-content-center">
                Aucun log disponible.
              </div>
            )
          ) : (
            <div className="text-center text-danger h-100 d-flex align-items-center justify-content-center">
              Vous n'avez pas les droits pour voir les logs.
            </div>
          )}
        </div>
      ),
    },
    {
      key: "chronos",
      visible: true,
      link_visibility: chronosEnCours.length > 0,
      title: "Chronos en cours",
      link: userInfo?.role !== "gardien" ? "/chronos" : null,
      content:
        chronosEnCours.length > 0 ? (
          chronosEnCours.map((chrono, index) => (
            <div
              key={index}
              className="d-flex align-items-center border-bottom w-100 pb-1 mb-2"
            >
              <i
                className={`fa fa-clock text-warning`}
                style={{ fontSize: "2rem" }}
              ></i>
              <div className="w-100 ms-3">
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <p className="mb-0">
                    <span>Debut : </span>
                    {formatDateRelative(chrono.start_time)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted h-100 d-flex align-items-center justify-content-center">
            Aucun chrono en cours.
          </div>
        ),
    },
  ];

  const visibleCards = cards.filter((c) => c.visible);
  const cardCount = visibleCards.length;

  const getColClass = () => {
    if (cardCount === 1) return "col-12 col-md-6 d-flex justify-content-center";
    if (cardCount === 2) return "col-12 col-md-6 col-xl-5";
    return "col-12 col-md-6 col-xl-4";
  };

  return (
    <div className="row g-4 justify-content-center">
      {visibleCards.map((card) => (
        <div key={card.key} className={getColClass()}>
          <div className="h-100 bg-body rounded border p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="mb-0">{card.title}</h6>
              {card.link && card.link_visibility && (
                <Link to={card.link}>Voir</Link>
              )}
            </div>
            <div className="mb-2">{card.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
