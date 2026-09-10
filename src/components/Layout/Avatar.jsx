import React from "react";
import { ROLE_COLORS } from "../../constants/RoleColors";

const Avatar = ({ firstName, lastName, role, size = 40, className = "" }) => {
  const initiale = firstName ? firstName.trim()[0].toUpperCase() : "?";

  // Récupère la couleur associée au rôle, ou une valeur par défaut
  const colorClass =
    ROLE_COLORS[role] || "bg-dark-subtle text-dark border-dark-subtle";

  return (
    <div
      className={`rounded-circle d-flex align-items-center justify-content-center fw-bold border shadow-sm ${colorClass} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `clamp(10px, ${size * 0.38}px, 50px)`,
        flexShrink: 0, // Évite que l'avatar s'écrase si le texte est long
      }}
      title={`${firstName || ""} ${lastName || ""} (${role || "Sans rôle"})`.trim()}
    >
      {initiale}
    </div>
  );
};

export default Avatar;
