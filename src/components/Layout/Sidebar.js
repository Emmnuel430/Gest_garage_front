import React from "react"; // Importation de React pour utiliser JSX et les fonctionnalités React.
import { Link } from "react-router-dom"; // Importation de Link pour la navigation.
import logo from "../../assets/img/logo.png"; // Importation du logo de l'application.
import SidebarLinks from "./SidebarLinks"; // Importation du composant SidebarLinks qui contient les liens de la barre latérale.
import { formatRole } from "../../utils/helpers";
import Avatar from "./Avatar";

const Sidebar = ({ user }) => {
  return (
    <div className="sidebar b-bar d-flex pb-3 bg-body">
      <div className="navbar bg-body navbar-body">
        {/* Partie logo et nom de l'application */}
        <Link
          to="/home"
          className="navbar-brand mx-4 mb-3 d-flex align-items-end"
        >
          <img
            src={logo} // Affichage du logo de l'application
            alt="Logo"
            className="bg-body"
            width="40"
            height="40"
          />
          <h3 className="m-0 ps-2 text-primary">
            {" "}
            {/* Affichage du titre "Gest" */}
            <strong>Gest v{process.env.REACT_APP_VERSION}</strong>
          </h3>
        </Link>
        {/* Section profil utilisateur */}
        <div className="d-flex align-items-center ms-4 mb-4">
          {user && (
            <>
              {/* Conteneur de l'Avatar avec la pastille connectée */}
              <div className="position-relative">
                <Avatar
                  firstName={user.first_name}
                  lastName={user.last_name}
                  role={user.role}
                  size={42}
                />
                {/* Indicateur de statut en ligne (Point vert) */}
                <span
                  className="bg-success rounded-circle border border-2 border-body position-absolute p-1"
                  style={{
                    bottom: "1px",
                    right: "1px",
                    transform: "translate(10%, 10%)",
                    width: "12px",
                    height: "12px",
                  }}
                ></span>
              </div>

              {/* Informations textuelles de l'utilisateur */}
              <div className="ms-3">
                <h6 className="mb-0 text-body text-capitalize">
                  {user.first_name ? user.first_name.trim().split(" ")[0] : ""}{" "}
                  <span className="text-uppercase fw-bold">
                    {user.last_name || ""}
                  </span>
                </h6>
                <span
                  className="text-muted small fw-medium text-uppercase"
                  style={{ fontSize: "0.75rem", trackingWidth: "0.5px" }}
                >
                  {user.role === "admin" ? (
                    formatRole(user.role)
                  ) : (
                    <div>
                      Staff <br /> ({formatRole(user.role)})
                    </div>
                  )}
                </span>
              </div>
            </>
          )}
        </div>
        {/* Inclure les liens de navigation */}
        <SidebarLinks user={user} />{" "}
        {/* Affichage des liens en fonction de l'utilisateur */}
      </div>
    </div>
  );
};

export default Sidebar; // Exportation du composant Sidebar pour qu'il soit utilisé ailleurs dans l'application.
