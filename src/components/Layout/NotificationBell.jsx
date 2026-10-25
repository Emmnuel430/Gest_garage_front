import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import { useNotifications } from "../../contexts/NotificationContext";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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

  // Icône et badge selon le type d'alerte
  const getTypeConfig = (type) => {
    switch (type) {
      case "success":
        return {
          icon: "fa-check-circle",
          badgeClass: "bg-success bg-opacity-10 text-success border-success",
        };
      case "warning":
        return {
          icon: "fa-triangle-exclamation",
          badgeClass: "bg-warning bg-opacity-15 text-warning border-warning",
        };
      case "danger":
        return {
          icon: "fa-circle-exclamation",
          badgeClass: "bg-danger bg-opacity-10 text-danger border-danger",
        };
      case "primary":
        return {
          icon: "fa-tools",
          badgeClass: "bg-primary bg-opacity-10 text-primary border-primary",
        };
      default:
        return {
          icon: "fa-circle-info",
          badgeClass: "bg-info bg-opacity-10 text-info border-info",
        };
    }
  };

  return (
    <div className="nav-item me-2 d-flex align-items-center">
      <style>{`
        .notification-bell-btn::after {
          display: none !important;
        }
        .notification-offcanvas {
          width: 80% !important;
          max-width: 440px !important;
        }
        @media (max-width: 576px) {
          .notification-offcanvas {
            width: 80% !important;
            max-width: 80% !important;
          }
        }
        .notif-item-unread {
          background-color: rgba(13, 110, 253, 0.08) !important;
          border-left: 4px solid #0d6efd !important;
        }
        [data-bs-theme="dark"] .notif-item-unread {
          background-color: rgba(13, 110, 253, 0.18) !important;
          border-left: 4px solid #3d8bfd !important;
        }
        .notif-item-read {
          border-left: 4px solid transparent !important;
          opacity: 0.85;
        }
        .notif-item-hover:hover {
          background-color: rgba(0, 0, 0, 0.04) !important;
          opacity: 1;
        }
        [data-bs-theme="dark"] .notif-item-hover:hover {
          background-color: rgba(255, 255, 255, 0.06) !important;
          opacity: 1;
        }
        .pulse-unread-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background-color: #0d6efd;
          box-shadow: 0 0 8px #0d6efd;
          display: inline-block;
        }
      `}</style>

      {/* Bouton cloche */}
      <button
        className="nav-link border-0 bg-transparent shadow-none d-flex align-items-center py-2 px-2"
        onClick={toggleSidebar}
        aria-label="Notifications"
        type="button"
        style={{ cursor: "pointer" }}
        title="Centre de notifications"
      >
        <span className="position-relative d-inline-flex align-items-center justify-content-center">
          <i className="fa fa-bell fs-5"></i>
          {unreadCount > 0 && (
            <span
              className="position-absolute badge rounded-pill bg-danger shadow-sm"
              style={{
                top: "-5px",
                right: "-7px",
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
        </span>
      </button>

      {/* Sidebar Offcanvas venant de la droite (80% width sur mobile, backdrop inclus) */}
      <Offcanvas
        show={isOpen}
        onHide={() => setIsOpen(false)}
        placement="end"
        className="notification-offcanvas shadow-lg"
        backdrop={true}
        scroll={false}
      >
        <Offcanvas.Header className="border-bottom border-secondary border-opacity-10 py-3 px-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="fa fa-bell text-primary"></i>
            <Offcanvas.Title className="fs-6 fw-bold mb-0">
              Notifications
            </Offcanvas.Title>
            {unreadCount > 0 && (
              <span
                className="badge rounded-pill bg-primary bg-opacity-15 text-primary border border-primary border-opacity-25"
                style={{ fontSize: "0.72rem" }}
              >
                {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="d-flex align-items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-sm btn-link text-decoration-none p-0 text-primary fw-medium"
                type="button"
                style={{ fontSize: "0.78rem" }}
                title="Tout marquer comme lu"
              >
                <i className="fas fa-check-double me-1"></i> Tout lire
              </button>
            )}
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-circle ms-1 p-0 d-flex align-items-center justify-content-center"
              style={{ width: "30px", height: "30px" }}
              onClick={() => setIsOpen(false)}
              aria-label="Fermer"
              title="Fermer"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </Offcanvas.Header>

        <Offcanvas.Body className="p-0 d-flex flex-column" style={{ overflowY: "auto" }}>
          <div className="list-group list-group-flush w-100">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted my-auto">
                <i className="fas fa-bell-slash fa-2x mb-3 d-block opacity-25"></i>
                <p className="small mb-1 fw-medium text-body">
                  Aucune notification pour le moment
                </p>
                <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                  Les alertes d'atelier et événements s'afficheront ici en direct.
                </span>
              </div>
            ) : (
              notifications.map((item) => {
                const { icon, badgeClass } = getTypeConfig(item.type);
                const isUnread = !item.read;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    role="button"
                    className={`list-group-item list-group-item-action py-3 px-3 border-bottom border-secondary border-opacity-10 text-start notif-item-hover ${
                      isUnread
                        ? "notif-item-unread"
                        : "notif-item-read bg-transparent"
                    }`}
                    style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                  >
                    {/* Ligne 1 : Titre + Type + Statut non lu + Heure */}
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span
                          className={`badge rounded-pill border px-2 py-1 ${badgeClass} d-inline-flex align-items-center gap-1`}
                          style={{ fontSize: "0.68rem", fontWeight: "600" }}
                        >
                          <i className={`fas ${icon}`}></i>
                          {item.title}
                        </span>
                        {isUnread && (
                          <span
                            className="pulse-unread-dot"
                            title="Nouvelle notification non lue"
                          ></span>
                        )}
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}
                        >
                          {item.created_at}
                        </small>
                        {isUnread && (
                          <button
                            type="button"
                            className="btn btn-sm btn-link p-0 text-muted"
                            style={{ fontSize: "0.8rem", lineHeight: 1 }}
                            onClick={(e) => handleIndividualMarkRead(e, item.id)}
                            title="Marquer comme lu"
                          >
                            <i className="fas fa-check text-primary"></i>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Ligne 2 : Message complet sans débordement */}
                    <div
                      className={`mt-2 ${
                        isUnread ? "text-body fw-semibold" : "text-body-secondary"
                      }`}
                      style={{
                        fontSize: "0.82rem",
                        lineHeight: "1.45",
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {item.message}
                    </div>

                    {/* Ligne 3 : Indicateur d'action cliquable si un lien est configuré */}
                    {item.action_url && (
                      <div className="mt-2 d-flex justify-content-end">
                        <span
                          className="badge bg-secondary bg-opacity-15 text-primary border border-primary border-opacity-20 d-inline-flex align-items-center gap-1"
                          style={{ fontSize: "0.68rem" }}
                        >
                          Accéder <i className="fas fa-arrow-right"></i>
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
