import React from "react";
import AccessDenied from "./components/AccessDenied";
import AddMecanicien from "./pages/mecano/AddMecanicien";
import MecanicienUpdate from "./pages/mecano/MecanicienUpdate";
import Mecaniciens from "./pages/mecano/Mecaniciens";
import AddReception from "./pages/receptions/AddReception";
import Check from "./pages/receptions/Check";
import CheckReception from "./pages/receptions/CheckReception";
import Receptions from "./pages/receptions/Receptions";
import BilletsSortie from "./pages/reparations/BilletsSortie";
import Chronos from "./pages/reparations/Chronos";
import Factures from "./pages/reparations/Factures";
import Reparations from "./pages/reparations/Reparations";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/users/Register";
import UserList from "./pages/users/UserList";
import UserUpdate from "./pages/users/UserUpdate";
import CaisseOutilsPage from "./pages/outils/CaisseOutilsPage";
import InventaireOutils from "./pages/outils/InventaireOutils";
import Parametres from "./pages/Parametres";
import Logs from "./pages/Logs";
import Vehicules from "./pages/vehicule/Vehicules";

const routes = [
  {
    path: "/",
    component: Login,
    sidebar: false,
    protected: false,
  },
  //   -----------
  {
    path: "/home",
    component: Home,
    sidebar: true,
    label: "Dashboard",
    icon: "home",
    className: "nav-item nav-link",
    group: "main",
    groupOrder: 10,
    order: 10,
  },
  //   -----------
  // User management routes
  {
    path: "/utilisateurs",
    component: UserList,
    sidebar: true,
    label: "Utilisateurs",
    icon: "user-friends",
    roles: ["admin"],
    adminOnly: true,
    group: "administration",
    groupOrder: 50,
    order: 10,
  },
  {
    path: "/register",
    component: Register,
    sidebar: false,
    roles: ["admin"],
    adminOnly: true,
    group: "users",
  },
  {
    path: "/update/user/:id",
    component: UserUpdate,
    sidebar: false,
    roles: ["admin"],
    adminOnly: true,
    group: "users",
  },

  {
    path: "/mecaniciens",
    component: Mecaniciens,
    sidebar: true,
    label: "Mécaniciens",
    icon: "user-cog",
    roles: ["admin", "reception"],
    group: "administration",
    groupOrder: 50,
    order: 20,
  },
  {
    path: "/add/mecanicien",
    component: AddMecanicien,
    sidebar: false,
    roles: ["admin", "reception"],
    group: "mecaniciens",
  },
  {
    path: "/update/mecanicien/:id",
    component: MecanicienUpdate,
    sidebar: false,
    roles: ["admin", "reception"],
    group: "mecaniciens",
  },

  {
    path: "/parametres",
    component: Parametres,
    sidebar: true,
    label: "Paramètres",
    icon: "cogs",
    roles: ["admin"],
    adminOnly: true,
    group: "administration",
    groupOrder: 50,
    order: 30,
  },
  {
    path: "/outils/inventaire",
    component: InventaireOutils,
    sidebar: true,
    label: "Inventaire Outils",
    icon: "boxes",
    roles: ["admin"],
    adminOnly: true,
    group: "administration",
    groupOrder: 50,
    order: 40,
  },
  {
    path: "/logs",
    component: Logs,
    sidebar: true,
    label: "Logs",
    icon: "file-alt",
    roles: ["admin"],
    adminOnly: true,
    group: "administration",
    groupOrder: 50,
    order: 50,
  },

  //   ------------
  // Gestion
  {
    path: "/receptions",
    component: Receptions,
    sidebar: true,
    label: (
      <>
        Réceptions <br /> de véhicules
      </>
    ),
    icon: "car",
    roles: [
      "gardien",
      "reception",
      // "caisse_outils",
      "admin",
    ],
    group: "gestion",
    groupOrder: 20,
    order: 10,
  },
  {
    path: "/add/reception",
    component: AddReception,
    sidebar: false,
    roles: [
      "gardien",
      "reception",
      // "caisse_outils",
      "admin",
    ],
    group: "receptions",
  },
  {
    path: "/check-reception",
    component: CheckReception,
    sidebar: true,
    label: (
      <>
        Valider les <br /> réceptions
      </>
    ),
    icon: "check-circle",
    roles: ["reception", "admin"],
    group: "gestion",
    groupOrder: 20,
    order: 20,
  },
  {
    path: "/check/:id",
    component: Check,
    sidebar: false,
    roles: ["reception", "admin"],
    group: "receptions",
  },
  {
    path: "/chronos",
    component: Chronos,
    sidebar: true,
    label: "Chronos",
    icon: "stopwatch",
    roles: [
      "reception",
      // "caisse_outils",
      "admin",
    ],
    group: "gestion",
    groupOrder: 20,
    order: 30,
  },
  {
    path: "/reparations",
    component: Reparations,
    sidebar: true,
    label: "Réparations",
    icon: "wrench",
    roles: ["gardien", "caisse_outils", "admin"],
    group: "gestion",
    groupOrder: 20,
    order: 40,
  },
  //   ----------
  // Docs
  {
    path: "/billets-sortie",
    component: BilletsSortie,
    sidebar: true,
    label: "Billets de sortie",
    icon: "receipt",
    roles: ["reception", "admin", "gardien"],
    group: "documents",
    groupOrder: 30,
    order: 30,
  },
  {
    path: "/factures",
    component: Factures,
    sidebar: true,
    label: "Factures",
    icon: "file-invoice-dollar",
    roles: ["caisse", "admin"],
    group: "documents",
    groupOrder: 30,
    order: 10,
  },
  {
    path: "/vehicules",
    component: Vehicules,
    sidebar: true,
    label: "Véhicules",
    icon: "car-side",
    roles: ["admin", "reception", "caisse_outils", "caisse"],
    group: "documents",
    groupOrder: 30,
    order: 20,
  },
  //   ----------
  // Store
  {
    path: "/outils/caisse",
    component: CaisseOutilsPage,
    sidebar: true,
    label: "Prêt / Restitution",
    icon: "toolbox",
    roles: ["caisse_outils", "admin"],
    group: "store",
    groupOrder: 40,
    order: 10,
  },
  //   ----------
  // Access Denied and Not Found
  {
    path: "/access-denied",
    component: AccessDenied,
    sidebar: false,
    protected: false,
  },
  {
    path: "*",
    component: Login,
    sidebar: false,
    protected: false,
  },
];

export default routes;
