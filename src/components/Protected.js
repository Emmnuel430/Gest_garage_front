import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Protected = ({ Cmp, adminOnly = false, roles = [] }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("user-info");

    if (!userInfo) {
      navigate("/");
      return;
    }

    const user = JSON.parse(userInfo);

    const checkUserInDB = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/user/${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unauthorized");
          // Interdit
        }

        const data = await response.json();
        const currentUser = data.user;

        if (
          !currentUser ||
          currentUser.id !== user.id ||
          currentUser.pseudo !== user.pseudo
        ) {
          throw new Error("Invalid user data");
        }

        // Vérification adminOnly
        if (adminOnly && currentUser.role !== "super_admin") {
          navigate("/access-denied");
          return;
        }

        // Vérifie si le rôle est autorisé
        if (roles.length > 0 && !roles.includes(currentUser.role)) {
          navigate("/access-denied");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        // Token invalide, utilisateur supprimé, etc.
        localStorage.removeItem("user-info");
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    checkUserInDB();
  }, [adminOnly, navigate, roles]);

  return <>{isAuthorized ? <Cmp /> : null}</>;
};

export default Protected;
