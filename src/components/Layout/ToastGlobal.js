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
      className="position-fixed top-0 start-50 translate-middle-x mt-3 px-3"
      style={{
        zIndex: 1085,
        maxWidth: "min(520px, calc(100vw - 24px))",
        width: "100%",
        pointerEvents: "none",
      }}
    >
      <div
        className={`toast show align-items-center rounded-3 p-1 ${config.colorClass}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ pointerEvents: "auto" }}
      >
        <div className="d-flex align-items-center justify-content-between py-1 px-2">
          <div className="toast-body d-flex align-items-center fw-medium py-1 px-2 text-break">
            <i className={`${config.icon} fs-5 me-2 flex-shrink-0`}></i>
            <span style={{ fontSize: "0.88rem", lineHeight: "1.4" }}>
              {toast.message}
            </span>
          </div>
          <button
            type="button"
            className={`btn-close flex-shrink-0 ms-2 me-1 ${
              config.isDarkBtn ? "btn-close-white" : ""
            }`}
            onClick={() => setToast({ ...toast, show: false })}
            aria-label="Fermer"
          ></button>
        </div>
      </div>
    </div>
  );
};

export default ToastGlobal;
