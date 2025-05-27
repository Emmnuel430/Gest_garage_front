import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importez Link pour les redirections
import { Table } from "react-bootstrap";
import Loader from "../../components/Layout/Loader"; // Assurez-vous que le chemin est correct
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale"; // Importation pour la localisation française

const LastSection = () => {
  const [, setTimeState] = useState(Date.now()); // État pour forcer le re-rendu
  const [chronosEnCours, setChronosEnCours] = useState([]); // Nouvel état pour les chronos en cours
  const [facturesImpayees, setFacturesImpayees] = useState([]); // Nouvel état pour les factures impayées
  const [logs, setLogs] = useState([]); // État pour stocker les logs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Navigation entre les pages

  useEffect(() => {
    fetchChronosEnCours();
    fetchFacturesImpayees();
    fetchLogs(); // Appel de la fonction pour récupérer les logs
    const interval = setInterval(() => {
      setTimeState(Date.now()); // Met à jour l'état pour forcer un re-rendu
    }, 59000); // Intervalle de 59 secondes

    return () => clearInterval(interval); // Nettoie l'intervalle lors du démontage
  }, []); // Le tableau vide [] signifie que l'effet ne s'exécute qu'une seule fois après le premier rendu

  const userInfo = JSON.parse(localStorage.getItem("user-info")); //
  // Récupération des informations utilisateur

  const fetchChronosEnCours = async () => {
    setLoading(true);
    try {
      const response = await fetch(
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
      const response = await fetch(
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
      const response = await fetch(
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
      default:
        return "bg-warning";
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
          <div className="row g-4">
            {/* Factures impayée */}
            <div className="col-sm-12 col-md-6 col-xl-4">
              <div className="h-100 bg-body rounded border p-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="mb-0">Factures impayées</h6>
                  {(userInfo?.role === "super_admin" ||
                    userInfo?.role === "caisse") && (
                    <Link to="/factures">Voir</Link>
                  )}
                </div>
                {facturesImpayees.length > 0 ? (
                  facturesImpayees
                    .slice(0, 3) // Limite à 3 factures
                    .map((facture, index) => (
                      <div
                        key={index}
                        className={`d-flex align-items-center border shadow-sm rounded p-3 mb-2 
                          border-danger bg-danger-subtle
                      `}
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          navigate(`/factures`);
                        }}
                      >
                        <i
                          className={`bi
                              bi-exclamation-triangle-fill text-danger
                          `}
                          style={{ fontSize: "2rem" }}
                        ></i>
                        <div className="w-100 ms-3">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className={`mb-0 fw-bold text-danger`}>
                              {userInfo?.role === "super_admin" ||
                              userInfo?.role === "caisse" ? (
                                <>
                                  La facture du véhicule{" "}
                                  <strong>
                                    {
                                      facture.reception?.vehicule
                                        ?.immatriculation
                                    }
                                  </strong>{" "}
                                  n'a pas encore été réglée !
                                </>
                              ) : (
                                <>
                                  Vous n'avez pas les droits pour voir les
                                  factures.
                                </>
                              )}
                            </h6>
                            <small className="text-muted">
                              {formatDateRelative(facture.date_generation)}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center text-muted h-100 d-flex align-items-center justify-content-center">
                    Tout baigne pour l'instant.
                  </div>
                )}
              </div>
            </div>
            {/* Derniers logs */}
            <div className="col-sm-12 col-md-6 col-xl-4">
              <div className="h-100 bg-body rounded border p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h6 className="mb-0">Logs (admin only)</h6>
                  {userInfo?.role === "super_admin" && (
                    <Link to="/logs">Voir</Link>
                  )}
                </div>
                <div className="d-flex flex-column align-items-center">
                  {userInfo?.role === "super_admin" ? (
                    logs.length > 0 ? (
                      <>
                        <Table hover className="centered-table w-100">
                          <tbody>
                            {logs.map((log, index) => (
                              <tr key={index}>
                                <td>
                                  <span
                                    className={`${getActionColor(
                                      log.action
                                    )} text-uppercase text-white rounded-pill px-2 py-1`}
                                  >
                                    {log.action}
                                  </span>
                                </td>
                                <td className="text-capitalize">
                                  {log.table_concernee}
                                </td>
                                <td>{formatDateRelative(log.created_at)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </>
                    ) : (
                      <div className="text-center text-muted h-100 d-flex align-items-center justify-content-center">
                        Aucun log disponible.
                      </div>
                    )
                  ) : (
                    <div className="text-center text-danger h-100 d-flex align-items-center justify-content-center">
                      Vous n'avez pas les droits pour voir les logs.
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Chronos en cours */}
            <div className="col-sm-12 col-md-6 col-xl-4">
              <div className="h-100 bg-body rounded border p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h6 className="mb-0">Chronos en cours</h6>
                  <Link to="/chronos">Voir</Link>
                </div>
                <div className="d-flex flex-column align-items-center py-2">
                  {chronosEnCours.length > 0 ? (
                    chronosEnCours.map((chrono, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center border-bottom w-100 pb-1 mb-2"
                      >
                        <i
                          className={`fa fa-clock text-warning`}
                          style={{ fontSize: "2rem" }}
                        ></i>
                        <div className="w-100 ms-3">
                          <div className="w-100 d-flex align-items-center justify-content-between">
                            <p className="mb-0">
                              <span>Debut : </span>
                              {formatDateRelative(chrono.start_time)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted h-100 d-flex align-items-center justify-content-center">
                      Aucun chrono en cours.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LastSection;
