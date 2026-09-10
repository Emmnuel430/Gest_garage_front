import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import Loader from "../components/Layout/Loader";
import Statistiques from "./main/Statistiques";
import InfosUtilisateur from "./main/InfosUtilisateur";
import Graph from "./main/Graph";
import Recents from "./main/Recents";
import LastSection from "./main/LastSection";
import { fetchWithToken } from "../utils/fetchWithToken";
import { useToast } from "../contexts/ToastContext";

const Home = () => {
  const user = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user-info"));
    } catch {
      return null;
    }
  })();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/dashboard_stats`,
        );

        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des données du dashboard",
          );
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        showToast(
          "Impossible de charger les données : " + error.message,
          "danger",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showToast]);

  if (loading || !dashboardData) {
    return (
      <div>
        <Layout>
          <div className="container mt-2">
            <h1>Dashboard</h1>
            <h2>Bienvenue sur votre tableau de bord !</h2>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "50vh" }}
            >
              <Loader />
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  return (
    <div>
      <Layout>
        <div className="container mt-2">
          <h1>Dashboard</h1>
          <h2>Bienvenue sur votre tableau de bord !</h2>
          {user?.role !== "admin" ? (
            <InfosUtilisateur />
          ) : (
            <>
              <Statistiques totals={dashboardData} loading={loading} />
              <Graph
                loading={loading}
                beneficesParJour={dashboardData.benefices_par_jour ?? []}
                receptionsTotal={dashboardData.receptions_total ?? []}
              />
            </>
          )}
          <Recents
            loading={loading}
            receptions={dashboardData.latest_receptions ?? []}
          />
          {user?.role !== "gardien" ? (
            <LastSection
              loading={loading}
              userInfo={user}
              facturesImpayees={dashboardData.latest_factures_impayees ?? []}
              logs={dashboardData.latest_logs ?? []}
              chronosEnCours={dashboardData.latest_chronos_en_cours ?? []}
            />
          ) : null}
        </div>
      </Layout>
    </div>
  );
};

export default Home;
