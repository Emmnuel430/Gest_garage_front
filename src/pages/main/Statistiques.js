import React, { useEffect, useState } from "react";
import Loader from "../../components/Layout/Loader"; // Assurez-vous que le chemin est correct

const Statistiques = () => {
  const [totaux, setTotaux] = useState(null);
  //   CA - Mecaniciens - Reparées - Temps moyen - EA - valide - TER
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Indique que les données sont en cours de chargement
      setError(null); // Réinitialise l'erreur

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/dashboard_stats`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des logs");
        }

        const data = await response.json(); // Définition de data
        setTotaux(data);
      } catch (error) {
        // console.error("Erreur lors de la récupération des données :", error);
        setError("Impossible de charger les données : " + error.message); // Gestion des erreurs
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour formater le montant
  function formatMontant(montant) {
    if (montant >= 1_000_000_000) {
      return (
        (montant / 1_000_000_000)
          .toFixed(montant % 1_000_000_000 === 0 ? 0 : 1)
          .replace(".", ",") + " Md"
      );
    } else if (montant >= 1_000_000) {
      return (
        (montant / 1_000_000)
          .toFixed(montant % 1_000_000 === 0 ? 0 : 1)
          .replace(".", ",") + " M"
      );
    } else if (montant >= 1_000) {
      return (
        (montant / 1_000)
          .toFixed(montant % 1_000 === 0 ? 0 : 1)
          .replace(".", ",") + " K"
      );
    } else {
      return new Intl.NumberFormat("fr-FR", { useGrouping: true }).format(
        Math.trunc(montant)
      );
    }
  }

  const renderCard = ({ icon, color, title, title2, value }) => (
    // Card pour afficher les totaux
    <div className="col-sm-6 col-xl-3" key={title}>
      <div className="bg-body rounded d-flex align-items-center justify-content-between p-4 border shadow-sm h-100">
        <i className={`fa ${icon} fa-3x text-${color}`}></i>
        <div className="ms-3">
          <div className="mb-2">{title}</div>
          <h6 className="mb-0 h2 text-center" title={title2}>
            {value}
          </h6>
        </div>
      </div>
    </div>
  );

  const cards = [
    // Bénéfice global
    {
      icon: "fa-chart-line",
      color: "success",
      title: "Bénéfice total (FCFA)",
      title2: new Intl.NumberFormat("fr-FR", {
        useGrouping: true,
      }).format(totaux?.benefice_total),
      value: totaux?.benefice_total ? (
        formatMontant(totaux?.benefice_total)
      ) : (
        <span className="text-muted">00</span>
      ),
    },

    // Personnel
    {
      icon: "fa-tools",
      color: "info",
      title: "Nombre de Mécaniciens",
      value: totaux?.mecaniciens_total ?? (
        <span className="text-muted">00</span>
      ),
    },

    // Réceptions (workflow initial)
    {
      icon: "fa-hourglass-half",
      color: "danger",
      title: "Réceptions en attente",
      value: totaux?.receptions_attente ?? (
        <span className="text-muted">00</span>
      ),
    },
    {
      icon: "fa-thumbs-up",
      color: "info",
      title: "Réceptions validées",
      value: totaux?.receptions_validee ?? (
        <span className="text-muted">00</span>
      ),
    },
    {
      icon: "fa-check-double",
      color: "success",
      title: "Réceptions terminées",
      value: totaux?.receptions_terminee ?? (
        <span className="text-muted">00</span>
      ),
    },

    // Réparations (workflow avancé)
    {
      icon: "fa-wrench",
      color: "warning",
      title: "Réparations en cours",
      value: totaux?.reparations_en_cours ?? (
        <span className="text-muted">00</span>
      ),
    },
    {
      icon: "fa-check-circle",
      color: "primary",
      title: "Réparations terminées",
      value: totaux?.reparations_terminees ?? (
        <span className="text-muted">00</span>
      ),
    },

    // Performance
    {
      icon: "fa-clock",
      color: "secondary",
      title: "Temps moyen de réparation (min)",
      value: totaux?.temps_moyen_reparation ? (
        parseFloat(totaux.temps_moyen_reparation).toFixed(2)
      ) : (
        <span className="text-muted">00</span>
      ),
    },
  ];

  return (
    <div>
      {/* Affiche un message d'erreur si une erreur est survenue */}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }} // Centrer Loader au milieu de l'écran
        >
          <Loader />
        </div>
      ) : (
        <>
          {/* Section Totaux */}
          <div className="row g-4 mb-4">
            {/* Section Totaux */}
            {cards.map(renderCard)}
          </div>
        </>
      )}
    </div>
  );
};

export default Statistiques;
