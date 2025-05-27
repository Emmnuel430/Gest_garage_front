import React, { useEffect, useState } from "react";
import Loader from "../../components/Layout/Loader"; // Assurez-vous que le chemin est correct
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Enregistrement des composants nécessaires pour les graphiques
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Graph = () => {
  const [vehiculesData, setVehiculesData] = useState({});
  const [receptionsData, setReceptionsData] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/dashboard_stats`
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const data = await response.json();

        setVehiculesData(formatTimeSeries(data.vehicules_total, "Véhicules"));
        setReceptionsData(
          formatTimeSeries(data.receptions_total, "Réceptions")
        );
      } catch (error) {
        setError("Impossible de charger les données : " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Appel de la fonction pour récupérer les données
  }, []);

  const isDatasetEmpty = (chartData) => {
    return (
      !chartData.datasets ||
      chartData.datasets.length === 0 ||
      chartData.datasets.every((dataset) => dataset.data.length === 0)
    );
  };

  const formatTimeSeries = (data, label) => ({
    labels: data.map((item) => {
      const dateObj = new Date(item.date);
      return `${dateObj.getDate().toString().padStart(2, "0")}-${(
        dateObj.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${dateObj.getFullYear().toString().slice(-2)}`;
    }),
    datasets: [
      {
        label,
        data: data.map((item) => item.total),
        borderColor: label === "Véhicules" ? "#36A2EB" : "#FF6384",
        backgroundColor:
          label === "Véhicules"
            ? "rgba(54, 162, 235, 0.2)"
            : "rgba(255, 99, 132, 0.5)",
      },
    ],
  });

  return (
    <div>
      {/* Affiche un message d'erreur si une erreur est survenue */}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }} // Centrer Loader au milieu de l'écran
        >
          <Loader />
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-sm-12 col-xl-6">
              <div className="bg-body text-center rounded border p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h6 className="mb-0">Évolution des Véhicules</h6>
                </div>
                {isDatasetEmpty(vehiculesData) ? (
                  <p className="text-muted">
                    Aucune donnée disponible pour le moment.
                  </p>
                ) : (
                  <Line data={vehiculesData} />
                )}
              </div>
            </div>

            <div className="col-sm-12 col-xl-6">
              <div className="bg-body text-center rounded border p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h6 className="mb-0">Évolution des Réceptions</h6>
                </div>
                {isDatasetEmpty(receptionsData) ? (
                  <p className="text-muted">
                    Aucune donnée disponible pour le moment.
                  </p>
                ) : (
                  <Bar data={receptionsData} />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Graph;
