import React from "react";
import Avatar from "../Layout/Avatar";
import { formatRole } from "../../utils/helpers";

/**
 * Récupère l'utilisateur connecté depuis le sessionStorage.
 */
const getCurrentUser = () => {
  try {
    const raw = sessionStorage.getItem("user-info");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

/**
 * Compare un objet utilisateur avec l'utilisateur connecté.
 */
const checkIsCurrentUser = (user, currentUser) => {
  if (!user || !currentUser) return false;

  // Comparaison par ID si disponible
  if (user.id != null && currentUser.id != null) {
    return String(user.id) === String(currentUser.id);
  }

  // Comparaison par email si disponible
  if (user.email && currentUser.email) {
    return (
      user.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase()
    );
  }

  // Comparaison par pseudo / username
  const uPseudo = user.pseudo || user.username;
  const cPseudo = currentUser.pseudo || currentUser.username;
  if (
    uPseudo &&
    cPseudo &&
    uPseudo.trim().toLowerCase() === cPseudo.trim().toLowerCase()
  ) {
    return true;
  }

  // Comparaison par prénom et nom
  const firstName = (user.first_name || user.prenom || "").trim().toLowerCase();
  const lastName = (user.last_name || user.nom || "").trim().toLowerCase();
  const cFirstName = (currentUser.first_name || currentUser.prenom || "")
    .trim()
    .toLowerCase();
  const cLastName = (currentUser.last_name || currentUser.nom || "")
    .trim()
    .toLowerCase();

  if (
    firstName &&
    lastName &&
    firstName === cFirstName &&
    lastName === cLastName
  ) {
    return true;
  }

  return false;
};

/**
 * Composant réutilisable UserCell pour afficher un avatar et les infos d'un utilisateur.
 */
const UserCell = ({
  user,
  size = 32,
  subtitle,
  showSubtitle = true,
  showAvatar = true,
  fallback = "Non assigné",
  isCurrentUser: isCurrentUserProp,
  className = "",
}) => {
  if (!user) {
    if (typeof fallback === "string") {
      return <span className="text-muted">{fallback}</span>;
    }
    return fallback;
  }

  const currentUser = getCurrentUser();
  const isSelf =
    isCurrentUserProp !== undefined
      ? isCurrentUserProp
      : checkIsCurrentUser(user, currentUser);

  const firstName = user.first_name || user.prenom || "";
  const lastName = user.last_name || user.nom || "";

  // Rendu du nom
  const renderName = () => {
    if (isSelf) {
      return "Moi";
    }

    const trimmedFirstName = firstName.trim().split(" ")[0] || "";
    const uppercaseLastName = lastName.trim();

    return (
      <>
        {trimmedFirstName}{" "}
        {uppercaseLastName && (
          <span className="text-uppercase">{uppercaseLastName}</span>
        )}
      </>
    );
  };

  // Rendu du sous-titre (rôle / email / sous-titre personnalisé)
  const renderSubtitle = () => {
    if (!showSubtitle) return null;
    if (subtitle !== undefined) return subtitle;
    if (user.role) return formatRole(user.role);
    if (user.email) return user.email;
    return null;
  };

  const subtitleContent = renderSubtitle();

  return (
    <div className={`d-flex align-items-center ${className}`.trim()}>
      {showAvatar && (
        <Avatar
          firstName={firstName || "?"}
          lastName={lastName}
          role={user.role}
          size={size}
        />
      )}

      <div className="ms-2">
        <span className="fw-semibold d-block text-body">{renderName()}</span>

        {subtitleContent && (
          <span className="text-muted small d-block">{subtitleContent}</span>
        )}
      </div>
    </div>
  );
};

export default UserCell;
