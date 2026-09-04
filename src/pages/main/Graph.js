import React from "react";
import Loader from "../../components/Layout/Loader";
import { Line, Bar } from "react-chartjs-2";
import "../../utils/chartConfig";

const Graph = ({
  loading = false,
  beneficesParJour = [],
  receptionsTotal = [],
}) => {
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
        borderColor: label === "Bénéfices" ? "#36A2EB" : "#FF6384",
        backgroundColor:
          label === "Bénéfices"
            ? "rgba(54, 162, 235, 0.2)"
            : "rgba(255, 99, 132, 0.5)",
      },
    ],
  });

  const benefData = formatTimeSeries(beneficesParJour, "Bénéfices");
  const receptionsData = formatTimeSeries(receptionsTotal, "Réceptions");

  const isDatasetEmpty = (chartData) => {
    return (
      !chartData.datasets ||
      chartData.datasets.length === 0 ||
      chartData.datasets.every((dataset) => dataset.data.length === 0)
    );
  };

  return (
    <div>
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
              <div className="bg-body text-center rounded-4 border p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h6 className="mb-0">Évolution des Bénéfices / jour</h6>
                </div>
                {isDatasetEmpty(benefData) ? (
                  <p className="text-muted">
                    Aucune donnée disponible pour le moment.
                  </p>
                ) : (
                  <Line data={benefData} />
                )}
              </div>
            </div>

            <div className="col-sm-12 col-xl-6">
              <div className="bg-body text-center rounded-4 border p-4">
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
