import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import ToastMessage from "../components/Layout/ToastMessage";

const Parametres = () => {
  const [tarifHoraire, setTarifHoraire] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Récupérer le tarif horaire depuis l'API
  useEffect(() => {
    const fetchTarif = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/settings/tarif-horaire`
        );
        const data = await response.json();
        setTarifHoraire(data.tarif_horaire);
      } catch (err) {
        setError("Erreur lors du chargement du tarif horaire.");
      }
    };

    fetchTarif();
  }, []);

  // ✅ Modifier le tarif
  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/settings/tarif-horaire`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tarif_horaire: tarifHoraire }),
        }
      );

      if (!response.ok) throw new Error("Échec de la mise à jour");

      setSuccess(true);
    } catch (err) {
      setError("Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h3 className="mb-4">Paramètres</h3>

        {error && (
          <ToastMessage message={error} onClose={() => setError(null)} />
        )}

        {success && (
          <ToastMessage
            message="Tarif mis à jour avec succès !"
            onClose={() => setSuccess(false)}
            success={true}
          />
        )}

        <div className="mb-3">
          <label className="form-label">Tarif horaire (FCFA)</label>
          <input
            type="number"
            className="form-control"
            value={tarifHoraire}
            onChange={(e) => setTarifHoraire(e.target.value)}
          />
        </div>

        <div className="text-end">
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
              "Enregistrer"
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Parametres;
