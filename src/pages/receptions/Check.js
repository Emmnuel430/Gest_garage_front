import React, { useEffect, useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { slugify } from "../../utils/helpers"; // tu peux faire un helper pour slugifier
import { fetchWithToken } from "../../utils/fetchWithToken";
import { VALUE_OPTIONS } from "../../constants/CheckValue";

const Check = ({ reception, onClose, onUpdate, loading }) => {
  const [checkItems, setCheckItems] = useState([]);
  const [checkData, setCheckData] = useState({ remarques: "" });
  const [bulkMode, setBulkMode] = useState("");
  const { showToast } = useToast();

  const getGoodValue = (type) => {
    if (type === "presence") return "présent";
    if (type === "etat") return "bon";
    return "";
  };

  const getBadValue = (type) => {
    if (type === "presence") return "absent";
    if (type === "etat") return "mauvais";
    return "";
  };

  const applyBulkFill = (mode) => {
    if (!mode) return;

    setCheckData((prev) => {
      const next = { ...prev };

      checkItems.forEach((item) => {
        const name = slugify(item.nom);
        const options = VALUE_OPTIONS[item.type] || [];

        if (!options.length) return;

        if (mode === "good") {
          next[name] = getGoodValue(item.type);
          return;
        }

        if (mode === "bad") {
          next[name] = getBadValue(item.type);
          return;
        }

        if (mode === "random") {
          const randomIndex = Math.floor(Math.random() * options.length);
          next[name] = options[randomIndex].value;
        }
      });

      return next;
    });
  };

  // Charger les check_items depuis l'API
  useEffect(() => {
    fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/check-items`)
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
        showToast(
          "Erreur lors du chargement des éléments à vérifier",
          "danger",
        );
      });
  }, [showToast]);

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

  const isFormValid =
    checkItems.length > 0 &&
    checkItems.every((item) => {
      const name = slugify(item.nom);
      return checkData[name] && checkData[name].toString().trim() !== "";
    });

  const handleSubmit = async () => {
    if (!isFormValid) {
      showToast(
        "Veuillez remplir tous les champs de contrôle obligatoires.",
        "danger",
      );
      return;
    }
    try {
      await onUpdate({ ...checkData, id: reception.id });
    } catch (err) {
      showToast("Erreur lors de la soumission", "danger");
    } finally {
    }
  };

  return (
    <div>
      <div className="mb-3">
        <label className="form-label fw-bold">Remplissage rapide</label>
        <select
          disabled={loading}
          className="form-select"
          value={bulkMode}
          onChange={(e) => {
            const selectedMode = e.target.value;
            if (!selectedMode) return;

            setBulkMode("");
            applyBulkFill(selectedMode);
          }}
        >
          <option value="">-- Choisir une action --</option>
          <option value="good">Tout en bon</option>
          <option value="bad">Tout en bad</option>
          <option value="random">Random</option>
        </select>
      </div>

      <div className="row">
        {checkItems.map((item, idx) => {
          const name = slugify(item.nom); // ex: "vitres_avant"
          const options = VALUE_OPTIONS[item.type] || [];

          return (
            <div className="col-md-6 mb-3" key={idx}>
              <label className="form-label fw-bold text-capitalize">
                {item.nom} <span className="text-danger">*</span>
              </label>
              <select
                disabled={loading}
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
          disabled={loading || !isFormValid}
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
