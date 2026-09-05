import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import { useToast } from "../../contexts/ToastContext";
import { fetchWithToken } from "../../utils/fetchWithToken";

const AddMecanicien = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [mecanicien, setMecanicien] = useState({
    nom: "",
    prenom: "",
    type: "",
    vehicules_maitrises: "",
    experience: "",
    contact: "",
    contact_urgence: "",
  });

  const [vehiculeInput, setVehiculeInput] = useState("");
  const [vehiculesList, setVehiculesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAddVehicule = (e) => {
    if (e.key === "Enter" && vehiculeInput.trim() !== "") {
      e.preventDefault();
      const updatedList = [...vehiculesList, vehiculeInput.trim()];
      setVehiculesList(updatedList);
      setMecanicien({
        ...mecanicien,
        vehicules_maitrises: updatedList.join(", "),
      });
      setVehiculeInput("");
    }
  };

  const removeVehicule = (index) => {
    const updatedList = vehiculesList.filter((_, i) => i !== index);
    setVehiculesList(updatedList);
    setMecanicien({
      ...mecanicien,
      vehicules_maitrises: updatedList.join(", "),
    });
  };

  const handleShowModal = () => {
    if (
      !mecanicien.nom ||
      !mecanicien.prenom ||
      !mecanicien.type ||
      !mecanicien.contact ||
      !mecanicien.contact_urgence
    ) {
      showToast("Tous les champs sont requis.", "danger");
      return;
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const addMecanicien = async () => {
    setLoading(true);
    try {
      const payload = {
        ...mecanicien,
      };

      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/add_mecanicien`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        showToast(result.error || "Une erreur est survenue.", "danger");
        setLoading(false);
        return;
      }

      showToast("Mécanicien ajouté avec succès.", "success");
      setMecanicien({
        nom: "",
        prenom: "",
        type: "",
        vehicules_maitrises: "",
        experience: "",
        contact: "",
        contact_urgence: "",
      });
      setVehiculesList([]);
      navigate("/mecaniciens");
    } catch (e) {
      showToast("Une erreur inattendue s'est produite.", "danger");
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

        <label className="form-label">Nom *</label>
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

        <label className="form-label">Prénom *</label>
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
        <label className="form-label">Type *</label>
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
        <label className="form-label">
          Véhicules maîtrisés (Appuyez sur Entrée pour ajouter)
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Ex: BMW, Mercedes..."
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
        <label className="form-label">Contact *</label>
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
        <label className="form-label">Contact d'urgence *</label>
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

        <button
          onClick={handleShowModal}
          disabled={
            loading ||
            !mecanicien.nom ||
            !mecanicien.prenom ||
            !mecanicien.type ||
            !mecanicien.contact ||
            !mecanicien.contact_urgence
          }
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
            <strong>Type :</strong>{" "}
            <span className="text-capitalize">{mecanicien.type}</span>
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
