import React from "react";
import ConfirmPopup from "../Layout/ConfirmPopup";

const RestitutionConfirmModal = ({ show, onClose, onConfirm, pret }) => {
  return (
    <ConfirmPopup
      show={show}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Confirmer la restitution de l'outil"
      body={
        pret && (
          <div>
            <p className="mb-3">
              Confirmez-vous le retour de l'outil suivant à la caisse d'outils ?
            </p>
            <div className="card border p-3 bg-body-tertiary">
              <div className="row g-2 small">
                <div className="col-4 text-muted">Outil :</div>
                <div className="col-8 fw-bold">
                  {pret.outil?.libelle}{" "}
                  <span className="text-muted">[{pret.outil?.reference}]</span>
                </div>

                <div className="col-4 text-muted">Mécanicien :</div>
                <div className="col-8 fw-bold">
                  {pret.mecanicien?.prenom} {pret.mecanicien?.nom?.toUpperCase()}
                </div>

                <div className="col-4 text-muted">Véhicule :</div>
                <div className="col-8 fw-bold">
                  <span className="badge bg-dark text-white font-monospace me-1">
                    {pret.reparation?.reception?.vehicule?.immatriculation || "N/A"}
                  </span>
                  ({pret.reparation?.reception?.vehicule?.marque}{" "}
                  {pret.reparation?.reception?.vehicule?.modele})
                </div>

                <div className="col-4 text-muted">Quantité :</div>
                <div className="col-8 fw-bold">
                  <span className="badge bg-secondary fs-6">{pret.quantite}</span>
                </div>

                {Boolean(pret.est_partage) && (
                  <div className="col-12 mt-2">
                    <div className="alert alert-info py-2 px-3 mb-0 small">
                      <i className="fas fa-info-circle me-1"></i>
                      <strong>Prêt partagé :</strong> Si ce mécanicien utilise
                      encore cet outil sur un autre véhicule en cours, il sera
                      libéré pour ce véhicule-ci. La réintégration au stock de la
                      caisse aura lieu dès que toutes ses réparations l'auront
                      restitué.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }
      confirmText="Confirmer la restitution"
      cancelText="Annuler"
      btnColor="success"
    />
  );
};

export default RestitutionConfirmModal;
