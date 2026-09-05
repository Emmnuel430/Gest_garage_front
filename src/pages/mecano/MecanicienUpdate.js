import React, { useState, useRef } from "react";

const MecanicienUpdate = ({ mecanicien, onClose, onUpdate }) => {
  const initialMecanicien = mecanicien || {};

  const [updatedMecanicien, setUpdatedMecanicien] = useState({
    ...initialMecanicien,
  });
  const [loading, setloading] = useState(false);

  // Gestion des véhicules maîtrisés comme liste de tags
  const [vehiculesList, setVehiculesList] = useState(
    initialMecanicien.vehicules_maitrises
      ? initialMecanicien.vehicules_maitrises
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      : [],
  );
  const [vehiculeInput, setVehiculeInput] = useState("");
  const vehiculeInputRef = useRef(null);

  if (!mecanicien) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMecanicien((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVehicule = (e) => {
    if (e.key === "Enter" && vehiculeInput.trim() !== "") {
      e.preventDefault();
      const updatedList = [...vehiculesList, vehiculeInput.trim()];
      setVehiculesList(updatedList);
      setUpdatedMecanicien((prev) => ({
        ...prev,
        vehicules_maitrises: updatedList.join(", "),
      }));
      setVehiculeInput("");
    }
  };

  const removeVehicule = (index) => {
    const updatedList = vehiculesList.filter((_, i) => i !== index);
    setVehiculesList(updatedList);
    setUpdatedMecanicien((prev) => ({
      ...prev,
      vehicules_maitrises: updatedList.join(", "),
    }));
  };

  const handleSubmit = async () => {
    setloading(true); // 👉 Début envoi
    try {
      await onUpdate(updatedMecanicien);
    } finally {
      setloading(false); // 👉 Fin envoi (succès ou échec)
    }
  };

  return (
    <div>
      <div className="mb-3">
        <label className="form-label">Nom</label>
        <input
          disabled={loading}
          type="text"
          className="form-control"
          name="nom"
          value={updatedMecanicien.nom}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Prénom</label>
        <input
          disabled={loading}
          type="text"
          className="form-control"
          name="prenom"
          value={updatedMecanicien.prenom}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Type</label>
        <select
          disabled={loading}
          className="form-control"
          name="type"
          value={updatedMecanicien.type}
          onChange={handleChange}
        >
          <option value="">Sélectionner un type</option>
          <option value="interne">Interne</option>
          <option value="externe">Externe</option>
        </select>
      </div>

      {/* ── Champs multiples véhicules maîtrisés ── */}
      <div className="mb-3">
        <label className="form-label">
          Véhicules maîtrisés (Appuyez sur Entrée pour ajouter)
        </label>
        <input
          disabled={loading}
          ref={vehiculeInputRef}
          type="text"
          className="form-control"
          placeholder="Ex: Toyota, BMW..."
          value={vehiculeInput}
          onChange={(e) => setVehiculeInput(e.target.value)}
          onKeyDown={handleAddVehicule}
        />
        <div className="mt-2 d-flex flex-wrap gap-2">
          {vehiculesList.map((item, index) => (
            <span
              key={index}
              className="badge bg-primary d-flex align-items-center"
            >
              {item}
              <button
                type="button"
                className="btn-close btn-close-white ms-2"
                style={{ fontSize: "0.5rem" }}
                onClick={() => removeVehicule(index)}
              ></button>
            </span>
          ))}
        </div>
        {vehiculesList.length === 0 && (
          <small className="text-muted">Aucun véhicule ajouté.</small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Expérience (en années)</label>
        <input
          disabled={loading}
          type="number"
          className="form-control"
          name="experience"
          value={updatedMecanicien.experience}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contact</label>
        <input
          disabled={loading}
          type="number"
          className="form-control"
          name="contact"
          value={updatedMecanicien.contact}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contact d'urgence</label>
        <input
          disabled={loading}
          type="number"
          className="form-control"
          name="contact_urgence"
          value={updatedMecanicien.contact_urgence}
          onChange={handleChange}
        />
      </div>

      <div className="text-end">
        <button className="btn btn-secondary me-2" onClick={onClose}>
          Annuler
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading} // 👉 désactive si en cours
        >
          {loading ? (
            <span>
              <i className="fas fa-spinner fa-spin"></i> Chargement...
            </span>
          ) : (
            <span>Modifier</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default MecanicienUpdate;
