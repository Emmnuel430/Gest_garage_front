// Importation des dépendances nécessaires
import React, { useState } from "react";
import "../../assets/css/Home.css"; // Importation du fichier CSS pour la mise en page
import HomeScript from "../../assets/js/HomeScript"; // Importation d'un script personnalisé pour la page
import loginImage from "../../assets/img/user.png"; // Importation d'une image pour le profil utilisateur
import { useNavigate, Link } from "react-router-dom"; // Importation de 'useNavigate' et 'Link' pour la navigation
import logo from "../../assets/img/logo.png"; // Importation du logo de l'application.
import Sidebar from "./Sidebar"; // Importation du composant Sidebar
import ThemeSwitcher from "../others/ThemeSwitcher"; // Importation du composant ThemeSwitcher
import ConfirmPopup from "./ConfirmPopup"; // Importation du composant ConfirmPopup
import { fetchWithToken } from "../../utils/fetchWithToken";
import useIdleLogout from "../../utils/useIdleLogout";
import { formatRole } from "../../utils/helpers";
import Avatar from "./Avatar";

// Définition du composant Layout qui sera utilisé comme un modèle de page (avec du contenu dynamique via 'children')
const Layout = ({ children }) => {
  useIdleLogout(20); // Déconnexion après 15 minutes d'inactivité

  // Récupération des informations de l'utilisateur depuis le sessionStorage (si elles existent)
  let user = JSON.parse(sessionStorage.getItem("user-info"));
  const [load, setLoad] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Utilisation de 'useNavigate' pour effectuer des redirections dans l'application
  const navigate = useNavigate();

  // Fonction de déconnexion qui efface les informations de l'utilisateur du sessionStorage et redirige vers la page de connexion
  async function logOut() {
    try {
      setLoad(true);
      await fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/logout`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    } finally {
      setLoad(false);
      setShowLogoutModal(false);
      // Nettoyage et redirection
      sessionStorage.clear();
      navigate("/");
    }
  }

  return (
    <div className="container-fluid position-relative bg-body d-flex p-0">
      {/* Sidebar affichée sur le côté gauche */}
      <Sidebar user={user} />

      {/* Main content - Contenu principal de la page */}
      <div className="content shifted bg-body">
        {/* Navbar en haut de la page */}
        <nav className="navbar navbar-expand bg-body navbar-body sticky-top px-4 py-0">
          {/* Logo ou icône en version mobile */}
          <Link to="/home" className="navbar-brand d-flex d-lg-none me-4">
            <img
              src={logo} // Affichage du logo de l'application
              alt="Logo"
              width="40"
              height="40"
            />
          </Link>
          {/* Bouton pour basculer l'affichage de la sidebar */}
          <button
            className="sidebar-toggle flex-shrink-0 text-primary"
            style={{
              border: "none",
              zIndex: 1000,
              background: "none",
              fontSize: "1.5rem",
            }}
          >
            <i className="fa fa-bars"></i>
          </button>

          {/* Section de la barre de navigation avec notifications et messages */}
          <div className="navbar-nav align-items-center ms-auto">
            {/* Changement de thème */}
            <ThemeSwitcher />

            {/* Section pour afficher l'image de profil et permettre la déconnexion */}
            {user && (
              <div className="nav-item dropdown">
                <Link
                  href="#"
                  className="nav-link dropdown-toggle d-flex align-items-center py-0"
                  data-bs-toggle="dropdown"
                >
                  {/* Utilisation de notre nouveau composant Avatar */}
                  <Avatar
                    firstName={user.first_name || user.username}
                    lastName={user.last_name}
                    size={38}
                    className="me-2"
                    role={user.role}
                  />

                  {/* Informations de l'utilisateur */}
                  <div className="d-none d-sm-flex flex-column text-start lh-sm">
                    <span className="text-body fw-bold text-capitalize small">
                      {user.first_name}
                      <span className="text-uppercase ms-1">
                        {user.last_name}
                      </span>
                    </span>
                    <span
                      className="text-muted text-uppercase"
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: "600",
                        trackingWidth: "0.5px",
                      }}
                    >
                      {formatRole(user.role)}
                    </span>
                  </div>
                </Link>

                {/* Menu déroulant avec design moderne */}
                <div className="dropdown-menu dropdown-menu-end bg-body border shadow-sm rounded-3 mt-2 m-0 p-2">
                  <button
                    type="button"
                    className="dropdown-item text-danger rounded-2 d-flex align-items-center gap-2 fw-medium"
                    onClick={() => setShowLogoutModal(true)}
                    disabled={load}
                  >
                    {load ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Déconnexion en cours...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Déconnexion</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Contenu dynamique de la page, qui sera fourni par le parent (via 'children') */}
        <div className="p-2 min-vh-100">{children}</div>
        <div className="footer px-4 pt-4 mt-5">
          <div className="bg-body">
            <div className="row small">
              <div className="col-12 col-sm-6 text-center text-sm-start">
                &copy; {new Date().getFullYear()}{" "}
                <a
                  href="https://mon-portofolio-pearl.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gest
                </a>
                , AsNumeric - J/E. Tous droits réservés.
              </div>
              <div className="col-12 col-sm-6 text-center text-sm-end text-muted ">
                Designed By{" "}
                <a
                  href="https://mon-portofolio-pearl.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Joel E. Daho
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de déconnexion */}
      <ConfirmPopup
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logOut}
        title="Confirmer la déconnexion"
        body={<p>Êtes-vous sûr de vouloir vous déconnecter ?</p>}
        btnColor="danger"
      />

      {/* Bouton de retour en haut de la page */}
      <button className="btn btn-lg btn-primary btn-lg-square back-to-top hide">
        <i className="bi bi-arrow-up"></i>
      </button>

      {/* Script spécifique à la page Home */}
      <HomeScript />
    </div>
  );
};

export default Layout;
