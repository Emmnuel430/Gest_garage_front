import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import routes from "../../routeConfig";

const SidebarLinks = ({ user }) => {
  const location = useLocation();

  const activeLinkRef = useRef(null);
  // Déclenche le scroll automatique vers l'élément actif au chargement initial ou changement d'URL
  useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({
        behavior: "smooth", // "smooth" pour une animation fluide, "auto" pour un saut instantané
        block: "nearest", // Aligne l'élément seulement s'il n'est pas déjà visible dans la zone de scroll
      });
    }
  }, [location.pathname]); // S'exécute à chaque changement de page

  if (!user) return null;

  const getOrderValue = (value, fallback = Number.MAX_SAFE_INTEGER) => {
    return typeof value === "number" && Number.isFinite(value)
      ? value
      : fallback;
  };

  const hasRole = (allowedRoles = []) => {
    if (!allowedRoles?.length) return true;
    return allowedRoles.includes(user?.role);
  };

  const isActive = (link) => {
    if (link?.match?.length) {
      return link.match.includes(location.pathname);
    }

    return location.pathname === link?.to;
  };

  // copie du tableau pour ne pas modifier l'original
  const routeSidebarGroups = [...routes]
    // garde seulement les routes de la sidebar
    .filter((route) => route.sidebar)
    // mémorise leur position d'origine
    .map((route, index) => ({ ...route, originalIndex: index }))
    .sort((a, b) => {
      // Tri par ordre de groupe croissant
      const groupOrderDiff =
        getOrderValue(a.groupOrder, 999) - getOrderValue(b.groupOrder, 999);
      if (groupOrderDiff !== 0) return groupOrderDiff;

      // Tri par ordre de lien croissant
      const orderDiff =
        getOrderValue(a.order, 999) - getOrderValue(b.order, 999);
      if (orderDiff !== 0) return orderDiff;

      // Si les deux (liens) sont égaux, on garde l'ordre d'origine
      return a.originalIndex - b.originalIndex;
    })
    .reduce((groups, route) => {
      // On regroupe les routes par groupe
      const groupKey = route.group || "main";
      const group = groups.find((item) => item.title === groupKey);
      const link = {
        label: route.label,
        to: route.path,
        icon: route.icon,
        roles: route.roles,
        className: route.className,
        match: route.match,
        order: route.order,
        originalIndex: route.originalIndex,
      };

      // Si le groupe existe déjà, on ajoute le lien à ce groupe,
      if (group) {
        group.links.push(link);
      } else {
        //  sinon on crée un nouveau groupe
        groups.push({
          title: route.group === "main" ? null : route.group,
          groupOrder: getOrderValue(route.groupOrder, 999),
          originalIndex: route.originalIndex,
          links: [link],
        });
      }

      return groups;
    }, []);

  // On trie les groupes créés par ordre de groupe croissant, puis par ordre d'origine
  const orderedGroups = [...routeSidebarGroups].sort((a, b) => {
    const groupOrderDiff = (a.groupOrder ?? 999) - (b.groupOrder ?? 999);
    if (groupOrderDiff !== 0) return groupOrderDiff;

    return a.originalIndex - b.originalIndex;
  });

  return (
    <div className="navbar-nav w-100">
      {orderedGroups.map((group, groupIndex) => {
        const visibleLinks = group.links
          .filter((link) => hasRole(link.roles))
          .sort((a, b) => {
            const orderDiff =
              getOrderValue(a.order, 999) - getOrderValue(b.order, 999);
            if (orderDiff !== 0) return orderDiff;

            return a.originalIndex - b.originalIndex;
          });

        if (!visibleLinks.length) return null;

        return (
          <div key={groupIndex} className="w-100">
            {group.title && (
              <h6 className="text-uppercase text-muted ps-3 mt-3 mb-2">
                {group.title}
              </h6>
            )}

            {visibleLinks.map((link, index) => {
              const isCurrentActive = isActive(link);

              return (
                <Link
                  key={`${group.title || "main"}-${index}`}
                  to={link.to}
                  ref={isCurrentActive ? activeLinkRef : null}
                  className={`${link.className || "nav-link d-flex align-items-center"} ${
                    isCurrentActive ? "active bg-body-secondary fw-bold" : ""
                  }`}
                >
                  <div className="d-flex align-items-center">
                    <i className={`fa fa-${link.icon} me-2`}></i>
                    <span className="text-body">{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default SidebarLinks;
