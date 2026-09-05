import React from "react";

export default function BadgeVehicule({
  immatriculation,
  marque,
  modele,
  orientation = "horizontal", // "horizontal" ou "vertical"
  showDivider = false,
}) {
  const isVertical = orientation === "vertical";

  return (
    <div className="d-flex flex-column align-items-center mb-3">
      {/* Conteneur principal : bascule entre d-inline-flex (horizontal) et d-flex flex-column (vertical) */}
      <div
        className={`align-items-center gap-2 p-2 bg-body border rounded-3 shadow-sm ${
          isVertical
            ? "d-flex flex-column text-center"
            : "d-inline-flex flex-wrap"
        }`}
        style={isVertical ? { minWidth: "200px" } : {}}
      >
        {/* Effet Plaque d'immatriculation */}
        <div className="px-2 py-1 bg-body border border-dark rounded border-2 shadow-sm font-monospace fw-bold text-uppercase text-body fs-2 tracking-wider">
          {immatriculation || "INCONNUE"}
        </div>

        {/* Séparateur adaptatif */}
        {isVertical ? (
          /* Séparateur horizontal pour le mode vertical */
          <hr className="w-100 my-1 text-secondary" />
        ) : (
          /* Séparateur vertical pour le mode horizontal */
          <div
            className="vr d-none d-sm-block my-1"
            style={{ height: "60px" }}
          ></div>
        )}

        {/* Marque et Modèle */}
        {isVertical ? (
          /* Version Verticale : Marque - Modèle dans un seul badge */
          <div className="d-flex flex-column gap-1 w-100 align-items-center">
            <div className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill text-truncate max-w-100 px-3 py-2">
              <span className="fw-bold text-uppercase">
                {marque || "Marque inconnue"}
              </span>
              {" - "}
              <span>{modele || "Modèle inconnu"}</span>
            </div>
          </div>
        ) : (
          /* Version Horizontale : Deux badges superposés */
          <div className="d-flex flex-column gap-1">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill text-uppercase text-truncate">
              {marque || "Marque inconnue"}
            </span>
            <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill text-truncate">
              {modele || "Modèle inconnu"}
            </span>
          </div>
        )}
      </div>

      {/* Séparateur conditionnel bas */}
      {showDivider && <div className="text-muted my-2">-------------</div>}
    </div>
  );
}
