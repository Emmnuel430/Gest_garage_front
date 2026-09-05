import React, { useEffect, useState } from "react";
import Loader from "../../components/Layout/Loader";
import DashboardCards from "../../components/DashboardCards";
import {
  formatDateRelative,
  getActionColor,
  getActionLabel,
} from "../../utils/helpers";

const LastSection = ({
  userInfo,
  facturesImpayees = [],
  logs = [],
  chronosEnCours = [],
  loading = false,
}) => {
  const [, setTimeState] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeState(Date.now());
    }, 59000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }} // Centrer Loader au milieu de l'écran
        >
          <Loader />
        </div>
      ) : (
        <>
          <DashboardCards
            userInfo={userInfo}
            facturesImpayees={facturesImpayees}
            logs={logs}
            chronosEnCours={chronosEnCours}
            formatDateRelative={formatDateRelative}
            getActionColor={getActionColor}
            getActionLabel={getActionLabel}
          />
        </>
      )}
    </div>
  );
};

export default LastSection;
