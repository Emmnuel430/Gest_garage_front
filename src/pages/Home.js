import React from "react";
import Layout from "../components/Layout/Layout";
import Statistiques from "./main/Statistiques";
import InfosUtilisateur from "./main/InfosUtilisateur";
import Graph from "./main/Graph";
import Recents from "./main/Recents";
import LastSection from "./main/LastSection";
/*
 */

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user-info"));
  return (
    <div>
      <Layout>
        <div className="container mt-2">
          <h1>Dashboard</h1>
          <h2>Bienvenue sur votre tableau de bord !</h2>
          {user.role !== "super_admin" ? (
            <InfosUtilisateur />
          ) : (
            <>
              <Statistiques />
              <Graph />
            </>
          )}
          <Recents />
          {user.role !== "gardien" ? <LastSection /> : ""}
          {/*
           */}
        </div>
      </Layout>
    </div>
  );
};

export default Home;
