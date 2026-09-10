import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

const EditPretModal = ({ show, onClose, onSave, pret, actionLoading }) => {
  const [quantite, setQuantite] = useState(1);

  useEffect(() => {
    if (pret) {
      setQuantite(pret.quantite_pretee ?? pret.quantite ?? 1);
    }
  }, [pret]);

  const handleSave = () => {
    if (pret && quantite >= 1) {
      onSave(pret.id, quantite);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier la quantité prêtée</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {pret && (
          <div>
            <p>
              <strong>Outil :</strong> {pret.outil?.libelle || "—"}
            </p>
            <p>
              <strong>Stock disponible :</strong>{" "}
              {pret.outil?.quantite ?? "—"} unité(s)
            </p>
            <div className="mb-3">
              <label htmlFor="edit-quantite" className="form-label fw-bold">
                Nouvelle quantité prêtée
              </label>
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
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={actionLoading}>
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={actionLoading || quantite < 1}
        >
          {actionLoading ? (
            <>
              <i className="fas fa-spinner fa-spin me-1"></i>Enregistrement...
            </>
          ) : (
            "Enregistrer"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPretModal;
