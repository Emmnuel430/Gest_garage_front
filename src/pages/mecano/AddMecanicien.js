import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ToastMessage from "../../components/Layout/ToastMessage";

const AddMecanicien = () => {
  const navigate = useNavigate();

  const [mecanicien, setMecanicien] = useState({
    nom: "",
    prenom: "",
    type: "",
    vehicules_maitrises: "",
    experience: "",
    contact: "",
    contact_urgence: "",
    garage_id: "",
  });

  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  const handleShowModal = () => {
    if (!mecanicien.nom || !mecanicien.prenom || !mecanicien.type) {
      setError("Tous les champs sont requis.");
      return;
    }
    setError("");
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const addMecanicien = async () => {
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("user-info"));
      const userId = userInfo ? userInfo.id : null;

      if (!userId) {
        alert("Utilisateur non authentifié. Veuillez vous connecter.");
        navigate("/");
        return;
      }

      const payload = {
        ...mecanicien,
        garage_id:
          mecanicien.garage_id === "" ? "" : Number(mecanicien.garage_id),
        user_id: userId,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/add_mecanicien`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log(JSON.stringify(payload));

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      alert("Mécanicien ajouté avec succès.");
      setMecanicien({
        nom: "",
        prenom: "",
        type: "",
        vehicules_maitrises: "",
        experience: "",
        contact: "",
        contact_urgence: "",
      });
      navigate("/mecaniciens");
    } catch (e) {
      setError("Une erreur inattendue s'est produite.");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <Layout>
      <Back>mecaniciens</Back>
      <div className="col-sm-6 offset-sm-3 mt-5">
        <h1>Ajout d'un Mécanicien</h1>

        {error && (
          <ToastMessage
            message={error}
            onClose={() => {
              setError(null);
            }}
          />
        )}

        <label className="form-label">Nom</label>
        <input
          type="text"
          className="form-control"
          placeholder="Nom du mécanicien"
          value={mecanicien.nom}
          onChange={(e) =>
            setMecanicien({ ...mecanicien, nom: e.target.value })
          }
        />
        <br />

        <label className="form-label">Prénom</label>
        <input
          type="text"
          className="form-control"
          placeholder="Prénom du mécanicien"
          value={mecanicien.prenom}
          onChange={(e) =>
            setMecanicien({ ...mecanicien, prenom: e.target.value })
          }
        />
        <br />
        <label className="form-label">Type</label>
        <select
          name="type"
          id="type"
          className="form-control"
          value={mecanicien.type}
          onChange={(e) =>
            setMecanicien({ ...mecanicien, type: e.target.value })
          }
        >
          <option value="">Sélectionner un type</option>
          <option value="interne">Interne</option>
          <option value="externe">Externe</option>
        </select>
        <br />
        <label className="form-label">Véhicules maîtrisés</label>
        <textarea
          className="form-control"
          placeholder="BMW, Mercedes, Audi..."
          rows={4}
          value={mecanicien.vehicules_maitrises}
          onChange={(e) =>
            setMecanicien({
              ...mecanicien,
              vehicules_maitrises: e.target.value,
            })
          }
        />
        <br />

        <label className="form-label">Expérience (en année)</label>
        <input
          type="number"
          className="form-control"
          placeholder="Expérience"
          value={mecanicien.experience}
          onChange={(e) =>
            setMecanicien({ ...mecanicien, experience: e.target.value })
          }
        />
        <br />
        <label className="form-label">Contact</label>
        <input
          type="number"
          className="form-control"
          placeholder="Contact"
          value={mecanicien.contact}
          onChange={(e) =>
            setMecanicien({ ...mecanicien, contact: e.target.value })
          }
        />
        <br />
        <label className="form-label">Contact d'urgence</label>
        <input
          type="number"
          className="form-control"
          placeholder="Contact d'urgence"
          value={mecanicien.contact_urgence}
          onChange={(e) =>
            setMecanicien({ ...mecanicien, contact_urgence: e.target.value })
          }
        />
        <br />

        {mecanicien.type === "externe" && (
          <>
            <label className="form-label">Garage</label>
            <select
              name="garage_id"
              id="garage_id"
              className="form-control"
              value={mecanicien.garage_id}
              onChange={(e) =>
                setMecanicien({
                  ...mecanicien,
                  garage_id: e.target.value,
                })
              }
            >
              <option value="">Sélectionner un garage</option>
              {garages.map((garage) => (
                <option key={garage.id} value={garage.id}>
                  {garage.nom}
                </option>
              ))}
            </select>
            <br />
          </>
        )}

        <button
          onClick={handleShowModal}
          disabled={loading}
          className="btn btn-primary w-100"
        >
          {loading ? (
            <span>
              <i className="fas fa-spinner fa-spin"></i> Chargement...
            </span>
          ) : (
            <span>Ajouter</span>
          )}
        </button>
      </div>

      <ConfirmPopup
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={addMecanicien}
        title="Confirmer l'ajout"
        body={
          <p>
            Êtes-vous sûr de vouloir ajouter ce mécanicien ?<br />
            <strong>Nom :</strong> {mecanicien.nom}
            <br />
            <strong>Prénom :</strong> {mecanicien.prenom}
            <br />
            <strong>Type :</strong> {mecanicien.type}
            <br />
          </p>
        }
      />
      <br />
      <br />
    </Layout>
  );
};

export default AddMecanicien;
