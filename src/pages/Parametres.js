import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useToast } from "../contexts/ToastContext";
import { fetchWithToken } from "../utils/fetchWithToken";

const Parametres = () => {
  const [tarifHoraire, setTarifHoraire] = useState("");
  const [prixEntree, setPrixEntree] = useState("");
  const [tarifJoursSupp, setTarifJoursSupp] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // ✅ Récupérer les tarifs depuis l'API
  useEffect(() => {
    const fetchTarifs = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/settings/tarifs`,
        );
        const data = await response.json();
        setTarifHoraire(data.tarif_horaire ?? 1000);
        setPrixEntree(data.prix_entree ?? 5000);
        setTarifJoursSupp(data.tarif_jours_supp ?? 2000);
      } catch (err) {
        showToast("Erreur lors du chargement des tarifs.", "danger");
      }
    };

    fetchTarifs();
  }, []);

  // ✅ Modifier les tarifs
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/settings/tarifs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tarif_horaire: tarifHoraire,
            prix_entree: prixEntree,
            tarif_jours_supp: tarifJoursSupp,
          }),
        },
      );

      if (!response.ok) throw new Error("Échec de la mise à jour");

      showToast("Tarifs mis à jour avec succès !", "success");
    } catch (err) {
      showToast("Erreur lors de la mise à jour.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h3 className="mb-4">Paramètres de tarification</h3>

        <div className="card p-4 shadow-sm">
          <div className="mb-3">
            <label className="form-label fw-bold">Prix fixe d'entrée (FCFA)</label>
            <input
              type="number"
              className="form-control"
              value={prixEntree}
              min="0"
              onChange={(e) => setPrixEntree(e.target.value)}
            />
            <small className="text-muted">Forfait appliqué dès l'entrée du véhicule.</small>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Tarif horaire (FCFA / heure)</label>
            <input
              type="number"
              className="form-control"
              value={tarifHoraire}
              min="0"
              onChange={(e) => setTarifHoraire(e.target.value)}
            />
            <small className="text-muted">Tarif appliqué par heure d'intervention.</small>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Tarif jours supplémentaires (FCFA / jour)</label>
            <input
              type="number"
              className="form-control"
              value={tarifJoursSupp}
              min="0"
              onChange={(e) => setTarifJoursSupp(e.target.value)}
            />
            <small className="text-muted">Frais de garde/stationnement par jour supplémentaire à partir de J+1.</small>
          </div>

          <div className="text-end mt-3">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span>
                  <i className="fas fa-spinner fa-spin"></i> Enregistrement...
                </span>
              ) : (
                "Enregistrer les modifications"
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Parametres;

