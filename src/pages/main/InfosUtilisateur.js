import React from "react";

const InfosUtilisateur = () => {
  const user = JSON.parse(localStorage.getItem("user-info"));

  if (!user) return <p>Utilisateur non connecté</p>;

  // Icône selon le rôle (tu peux adapter ici)
  const renderIcon = () => {
    switch (user.role) {
      case "super_admin":
        return <i className="fa fa-user-shield fa-3x text-primary"></i>;
      case "secretaire":
        return <i className="fa fa-user-edit fa-3x text-primary"></i>;
      case "chef_atelier":
        return <i className="fa fa-tools fa-3x text-primary"></i>;
      case "caissier":
        return <i className="fa fa-cash-register fa-3x text-primary"></i>;
      case "gardien":
        return <i className="fa fa-warehouse fa-3x text-primary"></i>;
      default:
        return <i className="fa fa-user fa-3x text-primary"></i>;
    }
  };

  return (
    <div className="card card-style1 border my-2">
      <div className="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
        <div className="row align-items-center">
          {/* Section : Icône */}
          <div className="col-lg-6 mb-4 mb-lg-0 text-center">
            <div
              className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle"
              style={{ width: "120px", height: "120px" }}
            >
              {renderIcon()}
            </div>
          </div>

          {/* Section : Infos de l'utilisateur */}
          <div className="col-lg-6 px-xl-10">
            <div className="d-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
              <h3 className="h2 text-primary mb-0 text-capitalize">
                {user.last_name} {user.first_name}
              </h3>
              <h6 className="h4 text-primary mb-0 text-capitalize">
                Rôle : {user.role.replace("_", " ")}
              </h6>
            </div>

            <ul className="list-unstyled mb-1-9 mt-3">
              <li className="mb-2 display-28">
                <span className="text-secondary me-2 font-weight-600">
                  Pseudo :
                </span>
                {user.pseudo}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfosUtilisateur;
