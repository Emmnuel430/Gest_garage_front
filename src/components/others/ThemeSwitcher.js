import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("light");
  const [manualOverride, setManualOverride] = useState(false);

  const applyTheme = (newTheme, manual = false) => {
    document.body.setAttribute("data-bs-theme", newTheme);
    setTheme(newTheme);
    if (manual) {
      localStorage.setItem("themeOverride", newTheme);
      setManualOverride(true);
    }
  };

  const isNightTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    return hour >= 18 || hour < 6 || (hour === 6 && minute <= 30);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("themeOverride");
    if (savedTheme) {
      applyTheme(savedTheme);
      setManualOverride(true);
    } else {
      applyTheme(isNightTime() ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    applyTheme(newTheme, true);
  };

  const resetTheme = () => {
    localStorage.removeItem("themeOverride");
    setManualOverride(false);
    applyTheme(isNightTime() ? "dark" : "light");
  };

  return (
    <div className="nav-item dropdown">
      <button className="nav-link dropdown-toggle">
        <i className={`fa ${theme === "dark" ? "fa-moon" : "fa-sun"} me-2`}></i>{" "}
        <span className="d-none d-lg-inline-flex items text-body">Thème</span>
      </button>

      <div className="dropdown-menu dropdown-menu-end bg-body border-0 rounded-bottom m-0 p-3">
        {/* Switch moderne */}
        <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
          {/* Soleil */}
          <i className="fa fa-sun text-warning fs-5"></i>

          {/* Toggle */}
          <div
            onClick={toggleTheme}
            style={{
              cursor: "pointer",
              width: "50px",
              height: "26px",
              borderRadius: "50px",
              backgroundColor: theme === "dark" ? "#0d6efd" : "#ffc107",
              position: "relative",
              transition: "background-color 0.3s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: theme === "dark" ? "28px" : "2px",
                transform: "translateY(-50%)",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "left 0.3s",
              }}
            >
              <i
                className={`fa ${
                  theme === "dark"
                    ? "fa-moon text-primary"
                    : "fa-sun text-warning"
                }`}
                style={{ fontSize: "12px" }}
              ></i>
            </div>
          </div>

          {/* Lune */}
          <i className="fa fa-moon text-primary fs-5"></i>
        </div>

        {manualOverride && (
          <>
            <small
              className="text-muted d-block mb-2"
              style={{ fontSize: "0.75rem" }}
            >
              Thème défini manuellement
            </small>
            <button
              className="btn btn-sm btn-outline-secondary w-100"
              onClick={resetTheme}
            >
              Réinitialiser
            </button>
          </>
        )}
      </div>
    </div>
  );
}