import React from "react";
import Loader from "../../components/Layout/Loader";
import { formatMinutesToDHMM, formatMontant } from "../../utils/helpers";

const Statistiques = ({ totals = {}, loading = false }) => {
  // Composant interne pour une carte propre et moderne
  const StatCard = ({ icon, color, title, subtitle, value }) => (
    <div className="col-sm-6 col-xl-4">
      <div className="card h-100 border shadow-sm rounded-4 bg-body">
        <div className="card-body p-4 d-flex flex-column justify-content-between">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="text-muted fw-medium small text-uppercase tracking-wider">
              {title}
            </span>
            <div
              className={`p-3 rounded-3 bg-${color}-subtle text-${color} d-flex align-items-center justify-content-center`}
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: `var(--bs-${color}-bg-subtle)`,
              }}
            >
              <i className={`fa ${icon} fs-4`}></i>
            </div>
          </div>
          <div>
            <h3 className="mb-1 fw-bold tracking-tight">{value}</h3>
            {subtitle && <p className="mb-0 text-muted small">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  // Valeurs par défaut sécurisées
  const bTotal = totals?.benefice_total ?? 0;
  const formatedFullBenefice =
    new Intl.NumberFormat("fr-FR").format(bTotal) + " FCFA";

  return (
    <div className="container-fluid py-3">
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <Loader />
        </div>
      ) : (
        <div className="row g-4">
          {/* GROUPE 1 : FINANCES & RESSOURCES */}
          <StatCard
            icon="fa-wallet"
            color="success"
            title="Bénéfice Global"
            subtitle={
              bTotal > 1000
                ? `Total précis : ${formatedFullBenefice}`
                : "Revenus de la période"
            }
            value={formatMontant(bTotal, true)}
          />
          <StatCard
            icon="fa-users"
            color="info"
            title="Mécaniciens"
            subtitle="Effectif total actif"
            value={totals?.mecaniciens_total ?? 0}
          />
          <StatCard
            icon="fa-clock"
            color="secondary"
            title="Temps Moyen"
            subtitle="Par réparation"
            value={
              totals?.temps_moyen_reparation
                ? formatMinutesToDHMM(totals.temps_moyen_reparation)
                : "--"
            }
          />

          {/* GROUPE 2 : WORKFLOW RÉPARATIONS */}
          <StatCard
            icon="fa-wrench"
            color="warning"
            title="Réparations en cours"
            subtitle={`Véhicule${totals?.mecaniciens_en_cours > 1 ? "s" : ""} en trav${totals?.mecaniciens_en_cours > 1 ? "aux" : "ail"}`}
            value={totals?.reparations_en_cours ?? 0}
          />

          {/* GROUPE 3 : WORKFLOW RÉCEPTIONS */}
          <StatCard
            icon="fa-hourglass-half"
            color="danger"
            title="Réceptions en attente"
            subtitle={
              totals?.receptions_attente === 0
                ? "Aucun véhicule en attente"
                : "À prendre en charge rapidement"
            }
            value={totals?.receptions_attente ?? 0}
          />
          {/* <StatCard
            icon="fa-user-check"
            color="primary"
            title="Réceptions validées"
            subtitle="Prêtes pour la réparation"
            value={totaux?.receptions_validee ?? 0}
          />
          <StatCard
            icon="fa-clipboard-check"
            color="success"
            title="Réceptions terminées"
            subtitle="Historique des fiches closes"
            value={totaux?.receptions_terminee ?? 0}
          /> */}
          <StatCard
            icon="fa-check-double"
            color="success"
            title="Réparations terminées"
            subtitle={`Véhicule${totals?.reparations_terminees > 1 ? "s" : ""} réparé${totals?.reparations_terminees > 1 ? "s" : ""}`}
            value={totals?.reparations_terminees ?? 0}
          />
        </div>
      )}
    </div>
  );
};

export default Statistiques;
