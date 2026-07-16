import React, { useEffect, useState } from "react";
import Loader from "../../components/Layout/Loader"; // Assurez-vous que le chemin est correct
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale"; // Importation pour la localisation française
import { fetchWithToken } from "../../utils/fetchWithToken"; // Fonction utilitaire pour les appels API avec token
import DashboardCards from "../../components/DashboardCards";

const LastSection = () => {
  const [, setTimeState] = useState(Date.now()); // État pour forcer le re-rendu
  const [chronosEnCours, setChronosEnCours] = useState([]); // Nouvel état pour les chronos en cours
  const [facturesImpayees, setFacturesImpayees] = useState([]); // Nouvel état pour les factures impayées
  const [logs, setLogs] = useState([]); // État pour stocker les logs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChronosEnCours();
    fetchFacturesImpayees();
    fetchLogs(); // Appel de la fonction pour récupérer les logs
    const interval = setInterval(() => {
      setTimeState(Date.now()); // Met à jour l'état pour forcer un re-rendu
    }, 59000); // Intervalle de 59 secondes

    return () => clearInterval(interval); // Nettoie l'intervalle lors du démontage
  }, []); // Le tableau vide [] signifie que l'effet ne s'exécute qu'une seule fois après le premier rendu

  const userInfo = JSON.parse(sessionStorage.getItem("user-info")); //
  // Récupération des informations utilisateur

  const fetchChronosEnCours = async () => {
    setLoading(true);
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/dashboard_stats`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des chronos en cours.");
      }
      const data = await response.json();
      setChronosEnCours(data.latest_chronos_en_cours || []); // par sécurité
    } catch (err) {
      setError("Impossible de charger les chronos en cours : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacturesImpayees = async () => {
    setLoading(true);
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/dashboard_stats`
      );
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des factures impayées."
        );
      }
      const data = await response.json();
      setFacturesImpayees(data.latest_factures_impayees || []);
    } catch (err) {
      setError("Impossible de charger les factures impayées : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLoading(true); // Active le spinner global
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/dashboard_stats`
      ); // Appel API
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des derniers logs."); // Gère les erreurs HTTP
      }
      const data = await response.json(); // Parse les données JSON
      // console.log(data);
      setLogs(data.latest_logs);
    } catch (err) {
      setError("Impossible de charger les données : " + err.message); // Stocke le message d'erreur
    } finally {
      setLoading(false); // Désactive le spinner global
    }
  };

  // console.log(resultats);

  const formatDateRelative = (date) => {
    const formatted = formatDistanceToNow(new Date(date), {
      addSuffix: false, // Pas de suffixe (ex. "il y a")
      locale: fr, // Locale française
    });

    if (/moins d.?une minute/i.test(formatted)) {
      return "À l'instant"; // Cas particulier pour "moins d'une minute"
    }

    // Remplacements pour abréger les unités de temps
    const abbreviations = [
      { regex: /environ /i, replacement: "≈" },
      { regex: / heures?/i, replacement: "h" },
      { regex: / minutes?/i, replacement: "min" },
      { regex: / secondes?/i, replacement: "s" },
      { regex: / jours?/i, replacement: "j" },
      { regex: / semaines?/i, replacement: "sem" },
      { regex: / mois?/i, replacement: "mois" },
      { regex: / ans?/i, replacement: "an" },
    ];

    let shortened = formatted;
    abbreviations.forEach(({ regex, replacement }) => {
      shortened = shortened.replace(regex, replacement); // Applique les remplacements
    });

    return shortened; // Retourne la version abrégée
  };

  // Traduction des actions en français
  const getActionLabel = (action) => {
    switch (action) {
      case "add":
        return "Ajout";
      case "update":
        return "M à j.";
      case "delete":
        return "Suppr.";
      case "maj":
        return "M à j.";
      case "create":
        return "Créer";
      case "pause":
        return "Pause";
      case "resume":
        return "Repr.";
      default:
        return "Action inconnue";
    }
  };

  // Couleurs des actions
  const getActionColor = (action) => {
    switch (action) {
      case "add":
        return "bg-success";
      case "update":
        return "bg-primary";
      case "delete":
        return "bg-danger";
      case "maj":
        return "bg-info";
      case "pause":
        return "bg-warning";
      case "resume":
        return "bg-success";
      default:
        return "bg-dark"; // Couleur par défaut pour les actions inconnues
    }
  };

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
