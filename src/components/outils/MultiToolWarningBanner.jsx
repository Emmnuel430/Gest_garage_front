import React from "react";

const MultiToolWarningBanner = ({ multiToolMechanics, onFilterMechanic }) => {
  if (!multiToolMechanics || multiToolMechanics.length === 0) {
    return null;
  }

  return (
    <div className="alert alert-warning border-warning shadow-sm mb-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <i className="fas fa-exclamation-triangle fs-5 me-2 text-warning"></i>
          <strong>Attention : </strong>
          {multiToolMechanics.map((m, idx) => (
            <span key={idx} className="me-2">
              <strong>{m.name}</strong> a actuellement{" "}
              <strong>{m.count} outils</strong> empruntés simultanément.
            </span>
          ))}
        </div>
        {onFilterMechanic && (
          <button
            className="btn btn-warning btn-sm"
            onClick={() => onFilterMechanic(multiToolMechanics[0].name)}
          >
            <i className="fas fa-filter me-1"></i> Filtrer ces prêts
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiToolWarningBanner;
