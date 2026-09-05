import React from "react";
import Avatar from "../../components/Layout/Avatar";

const InfosUtilisateur = () => {
  const user = JSON.parse(sessionStorage.getItem("user-info"));

  if (!user) return <p>Utilisateur non connecté</p>;

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
              <Avatar
                firstName={user.first_name}
                lastName={user.last_name}
                role={user.role}
                size={120}
              />
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
