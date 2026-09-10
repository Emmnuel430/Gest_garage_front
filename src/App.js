import "./App.css";
import React from "react";
import AppRoutes from "./routes"; // Importation des routes de l'application
import { ToastProvider } from "./contexts/ToastContext";
import ToastGlobal from "./components/Layout/ToastGlobal";

function App() {
  return (
    <ToastProvider>
      <div className="App">
        <AppRoutes />
        <ToastGlobal />
      </div>
    </ToastProvider>
  );
}

export default App;
