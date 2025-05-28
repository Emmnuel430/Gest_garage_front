import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react"; // Importation de useState pour gérer l'état local
// import useRappelCount from "../hooks/useRappelCount";

const SidebarLinks = ({ user }) => {
  const [isGestionOpen, setGestionOpen] = useState(false);
  const [isDocsOpen, setDocsOpen] = useState(false);
  const [isPersonnesOpen, setPersonnesOpen] = useState(false);
  const location = useLocation();
  if (!user) return null;

  const isActive = (path) => location.pathname === path;
  const isGestionTechniqueActive = () => {
    const routes = [
      "/receptions",
      "/check-reception",
      "/chronos",
      "/reparations",
    ];
    return routes.some((route) => isActive(route));
  };
  const isDocumentsActive = () => {
    const routes = ["/billets-sortie", "/factures", "/vehicules"];
    return routes.some((route) => isActive(route));
  };

  const toggleGestion = () => setGestionOpen(!isGestionOpen);
  const toggleDocs = () => setDocsOpen(!isDocsOpen);
  const togglePersonnes = () => setPersonnesOpen(!isPersonnesOpen);

  const hasRole = (allowedRoles) => allowedRoles.includes(user?.role);

  return (
    <div className="navbar-nav w-100">
      {/* Dashboard - accessible à tous */}
      <Link
        to="/home"
        className={`nav-item nav-link ${
          isActive("/home") ? "active bg-body-secondary fw-bold" : ""
        }`}
      >
        <div>
          <i className="fa fa-home me-2"></i>
          <span className="text-body">Dashboard</span>
        </div>
      </Link>

      {/* Gestion technique */}
      {hasRole([
        "gardien",
        "secretaire",
        "chef_atelier",
        "super_admin",
        "caisse",
      ]) && (
        <>
          <button
            className={`nav-link d-flex align-items-center btn text-start w-100 ${
              isGestionTechniqueActive()
                ? "active bg-body-secondary fw-bold"
                : ""
            }}`}
            onClick={toggleGestion}
            aria-expanded={isGestionOpen}
            aria-controls="gestionTechniqueMenu"
          >
            <i className="fa fa-tools me-2"></i>
            <span className="text-body">
              {" "}
              Gestion <br />
              technique
            </span>
            <i className="fa fa-caret-down float-end ms-auto"></i>
          </button>

          <div
            className={`collapse ps-3 ${isGestionOpen ? "show" : ""}`}
            id="gestionTechniqueMenu"
          >
            {hasRole([
              "gardien",
              "secretaire",
              "chef_atelier",
              "super_admin",
            ]) && (
              <Link
                to="/receptions"
                className="nav-link d-flex align-items-center"
              >
                <i className="fa fa-car me-2"></i>{" "}
                <span className="text-body">
                  Réceptions <br /> de véhicules
                </span>
              </Link>
            )}
            {hasRole(["secretaire", "super_admin"]) && (
              <Link
                to="/check-reception"
                className="nav-link d-flex align-items-center"
              >
                <i className="fa fa-check-circle me-2"></i>{" "}
                <span className="text-body">Vérification véhicule</span>
              </Link>
            )}
            {hasRole(["secretaire", "chef_atelier", "super_admin"]) && (
              <Link
                to="/chronos"
                className="nav-link d-flex align-items-center"
              >
                <i className="fa fa-stopwatch me-2"></i>{" "}
                <span className="text-body">Chronos</span>
              </Link>
            )}
            {hasRole(["chef_atelier", "super_admin"]) && (
              <Link
                to="/reparations"
                className="nav-link d-flex align-items-center"
              >
                <i className="fa fa-wrench me-2"></i>{" "}
                <span className="text-body">Réparations</span>
              </Link>
            )}
          </div>
        </>
      )}

      {/* Documents */}
      <>
        <button
          className={`nav-link d-flex align-items-center btn text-start w-100 ${
            isDocumentsActive() ? "active bg-body-secondary fw-bold" : ""
          }`}
          onClick={toggleDocs}
          aria-expanded={isDocsOpen}
          aria-controls="documentsMenu"
        >
          <i className="fa fa-folder-open me-2"></i>
          <span className="text-body">Documents</span>
          <i className="fa fa-caret-down float-end ms-auto"></i>
        </button>

        <div
          className={`collapse ps-3 ${isDocsOpen ? "show" : ""}`}
          id="documentsMenu"
        >
          {hasRole(["chef_atelier", "super_admin"]) && (
            <Link
              to="/billets-sortie"
              className="nav-link d-flex align-items-center"
            >
              <i className="fa fa-receipt me-2"></i>{" "}
              <span className="text-body">Billets de sortie</span>
            </Link>
          )}
          {hasRole(["caisse", "super_admin"]) && (
            <Link to="/factures" className="nav-link d-flex align-items-center">
              <i className="fa fa-file-invoice-dollar me-2"></i>{" "}
              <span className="text-body">Factures</span>
            </Link>
          )}
          <Link
            to="/vehicules"
            className={`nav-link d-flex align-items-center`}
          >
            <i className="fa fa-car-side me-2"></i>

            <span className="text-body">
              Archives <br /> des véhicules
            </span>
          </Link>
        </div>
      </>

      {/* Gestion des personnes */}
      {hasRole(["super_admin", "secretaire"]) && (
        <>
          <button
            className="nav-link d-flex align-items-center btn text-start w-100"
            onClick={togglePersonnes}
            aria-expanded={isPersonnesOpen}
            aria-controls="gestionPersonnesMenu"
          >
            <i className="fa fa-users me-2"></i>
            <span className="text-body">
              Gestion des <br />
              personnes
            </span>
            <i className="fa fa-caret-down float-end ms-auto"></i>
          </button>

          <div
            className={`collapse ms-3 ${isPersonnesOpen ? "show" : ""}`}
            id="gestionPersonnesMenu"
          >
            {hasRole(["super_admin", "secretaire"]) && (
              <Link to="/mecaniciens" className="nav-link">
                <i className="fa fa-user-cog me-2"></i>{" "}
                <span className="text-body">Mécaniciens</span>
              </Link>
            )}
            {hasRole(["super_admin"]) && (
              <Link to="/utilisateurs" className="nav-link">
                <i className="fa fa-user-friends me-2"></i>{" "}
                <span className="text-body">Utilisateurs</span>
              </Link>
            )}
          </div>
        </>
      )}

      {/* Logs - Super Admin */}
      {user.role === "super_admin" && (
        <Link
          to="/logs"
          className={`nav-item nav-link  ${
            isActive("/logs") ? "active bg-body-secondary fw-bold" : ""
          }`}
        >
          <div>
            <i className="fa fa-file-alt me-2"></i>
            <span className="text-body">Logs</span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default SidebarLinks;
