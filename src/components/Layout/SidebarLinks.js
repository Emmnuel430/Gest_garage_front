import React from "react";
import { Link, useLocation } from "react-router-dom";
// import { useState } from "react"; // Importation de useState pour gérer l'état local
// import useRappelCount from "../hooks/useRappelCount";

const SidebarLinks = ({ user }) => {
  /* const [isGestionOpen, setGestionOpen] = useState(false);
  const [isDocsOpen, setDocsOpen] = useState(false);
  const [isPersonnesOpen, setPersonnesOpen] = useState(false); */
  const location = useLocation();
  if (!user) return null;

  const isActive = (path) => location.pathname === path;
  /* const isGestionTechniqueActive = () => {
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
  const togglePersonnes = () => setPersonnesOpen(!isPersonnesOpen); */

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

      {hasRole([
        "gardien",
        "secretaire",
        "chef_atelier",
        "super_admin",
        "caisse",
      ]) && (
        <>
          {hasRole([
            "gardien",
            "secretaire",
            "chef_atelier",
            "super_admin",
          ]) && (
            <Link
              to="/receptions"
              className={`nav-link d-flex align-items-center ${
                isActive("/receptions")
                  ? "active bg-body-secondary fw-bold"
                  : ""
              }`}
            >
              <i className="fa fa-car me-2"></i>
              <span className="text-body">Réceptions de véhicules</span>
            </Link>
          )}

          {hasRole(["secretaire", "super_admin"]) && (
            <Link
              to="/check-reception"
              className={`nav-link d-flex align-items-center ${
                isActive("/check-reception")
                  ? "active bg-body-secondary fw-bold"
                  : ""
              }`}
            >
              <i className="fa fa-check-circle me-2"></i>
              <span className="text-body">Vérification véhicule</span>
            </Link>
          )}

          {hasRole(["secretaire", "chef_atelier", "super_admin"]) && (
            <Link
              to="/chronos"
              className={`nav-link d-flex align-items-center ${
                isActive("/chronos") ? "active bg-body-secondary fw-bold" : ""
              }`}
            >
              <i className="fa fa-stopwatch me-2"></i>
              <span className="text-body">Chronos</span>
            </Link>
          )}

          {hasRole(["chef_atelier", "super_admin"]) && (
            <Link
              to="/reparations"
              className={`nav-link d-flex align-items-center ${
                isActive("/reparations")
                  ? "active bg-body-secondary fw-bold"
                  : ""
              }`}
            >
              <i className="fa fa-wrench me-2"></i>
              <span className="text-body">Réparations</span>
            </Link>
          )}
        </>
      )}

      {hasRole(["chef_atelier", "super_admin"]) && (
        <Link
          to="/billets-sortie"
          className={`nav-link d-flex align-items-center ${
            isActive("/billets-sortie")
              ? "active bg-body-secondary fw-bold"
              : ""
          }`}
        >
          <i className="fa fa-receipt me-2"></i>
          <span className="text-body">Billets de sortie</span>
        </Link>
      )}

      {hasRole(["caisse", "super_admin"]) && (
        <Link
          to="/factures"
          className={`nav-link d-flex align-items-center ${
            isActive("/factures") ? "active bg-body-secondary fw-bold" : ""
          }`}
        >
          <i className="fa fa-file-invoice-dollar me-2"></i>
          <span className="text-body">Factures</span>
        </Link>
      )}

      <Link
        to="/vehicules"
        className={`nav-link d-flex align-items-center ${
          isActive("/vehicules") ? "active bg-body-secondary fw-bold" : ""
        }`}
      >
        <i className="fa fa-car-side me-2"></i>
        <span className="text-body">Archives des véhicules</span>
      </Link>

      {hasRole(["super_admin", "secretaire"]) && (
        <>
          <Link
            to="/mecaniciens"
            className={`nav-link d-flex align-items-center ${
              isActive("/mecaniciens") ? "active bg-body-secondary fw-bold" : ""
            }`}
          >
            <i className="fa fa-user-cog me-2"></i>
            <span className="text-body">Mécaniciens</span>
          </Link>

          {hasRole(["super_admin"]) && (
            <Link
              to="/utilisateurs"
              className={`nav-link d-flex align-items-center ${
                isActive("/utilisateurs")
                  ? "active bg-body-secondary fw-bold"
                  : ""
              }`}
            >
              <i className="fa fa-user-friends me-2"></i>
              <span className="text-body">Utilisateurs</span>
            </Link>
          )}
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
