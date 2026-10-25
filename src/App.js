import "./App.css";
import React from "react";
import AppRoutes from "./routes";
import { ToastProvider } from "./contexts/ToastContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ToastGlobal from "./components/Layout/ToastGlobal";

function App() {
  return (
    <ToastProvider>
      <NotificationProvider>
        <div className="App">
          <AppRoutes />
          <ToastGlobal />
        </div>
      </NotificationProvider>
    </ToastProvider>
  );
}

export default App;
