// components/HeaderWithFilter.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function HeaderWithFilter({
  title,
  title2,
  link,
  linkText,
  linkText2,
  onLinkClick,
  main, // Le total des lignes
  // Props pour les Filtres
  filter,
  setFilter,
  filterOptions = [],
  // Props pour le Tri
  sortOption,
  setSortOption,
  hasAlphaSort, // booléen pour afficher l'option alpha
  hasDateSort, // booléen pour afficher l'option date
}) {
  const hasFilters = filterOptions?.length > 0;
  const hasSorting = Boolean(setSortOption);

  return (
    <div className="mb-4">
      {/* Section Supérieure : Titre & Actions */}
      <div className="row align-items-center g-3 mb-3">
        <div className="col-12 col-sm-auto me-sm-auto">
          {(title || title2) && (
            <h1>{title ? `Liste des ${title}` : title2}</h1>
          )}
        </div>
        <div className="col-12 col-sm-auto text-sm-end">
          {onLinkClick ? (
            <button
              className="btn btn-primary w-100 w-sm-auto d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                onLinkClick();
              }}
            >
              <span>{linkText2 || linkText}</span>
            </button>
          ) : (
            linkText && (
              <Link
                to={link}
                className="btn btn-primary w-100 w-sm-auto d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
              >
                <span>{linkText}</span>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Section Inférieure : Compteur, Filtres & Tris */}
      <div className="card border bg-body p-3 shadow-sm rounded-3">
        <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
          {/* Compteur */}
          <div className="me-md-auto text-center text-md-start">
            {main > 0 && (
              <div className="d-inline-flex align-items-center gap-2 bg-body px-3 py-2 rounded-2 border shadow-xs">
                <span className="text-muted small fw-medium">
                  Total {title || title2}
                </span>
                <span className="badge bg-primary rounded-pill px-2 py-1 fs-6">
                  {main}
                </span>
              </div>
            )}
          </div>

          {/* Filtres + Tri */}
          {(hasFilters || hasSorting) && (
            <div className="d-flex gap-2 justify-content-center justify-content-md-end">
              {hasFilters && (
                <select
                  className="form-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {filterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {hasSorting && (
                <select
                  className="form-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="">Aucun tri</option>
                  {hasAlphaSort && (
                    <option value="alpha">Ordre alphabétique</option>
                  )}
                  <option value="date_auj">Créé aujourd'hui</option>
                  <option value="date_semaine">Créé cette semaine</option>
                  <option value="date_mois">Créé ce mois-ci</option>
                  <option value="date_annee">Créé cette année</option>
                  {hasDateSort && (
                    <option value="updated_desc">Dernière mise à jour</option>
                  )}
                </select>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
