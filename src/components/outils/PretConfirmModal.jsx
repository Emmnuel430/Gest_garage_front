import React from "react";
import ConfirmPopup from "../Layout/ConfirmPopup";

const PretConfirmModal = ({
  show,
  onClose,
  onConfirm,
  mecanicien,
  reparation,
  selectedOutilOption,
  quantite,
  estPartage,
  partagerTousVehicules,
  mechanicReparationsCount = 0,
  mecanoAlreadyHasOutil = false,
}) => {
  return (
    <ConfirmPopup
      show={show}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Confirmer l'enregistrement du prêt"
      body={
        <div>
          <p className="mb-3">
            Veuillez vérifier les informations ci-dessous avant de valider le
            prêt :
          </p>
          <div className="card border p-3 bg-body-tertiary">
            <div className="row g-2 small">
              <div className="col-4 text-muted">Mécanicien :</div>
              <div className="col-8 fw-bold">
                {mecanicien?.nom?.toUpperCase()} {mecanicien?.prenom}
              </div>

              <div className="col-4 text-muted">Véhicule :</div>
              <div className="col-8 fw-bold">
                <span className="badge bg-dark text-white font-monospace me-1">
                  {reparation?.reception?.vehicule?.immatriculation || "N/A"}
                </span>
                ({reparation?.reception?.vehicule?.marque}{" "}
                {reparation?.reception?.vehicule?.modele})
              </div>

              <div className="col-4 text-muted">Outil :</div>
              <div className="col-8 fw-bold">
                {selectedOutilOption?.outil?.libelle}{" "}
                <span className="text-muted">
                  [{selectedOutilOption?.outil?.reference}]
                </span>
              </div>

              <div className="col-4 text-muted">Quantité :</div>
              <div className="col-8 fw-bold">
                <span className="badge bg-primary fs-6">{quantite}</span>
              </div>

              <div className="col-4 text-muted">Mode d'usage :</div>
              <div className="col-8">
                {partagerTousVehicules ? (
                  <span className="badge bg-info text-dark">
                    Partagé sur TOUS ses véhicules en cours (
                    {mechanicReparationsCount})
                  </span>
                ) : estPartage ? (
                  <span className="badge bg-info text-dark">Outil partagé</span>
                ) : (
                  <span className="badge bg-secondary">
                    Exclusif à ce véhicule
                  </span>
                )}
              </div>

              <div className="col-4 text-muted">Impact stock :</div>
              <div className="col-8">
                {mecanoAlreadyHasOutil && estPartage ? (
                  <span className="text-info fw-bold">
                    <i className="fas fa-check me-1"></i> Réutilisation physique
                    (stock non décrémenté)
                  </span>
                ) : (
                  <span className="text-warning-emphasis fw-bold">
                    <i className="fas fa-minus me-1"></i> Sortie de {quantite}{" "}
                    unité(s) du stock
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      }
      confirmText="Confirmer et Enregistrer"
      cancelText="Annuler"
      btnColor="primary"
    />
  );
};

export default PretConfirmModal;
