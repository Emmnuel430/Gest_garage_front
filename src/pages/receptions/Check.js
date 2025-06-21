import React, { useEffect, useState } from "react";
import ToastMessage from "../../components/Layout/ToastMessage";
import { slugify } from "../../utils/helpers"; // tu peux faire un helper pour slugifier

const VALUE_OPTIONS = {
  presence: [
    { label: "Présent", value: "présent" },
    { label: "Absent", value: "absent" },
  ],
  etat: [
    { label: "Bon", value: "bon" },
    { label: "Mauvais", value: "mauvais" },
    { label: "Absent", value: "absent" },
  ],
};

const Check = ({ reception, onClose, onUpdate }) => {
  const [checkItems, setCheckItems] = useState([]);
  const [checkData, setCheckData] = useState({ remarques: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les check_items depuis l'API
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/check-items`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur réseau");
        }
        return res.json();
      })
      .then((data) => {
        setCheckItems(data);
      })
      .catch(() => {
        setError("Erreur lors du chargement des éléments à vérifier");
      });
  }, []);

  useEffect(() => {
    if (!reception || !reception.check_reception) {
      setCheckData({ remarques: "" });
      return;
    }

    const check = reception.check_reception;
    const data = { remarques: check.remarques || "" };

    // On boucle sur les items du check (ex: check.items)
    if (check.items) {
      check.items.forEach((checkItem) => {
        // slugify correspond à la clé côté front
        const key = slugify(checkItem.item.nom);
        data[key] = checkItem.valeur;
      });
    }

    setCheckData(data);
  }, [reception]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCheckData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onUpdate({ ...checkData, id: reception.id });
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
        {checkItems.map((item, idx) => {
          const name = slugify(item.nom); // ex: "vitres_avant"
          const options = VALUE_OPTIONS[item.type] || [];

          return (
            <div className="col-md-6 mb-3" key={idx}>
              <label className="form-label fw-bold text-capitalize">
                {item.nom}
              </label>
              <select
                name={name}
                className="form-select"
                value={checkData[name] || ""}
                onChange={handleChange}
                required
              >
                <option value="">-- Choisir --</option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
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
            "Enregistrer"
          )}
        </button>
      </div>
    </div>
  );
};

export default Check;
