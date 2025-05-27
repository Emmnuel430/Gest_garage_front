import React, { useState } from "react";
import ToastMessage from "../../components/Layout/ToastMessage";

const items = [
  { label: "Essuie-glace", name: "essuie_glace" },
  { label: "Vitres avant", name: "vitres_avant" },
  { label: "Vitres arrière", name: "vitres_arriere" },
  { label: "Phares avant", name: "phares_avant" },
  { label: "Phares arrière", name: "phares_arriere" },
  { label: "Pneus de secours", name: "pneus_secours" },
  { label: "Cric", name: "cric" },
  { label: "Peinture", name: "peinture" },
  { label: "Rétroviseur", name: "retroviseur" },
  { label: "Kit de pharmacie", name: "kit_pharmacie" },
  { label: "Triangle", name: "triangle" },
];

const Check = ({ reception, onClose, onUpdate }) => {
  const check = reception.check_reception || {};

  const [checkData, setCheckData] = useState({
    id: reception.id,
    essuie_glace: check.essuie_glace || false,
    vitres_avant: check.vitres_avant || false,
    vitres_arriere: check.vitres_arriere || false,
    phares_avant: check.phares_avant || false,
    phares_arriere: check.phares_arriere || false,
    pneus_secours: check.pneus_secours || false,
    cric: check.cric || false,
    peinture: check.peinture || false,
    retroviseur: check.retroviseur || false,
    kit_pharmacie: check.kit_pharmacie || false,
    triangle: check.triangle || false,
    remarques: check.remarques || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setCheckData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckAll = (e) => {
    const { checked } = e.target;
    const updatedChecks = Object.fromEntries(
      items.map((item) => [item.name, checked])
    );
    setCheckData((prev) => ({
      ...prev,
      ...updatedChecks,
    }));
  };

  const isAllChecked = items.every((item) => checkData[item.name]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onUpdate(checkData);
    } catch (err) {
      setError("Erreur lors de la soumission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <ToastMessage message={error} onClose={() => setError(null)} />}

      <div className="row">
        {/* Checkbox "Tout valider" */}
        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              id="checkAll"
              className="form-check-input"
              checked={isAllChecked}
              onChange={handleCheckAll}
            />

            <label className="form-check-label fw-bold" htmlFor="checkAll">
              Tout valider
            </label>
          </div>
        </div>

        {/* Checkboxes individuelles */}
        {items.map((item, idx) => (
          <div className="col-md-6 mb-3" key={idx}>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={item.name}
                name={item.name}
                checked={checkData[item.name]}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor={item.name}>
                {item.label}
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <label className="form-label">Observations</label>
        <textarea
          className="form-control"
          name="remarques"
          rows={3}
          value={checkData.remarques}
          onChange={handleChange}
          placeholder="Ajouter des remarques"
        />
      </div>

      <div className="text-end">
        <button className="btn btn-secondary me-2" onClick={onClose}>
          Annuler
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span>
              <i className="fas fa-spinner fa-spin"></i> Chargement...
            </span>
          ) : (
            <span>Enregistrer</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Check;
