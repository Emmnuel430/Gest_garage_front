import React, { useState, useEffect, useMemo } from "react";
import { Button, Modal } from "react-bootstrap";
import { fetchWithToken } from "../../utils/fetchWithToken";

const EditPretModal = ({
  show,
  onClose,
  onSave,
  pret,
  reparations = [],
  actionLoading = false,
}) => {
  const [quantite, setQuantite] = useState(1);
  const [selectedAutreReparation, setSelectedAutreReparation] = useState("");
  const [activeMechanicReparations, setActiveMechanicReparations] = useState([]);
  const [loadingVehicules, setLoadingVehicules] = useState(false);

  useEffect(() => {
    if (pret) {
      setQuantite(pret.quantite_pretee ?? pret.quantite ?? 1);
      setSelectedAutreReparation("");

      const mecanoId = pret.mecanicien_id || pret.mecanicien?.id;
      if (!mecanoId) return;

      let isMounted = true;
      const loadOtherVehicles = async () => {
        setLoadingVehicules(true);
        try {
          const res = await fetchWithToken(
            `${process.env.REACT_APP_API_BASE_URL}/liste_reparations?mecanicien_id=${mecanoId}&statut=en_cours&all=true`,
          );
          const data = await res.json();
          if (isMounted) {
            const list = (data.reparations || []).filter(
              (r) => Number(r.id) !== Number(pret.reparation_id),
            );
            setActiveMechanicReparations(list);
          }
        } catch (err) {
          if (isMounted) {
            const fallback = (reparations || []).filter(
              (r) =>
                (Number(r.reception?.vehicule?.mecanicien_id) === Number(mecanoId) ||
                  Number(r.reception?.vehicule?.mecanicien?.id) === Number(mecanoId)) &&
                Number(r.id) !== Number(pret.reparation_id) &&
                r.statut === "en_cours",
            );
            setActiveMechanicReparations(fallback);
          }
        } finally {
          if (isMounted) {
            setLoadingVehicules(false);
          }
        }
      };

      loadOtherVehicles();

      return () => {
        isMounted = false;
      };
    }
  }, [pret, reparations]);

  const isSpecial = Boolean(pret?.outil?.est_special);

  const handleSave = () => {
    if (!pret || quantite < 1) return;

    const payload = {
      quantite_pretee: quantite,
    };

    if (selectedAutreReparation) {
      payload.affecter_autre_reparation_id = Number(selectedAutreReparation);
    }

    onSave(pret.id, payload);
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-bottom py-3">
        <Modal.Title className="fs-6 fw-bold d-flex align-items-center">
          <i className="fas fa-sliders me-2 text-primary"></i>
          Gérer le prêt d'outil
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="py-3">
        {pret && (
          <div>
            {/* Récapitulatif du prêt */}
            <div className="card bg-body-tertiary border-0 p-3 mb-3 rounded-3">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                <div>
                  <h6 className="fw-bold mb-1 text-body">
                    <i className="fas fa-wrench me-2 text-primary"></i>
                    {pret.outil?.libelle || "—"}
                  </h6>
                  <div className="d-flex align-items-center gap-1 flex-wrap">
                    {pret.outil?.reference && (
                      <span className="badge bg-secondary-subtle text-secondary border font-monospace small">
                        {pret.outil.reference}
                      </span>
                    )}
                    {isSpecial && (
                      <span className="badge bg-warning text-dark border border-warning-subtle rounded-pill small">
                        <i className="fas fa-star me-1 text-dark"></i>
                        Spécial : {Number(pret.outil.prix_par_heure || 0).toLocaleString()} FCFA/h
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-end">
                  <span className="badge bg-body text-secondary border font-monospace px-2 py-1">
                    Prêt #{String(pret.id).padStart(4, "0")}
                  </span>
                </div>
              </div>

              <div className="row g-2 pt-2 border-top border-secondary border-opacity-10 small text-body-secondary">
                <div className="col-sm-6">
                  <i className="fas fa-user-gear me-1 text-secondary"></i>
                  Mécanicien :{" "}
                  <strong className="text-body">
                    {pret.mecanicien?.prenom} {pret.mecanicien?.nom?.toUpperCase()}
                  </strong>
                </div>
                <div className="col-sm-6">
                  <i className="fas fa-car me-1 text-secondary"></i>
                  Véhicule initial :{" "}
                  <strong className="text-body font-monospace">
                    {pret.reparation?.reception?.vehicule?.immatriculation || "N/A"}
                  </strong>{" "}
                  ({pret.reparation?.reception?.vehicule?.marque}{" "}
                  {pret.reparation?.reception?.vehicule?.modele})
                </div>
              </div>
            </div>

            {/* 1. Modifier la quantité */}
            <div className="mb-4">
              <label htmlFor="edit-quantite" className="form-label fw-bold small text-body">
                Quantité prêtée
              </label>
              <div className="input-group" style={{ maxWidth: "220px" }}>
                <span className="input-group-text bg-body">
                  <i className="fas fa-hashtag text-muted"></i>
                </span>
                <input
                  id="edit-quantite"
                  type="number"
                  min="1"
                  className="form-control"
                  value={quantite}
                  onChange={(e) =>
                    setQuantite(parseInt(e.target.value, 10) || 1)
                  }
                />
                <span className="input-group-text bg-body text-muted small">
                  Unité(s)
                </span>
              </div>
              <small className="form-text text-muted">
                Stock actuellement en magasin : {pret.outil?.quantite ?? "—"} unité(s)
              </small>
            </div>

            {/* 2. Affecter également cet outil sur un autre véhicule du même mécanicien */}
            <div className="border rounded-3 p-3 bg-body">
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-share-nodes text-primary me-2 fs-5"></i>
                <div>
                  <h6 className="fw-bold mb-0 text-body">
                    Affecter également à un autre véhicule en réparation
                  </h6>
                  <small className="text-muted">
                    Partagez l'outil déjà entre les mains du mécanicien avec un autre de ses véhicules.
                  </small>
                </div>
              </div>

              {loadingVehicules ? (
                <div className="py-2 text-muted small">
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Recherche des autres véhicules en cours pour ce mécanicien...
                </div>
              ) : activeMechanicReparations.length > 0 ? (
                <div className="mt-3">
                  <label htmlFor="select-autre-vehicule" className="form-label small fw-semibold text-body">
                    Choisir le second véhicule concerné :
                  </label>
                  <select
                    id="select-autre-vehicule"
                    className="form-select border-secondary-subtle"
                    value={selectedAutreReparation}
                    onChange={(e) => setSelectedAutreReparation(e.target.value)}
                  >
                    <option value="">
                      -- Ne pas affecter à un autre véhicule --
                    </option>
                    {activeMechanicReparations.map((rep) => {
                      const v = rep?.reception?.vehicule;
                      const motif =
                        rep?.reception?.motif_visite ||
                        rep?.description ||
                        "En cours";
                      return (
                        <option key={rep.id} value={rep.id}>
                          {v?.immatriculation || "N/A"} — {v?.marque} {v?.modele}{" "}
                          (Motif : {motif})
                        </option>
                      );
                    })}
                  </select>

                  {selectedAutreReparation && (
                    <div className="alert alert-info py-2 px-3 small mt-3 mb-0">
                      <i className="fas fa-info-circle me-1"></i>
                      {isSpecial ? (
                        <span>
                          <strong>Facturation au chrono :</strong> Cet outil spécial sera facturé sur la facture du second véhicule selon son propre chrono d'intervention. Aucun outil supplémentaire n'est décrémenté du stock magasin.
                        </span>
                      ) : (
                        <span>
                          Cet outil sera associé à la réparation du second véhicule en mode partagé, sans impacter le stock magasin.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-muted small mt-2 py-2 px-2 bg-light-subtle rounded border">
                  <i className="fas fa-circle-info me-1"></i>
                  Ce mécanicien n'a aucun autre véhicule actuellement en cours de réparation dans l'atelier.
                </div>
              )}
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-top py-2">
        <Button variant="outline-secondary" onClick={onClose} disabled={actionLoading}>
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={actionLoading || quantite < 1}
        >
          {actionLoading ? (
            <>
              <i className="fas fa-spinner fa-spin me-1"></i>
              Enregistrement...
            </>
          ) : selectedAutreReparation ? (
            <>
              <i className="fas fa-share-nodes me-1"></i>
              Enregistrer et affecter au second véhicule
            </>
          ) : (
            "Enregistrer les modifications"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPretModal;
