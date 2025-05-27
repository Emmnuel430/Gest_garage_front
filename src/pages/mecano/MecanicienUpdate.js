import React, { useState, useEffect } from "react";
import ToastMessage from "../../components/Layout/ToastMessage";

const MecanicienUpdate = ({ mecanicien, onClose, onUpdate }) => {
  const [updatedMecanicien, setUpdatedMecanicien] = useState({ ...mecanicien });
  const [garages, setGarages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMecanicien((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setloading(true); // 👉 Début envoi
    try {
      await onUpdate(updatedMecanicien);
    } finally {
      setloading(false); // 👉 Fin envoi (succès ou échec)
    }
  };

  useEffect(() => {
    fetchGarages();
  }, []);

  const fetchGarages = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/liste_garage`
      );
      const data = await response.json();
      if (response.ok) {
        setGarages(data.garages);
      } else {
        setError(data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      setError("Une erreur inattendue s'est produite.");
    }
  };

  return (
    <div>
      {error && (
        <ToastMessage
          message={error}
          onClose={() => {
            setError(null);
          }}
        />
      )}
      <div className="mb-3">
        <label className="form-label">Nom</label>
        <input
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

      <div className="mb-3">
        <label className="form-label">Véhicules maîtrisés</label>
        <textarea
          className="form-control"
          name="vehicules_maitrises"
          rows={3}
          value={updatedMecanicien.vehicules_maitrises}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Expérience (en années)</label>
        <input
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
          type="number"
          className="form-control"
          name="contact_urgence"
          value={updatedMecanicien.contact_urgence}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Garage</label>
        <select
          className="form-control"
          name="garage_id"
          value={updatedMecanicien.garage_id}
          onChange={handleChange}
        >
          <option value="">Sélectionner un garage</option>
          {garages.map((garage) => (
            <option key={garage.id} value={garage.id}>
              {garage.nom}
            </option>
          ))}
        </select>
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
