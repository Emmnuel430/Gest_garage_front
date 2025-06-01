// Importation des dépendances React et des composants nécessaires de React Router
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protected from "./components/Protected"; // Composant pour protéger les routes
// Importation des pages et composants utilisés dans les routes
import Login from "./pages/Login";
import Home from "./pages/Home";
import AccessDenied from "./components/AccessDenied";
// ----
import Register from "./pages/users/Register";
import UserList from "./pages/users/UserList";
import UserUpdate from "./pages/users/UserUpdate";
// ----
import Receptions from "./pages/receptions/Receptions";
import CheckReception from "./pages/receptions/CheckReception";
import Check from "./pages/receptions/Check";
// import ReceptionUpdate from "./pages/receptions/ReceptionUpdate";
import AddReception from "./pages/receptions/AddReception";
// import ReceptionUpdate from "./pages/receptions/ReceptionUpdate";
// ----
import Chronos from "./pages/reparations/Chronos";
import Reparations from "./pages/reparations/Reparations";
import BilletsSortie from "./pages/reparations/BilletsSortie";
import Factures from "./pages/reparations/Factures";
// ----
import Mecaniciens from "./pages/mecano/Mecaniciens";
import AddMecanicien from "./pages/mecano/AddMecanicien";
import MecanicienUpdate from "./pages/mecano/MecanicienUpdate";
// ----
import Vehicules from "./pages/vehicule/Vehicules";
// ----
import Logs from "./pages/Logs";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />

        {/* Dashboard (accessible à tous les rôles connectés) */}
        <Route path="/home" element={<Protected Cmp={Home} />} />

        {/* Utilisateurs (Super Admin uniquement) */}
        <Route
          path="/register"
          element={
            <Protected
              Cmp={Register}
              adminOnly
              roles={["secretaire", "super_admin"]}
            />
          }
        />
        <Route
          path="/utilisateurs"
          element={
            <Protected
              Cmp={UserList}
              adminOnly
              roles={["secretaire", "super_admin"]}
            />
          }
        />
        <Route
          path="/update/user/:id"
          element={
            <Protected
              Cmp={UserUpdate}
              adminOnly
              roles={["secretaire", "super_admin"]}
            />
          }
        />
        {/* ------------------------ */}
        {/* Gestion technique */}
        <Route
          path="/receptions"
          element={
            <Protected
              Cmp={Receptions}
              roles={["gardien", "secretaire", "chef_atelier", "super_admin"]}
            />
          }
        />
        <Route
          path="/add/reception"
          element={
            <Protected
              Cmp={AddReception}
              roles={["gardien", "secretaire", "chef_atelier", "super_admin"]}
            />
          }
        />
        <Route
          path="/check-reception"
          element={
            <Protected
              Cmp={CheckReception}
              roles={["secretaire", "super_admin"]}
            />
          }
        />
        <Route
          path="/check/:id"
          element={
            <Protected Cmp={Check} roles={["secretaire", "super_admin"]} />
          }
        />
        <Route
          path="/chronos"
          element={
            <Protected
              Cmp={Chronos}
              roles={["secretaire", "chef_atelier", "super_admin"]}
            />
          }
        />
        <Route
          path="/reparations"
          element={
            <Protected
              Cmp={Reparations}
              roles={["chef_atelier", "super_admin"]}
            />
          }
        />
        <Route
          path="/billets-sortie"
          element={
            <Protected
              Cmp={BilletsSortie}
              roles={["secretaire", "chef_atelier", "super_admin", "caisse"]}
            />
          }
        />
        <Route
          path="/factures"
          element={
            <Protected Cmp={Factures} roles={["caisse", "super_admin"]} />
          }
        />
        {/* ------------------------ */}
        {/* Gestion des personnes */}
        <Route
          path="/mecaniciens"
          element={
            <Protected
              Cmp={Mecaniciens}
              roles={["super_admin", "secretaire"]}
            />
          }
        />
        <Route
          path="/add/mecanicien"
          element={
            <Protected
              Cmp={AddMecanicien}
              roles={["super_admin", "secretaire"]}
            />
          }
        />
        <Route
          path="/update/mecanicien/:id"
          element={
            <Protected
              Cmp={MecanicienUpdate}
              roles={["super_admin", "secretaire"]}
            />
          }
        />
        {/* ------------------------ */}
        {/* Archives véhicules */}
        <Route
          path="/vehicules"
          element={
            <Protected
              Cmp={Vehicules}
              roles={["super_admin", "secretaire", "chef_atelier"]}
            />
          }
        />

        {/* Logs */}
        <Route
          path="/logs"
          element={
            <Protected
              Cmp={Logs}
              adminOnly
              roles={["super_admin", "secretaire"]}
            />
          }
        />

        {/* Si l'URL n'est pas définie, renvoyer l'utilisateur vers la page de connexion */}
        <Route path="*" element={<Login />} />
        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
    </BrowserRouter>
  );
};

// Exportation du composant AppRoutes pour l'utiliser dans d'autres parties de l'application
export default AppRoutes;
