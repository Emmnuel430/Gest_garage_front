import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Protected = ({ Cmp, adminOnly = false, roles = [] }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const excludedPaths = ["/", "/logout"];
    if (excludedPaths.includes(window.location.pathname)) return;

    const token = sessionStorage.getItem("token");
    const userInfo = sessionStorage.getItem("user-info");
    const user = userInfo ? JSON.parse(userInfo) : null;

    if (!token || !user) {
      sessionStorage.clear();
      navigate("/");
      return;
    }

    const checkUserInDB = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`, // Utilisation du token
            },
          },
        );

        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.json();
        const currentUser = data.user;
        if (
          !currentUser ||
          currentUser.id !== user.id ||
          currentUser.pseudo !== user.pseudo
        ) {
          throw new Error("Invalid user data");
        }

        // Vérification si adminOnly est activé
        if (adminOnly && currentUser.role !== "admin") {
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
        sessionStorage.clear();
        navigate("/");
      }
    };

    checkUserInDB();
  }, [adminOnly, navigate, roles]);

  return <>{isAuthorized ? <Cmp /> : null}</>;
};

export default Protected;
