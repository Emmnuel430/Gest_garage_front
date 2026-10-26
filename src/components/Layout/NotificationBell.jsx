import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import { useNotifications } from "../../contexts/NotificationContext";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all' ou 'unread'

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNotificationClick = (item) => {
    setIsOpen(false);
    if (!item.read) {
      markAsRead(item.id);
    }
    if (item.action_url) {
      navigate(item.action_url);
    }
  };

  const handleIndividualMarkRead = (e, id) => {
    e.stopPropagation();
    markAsRead(id);
  };

  // Configuration sémantique Bootstrap 5.3 : contrastes élevés et adaptatifs Dark / Light
  const getTypeConfig = (type) => {
    switch (type) {
      case "success":
        return {
          icon: "fa-check-circle",
          badgeClass: "bg-success-subtle text-success-emphasis border-success-subtle",
        };
      case "warning":
        return {
          icon: "fa-triangle-exclamation",
          badgeClass: "bg-warning-subtle text-warning-emphasis border-warning-subtle",
        };
      case "danger":
        return {
          icon: "fa-circle-exclamation",
          badgeClass: "bg-danger-subtle text-danger-emphasis border-danger-subtle",
        };
      case "primary":
        return {
          icon: "fa-tools",
          badgeClass: "bg-primary-subtle text-primary-emphasis border-primary-subtle",
        };
      default:
        return {
          icon: "fa-circle-info",
          badgeClass: "bg-info-subtle text-info-emphasis border-info-subtle",
        };
    }
  };

  // Liste filtrée selon l'onglet actif
  const displayedNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  return (
    <div className="nav-item me-2 d-flex align-items-center">
      <style>{`
        .notification-bell-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: background-color 0.2s ease, color 0.2s ease;
          color: var(--bs-body-color);
        }
        .notification-bell-btn:hover {
          background-color: var(--bs-tertiary-bg);
          color: var(--bs-primary);
        }
        .notification-offcanvas {
          width: 80% !important;
          min-width: 290px;
          max-width: 420px !important;
          background-color: var(--bs-body-bg) !important;
          color: var(--bs-body-color) !important;
        }
        @media (min-width: 576px) {
          .notification-offcanvas {
            width: 420px !important;
            max-width: 420px !important;
          }
        }
        .notif-card {
          border-left: 3px solid transparent;
          transition: background-color 0.2s ease, border-color 0.2s ease;
          background-color: transparent;
        }
        .notif-card-unread {
          border-left-color: var(--bs-primary) !important;
          background-color: rgba(var(--bs-primary-rgb), 0.06) !important;
        }
        [data-bs-theme="dark"] .notif-card-unread {
          border-left-color: #3d8bfd !important;
          background-color: rgba(61, 139, 253, 0.14) !important;
        }
        .notif-card:hover {
          background-color: var(--bs-tertiary-bg) !important;
        }
        .pulse-unread-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--bs-primary);
          box-shadow: 0 0 6px var(--bs-primary);
          display: inline-block;
          flex-shrink: 0;
        }
        .nav-pill-tab {
          font-size: 0.76rem;
          padding: 4px 10px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .nav-pill-tab.active {
          background-color: var(--bs-primary);
          color: #ffffff !important;
          font-weight: 600;
        }
        .nav-pill-tab:not(.active) {
          background-color: var(--bs-secondary-bg);
          color: var(--bs-body-color);
        }
        .nav-pill-tab:not(.active):hover {
          background-color: var(--bs-tertiary-bg);
        }
      `}</style>

      {/* Bouton cloche dans la navbar */}
      <button
        className="btn notification-bell-btn border-0 p-0 d-flex align-items-center justify-content-center position-relative shadow-none"
        onClick={toggleSidebar}
        aria-label="Centre de notifications"
        type="button"
        title="Centre de notifications"
      >
        <i className="fa fa-bell fs-5"></i>
        {unreadCount > 0 && (
          <span
            className="position-absolute badge rounded-pill bg-danger shadow-sm border border-body"
            style={{
              top: "2px",
              right: "2px",
              fontSize: "0.62rem",
              padding: "2px 5px",
              minWidth: "16px",
              lineHeight: "1",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
            <span className="visually-hidden">notifications non lues</span>
          </span>
        )}
      </button>

      {/* Sidebar Offcanvas latérale (droite) */}
      <Offcanvas
        show={isOpen}
        onHide={() => setIsOpen(false)}
        placement="end"
        className="notification-offcanvas shadow-lg"
        backdrop={true}
        scroll={false}
      >
        {/* Entête Offcanvas multi-lignes parfaitement aligné */}
        <Offcanvas.Header className="border-bottom py-3 px-3 d-flex flex-column align-items-stretch gap-2 bg-body">
          {/* Rangée 1 : Titre principal, badge compteur et bouton de fermeture */}
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="d-flex align-items-center gap-2">
              <i className="fa fa-bell text-primary fs-5"></i>
              <Offcanvas.Title className="fs-6 fw-bold mb-0 text-body">
                Notifications
              </Offcanvas.Title>
              {unreadCount > 0 && (
                <span
                  className="badge rounded-pill bg-primary-subtle text-primary-emphasis border border-primary-subtle"
                  style={{ fontSize: "0.72rem" }}
                >
                  {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <button
              type="button"
              className="btn-close text-reset shadow-none"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer"
              title="Fermer"
            ></button>
          </div>

          {/* Rangée 2 : Onglets de filtrage et bouton Tout lire */}
          <div className="d-flex align-items-center justify-content-between w-100 pt-1 flex-wrap gap-2">
            <div className="d-flex align-items-center gap-1">
              <button
                type="button"
                className={`btn nav-pill-tab ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                Toutes ({notifications.length})
              </button>
              <button
                type="button"
                className={`btn nav-pill-tab ${activeTab === "unread" ? "active" : ""}`}
                onClick={() => setActiveTab("unread")}
              >
                Non lues ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-sm btn-link text-decoration-none p-0 text-primary fw-semibold d-inline-flex align-items-center gap-1"
                type="button"
                style={{ fontSize: "0.78rem" }}
                title="Marquer toutes les notifications comme lues"
              >
                <i className="fas fa-check-double"></i>
                <span>Tout lire</span>
              </button>
            )}
          </div>
        </Offcanvas.Header>

        {/* Corps défilant des notifications */}
        <Offcanvas.Body className="p-0 d-flex flex-column" style={{ overflowY: "auto" }}>
          <div className="list-group list-group-flush w-100 border-0">
            {displayedNotifications.length === 0 ? (
              <div className="p-4 text-center my-auto">
                {activeTab === "unread" ? (
                  <>
                    <i className="fas fa-check-circle fa-2x mb-3 d-block text-success opacity-75"></i>
                    <p className="small mb-1 fw-bold text-body">
                      Vous êtes à jour
                    </p>
                    <span className="text-body-secondary" style={{ fontSize: "0.78rem" }}>
                      Aucune notification non lue pour le moment.
                    </span>
                    <div className="mt-3">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary rounded-pill"
                        style={{ fontSize: "0.76rem" }}
                        onClick={() => setActiveTab("all")}
                      >
                        Afficher toutes les notifications
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <i className="fas fa-bell-slash fa-2x mb-3 d-block text-body-tertiary"></i>
                    <p className="small mb-1 fw-bold text-body">
                      Aucune notification
                    </p>
                    <span className="text-body-secondary" style={{ fontSize: "0.78rem" }}>
                      Les alertes d'atelier et événements s'afficheront ici en direct.
                    </span>
                  </>
                )}
              </div>
            ) : (
              displayedNotifications.map((item) => {
                const { icon, badgeClass } = getTypeConfig(item.type);
                const isUnread = !item.read;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    role="button"
                    className={`list-group-item list-group-item-action py-3 px-3 border-bottom text-start notif-card ${
                      isUnread ? "notif-card-unread" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    {/* En-tête de carte : Type & Titre à gauche, Heure & Action lecture à droite */}
                    <div className="d-flex justify-content-between align-items-center mb-1 gap-2">
                      <div className="d-flex align-items-center gap-2 flex-wrap min-w-0">
                        <span
                          className={`badge rounded-pill border px-2 py-1 ${badgeClass} d-inline-flex align-items-center gap-1`}
                          style={{ fontSize: "0.70rem", fontWeight: "600" }}
                        >
                          <i className={`fas ${icon}`}></i>
                          <span>{item.title}</span>
                        </span>
                        {isUnread && (
                          <span
                            className="pulse-unread-dot"
                            title="Nouvelle notification non lue"
                          ></span>
                        )}
                      </div>

                      <div className="d-flex align-items-center gap-2 flex-shrink-0">
                        <small
                          className="text-body-secondary"
                          style={{ fontSize: "0.72rem", whiteSpace: "nowrap" }}
                        >
                          {item.created_at}
                        </small>
                        {isUnread && (
                          <button
                            type="button"
                            className="btn btn-sm btn-link p-0 text-body-secondary text-hover-primary"
                            style={{ fontSize: "0.82rem", lineHeight: 1 }}
                            onClick={(e) => handleIndividualMarkRead(e, item.id)}
                            title="Marquer comme lu"
                            aria-label="Marquer comme lu"
                          >
                            <i className="fas fa-check text-primary"></i>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Corps du message avec typographie contrastée et retour à la ligne maîtrisé */}
                    <div
                      className={`mt-2 ${
                        isUnread ? "text-body fw-medium" : "text-body-secondary"
                      }`}
                      style={{
                        fontSize: "0.84rem",
                        lineHeight: "1.45",
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {item.message}
                    </div>

                    {/* Pied de carte : Bouton interactif si un lien d'action est renseigné */}
                    {item.action_url && (
                      <div className="mt-2 pt-1 d-flex justify-content-end">
                        <span
                          className="btn btn-sm btn-outline-primary rounded-pill py-0 px-2 d-inline-flex align-items-center gap-1"
                          style={{ fontSize: "0.74rem" }}
                        >
                          Consulter <i className="fas fa-arrow-right"></i>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default NotificationBell;
