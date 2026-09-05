// Importation des dépendances React et des composants nécessaires de React Router
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protected from "./components/Protected"; // Composant pour protéger les routes
import routes from "./routeConfig";
import ScrollToTop from "./utils/ScrollToTop";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {routes.map((route) => {
          const element =
            route.protected === false ? (
              <route.component />
            ) : (
              <Protected
                Cmp={route.component}
                adminOnly={route.adminOnly}
                roles={route.roles}
              />
            );

          return <Route key={route.path} path={route.path} element={element} />;
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
