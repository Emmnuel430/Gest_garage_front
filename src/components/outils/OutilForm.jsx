import { Spinner } from "react-bootstrap";

const OutilForm = ({
  selected,
  libelle,
  reference,
  quantite,
  setLibelle,
  setReference,
  setQuantite,
  onSubmit,
  onCancel,
  loading,
}) => {
  const isEditing = Boolean(selected);

  const isDisabled =
    loading || !libelle.trim() || !reference.trim() || quantite <= 0;

  return (
    <div className="card shadow-sm">
      {/* Header */}
      <div className="card-header bg-transparent border-bottom px-3 py-3">
        <div className="d-flex align-items-center gap-2">
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center ${
              isEditing
                ? "bg-warning-subtle text-warning"
                : "bg-primary-subtle text-primary"
            }`}
            style={{ width: "40px", height: "40px" }}
          >
            <i className={`fas ${isEditing ? "fa-edit" : "fa-tools"}`}></i>
          </div>

          <div>
            <h6 className="mb-0 fw-bold">
              {isEditing ? "Modifier l'outil" : "Nouvel outil"}
            </h6>

            <small className="text-muted">
              {isEditing
                ? `Modification de ${selected.libelle}`
                : "Ajoutez un nouvel outil au stock"}
            </small>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card-body p-3">
        <div className="mb-3">
          <label className="form-label small fw-semibold">
            Libellé <span className="text-danger">*</span>
          </label>

          <div className="input-group">
            <span className="input-group-text bg-body-tertiary">
              <i className="fas fa-tools text-muted"></i>
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Ex. Clé à molette"
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-semibold">
            Référence <span className="text-danger">*</span>
          </label>

          <div className="input-group">
            <span className="input-group-text bg-body-tertiary">
              <i className="fas fa-barcode text-muted"></i>
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Ex. REF12345"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label small fw-semibold">
            Quantité <span className="text-danger">*</span>
          </label>

          <div className="input-group">
            <span className="input-group-text bg-body-tertiary">
              <i className="fas fa-cubes text-muted"></i>
            </span>

            <input
              type="number"
              className="form-control"
              value={quantite}
              min="0"
              onChange={(e) => setQuantite(Number(e.target.value))}
            />

            <span className="input-group-text text-muted small">unités</span>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex gap-2">
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary border flex-fill"
              onClick={onCancel}
              disabled={loading}
            >
              Annuler
            </button>
          )}

          <button
            type="button"
            className={`btn flex-fill ${
              isEditing ? "btn-warning" : "btn-primary"
            }`}
            onClick={onSubmit}
            disabled={isDisabled}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Enregistrement...
              </>
            ) : (
              <>
                <i
                  className={`fas ${isEditing ? "fa-save" : "fa-plus"} me-2`}
                ></i>

                {isEditing ? "Mettre à jour" : "Ajouter l'outil"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutilForm;
