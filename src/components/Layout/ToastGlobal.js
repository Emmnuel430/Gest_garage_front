import React from "react";
import { useToast } from "../../contexts/ToastContext";
import { TOAST_CONFIG } from "../../constants/ToastConfig";

const ToastGlobal = () => {
  const { toast, setToast } = useToast();

  if (!toast.show) return null;

  // Fallback sur 'info' si le type n'est pas reconnu
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;

  return (
    <div
      className="position-fixed top-0 start-50 translate-middle-x mt-4 p-3"
      style={{ zIndex: 1055 }} // 1055 est le z-index standard Bootstrap pour les overlays
    >
      <div
        className={`toast show align-items-center border-0 shadow-lg ${config.colorClass}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body d-flex align-items-center fw-medium">
            <i className={`${config.icon} me-3`}></i>
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            className="btn-close me-2 m-auto"
            data-bs-theme={config.btnTheme}
            onClick={() => setToast({ ...toast, show: false })}
            aria-label="Fermer"
          ></button>
        </div>
      </div>
    </div>
  );
};

export default ToastGlobal;
