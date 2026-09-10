import { Table } from "react-bootstrap";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import moment from "moment";

const MecanicienDetails = ({ mecanicien, formatPhoneNumber, formatStatut }) => {
  if (!mecanicien) return null;

  const isInterne = mecanicien.type === "interne";

  const reparations = [...(mecanicien.reparations || [])].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  const formatDateTime = (date) => {
    if (!date) return "Non disponible";

    return format(new Date(date), "dd/MM/yyyy HH:mm");
  };

  return (
    <div className="container-fluid px-1">
      {/* =====================================
          HEADER MÉCANICIEN
      ===================================== */}
      <div className="bg-body-tertiary border rounded-3 p-3 mb-3">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            {/* Avatar */}
            <div
              className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5"
              style={{
                width: "52px",
                height: "52px",
                flexShrink: 0,
              }}
            >
              {mecanicien.prenom?.charAt(0)?.toUpperCase()}
              {mecanicien.nom?.charAt(0)?.toUpperCase()}
            </div>

            {/* Identité */}
            <div>
              <h6 className="fw-bold mb-1">
                {mecanicien.prenom || ""} {mecanicien.nom || ""}
              </h6>

              <span className="text-muted small">Mécanicien</span>
            </div>
          </div>

          {/* Type */}
          <span
            className={`badge bg-${
              isInterne ? "success" : "info"
            }-subtle text-${isInterne ? "success" : "info"} border border-${
              isInterne ? "success" : "info"
            }-subtle rounded-pill px-3 py-2`}
          >
            <i
              className={`fas ${
                isInterne ? "fa-user-check" : "fa-user-tie"
              } me-1`}
            ></i>

            {isInterne ? "Interne" : "Externe"}
          </span>
        </div>
      </div>

      {/* =====================================
          INFORMATIONS PERSONNELLES
      ===================================== */}
      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Informations personnelles
        </div>

        <div className="border rounded-3 overflow-hidden">
          {/* ID */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Identifiant</span>

            <span className="badge bg-body text-secondary border fw-medium">
              MEC-{String(mecanicien.id).padStart(4, "0")}
            </span>
          </div>

          {/* Expérience */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Expérience</span>

            <span className="fw-semibold text-end">
              {mecanicien.experience
                ? `${mecanicien.experience} an${
                    Number(mecanicien.experience) > 1 ? "s" : ""
                  }`
                : "Non renseignée"}
            </span>
          </div>

          {/* Véhicules maîtrisés */}
          <div className="d-flex justify-content-between align-items-start px-3 py-3">
            <span className="text-muted small">Véhicules maîtrisés</span>

            <span
              className="fw-semibold text-end text-capitalize"
              style={{ maxWidth: "60%" }}
            >
              {mecanicien.vehicules_maitrises || "Non renseignés"}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================
          CONTACTS
      ===================================== */}
      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Coordonnées
        </div>

        <div className="border rounded-3 overflow-hidden">
          {/* Téléphone */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-phone-alt text-muted"></i>

              <span className="text-muted small">Téléphone</span>
            </div>

            <span className="fw-semibold">
              {mecanicien.contact
                ? formatPhoneNumber(mecanicien.contact)
                : "Non renseigné"}
            </span>
          </div>

          {/* Urgence */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3">
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-phone-volume text-danger"></i>

              <span className="text-muted small">Contact d'urgence</span>
            </div>

            <span className="fw-semibold">
              {mecanicien.contact_urgence
                ? formatPhoneNumber(mecanicien.contact_urgence)
                : "Non renseigné"}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================
          HISTORIQUE
      ===================================== */}
      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Historique
        </div>

        <div className="border rounded-3 overflow-hidden">
          {/* Création */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <span className="text-muted small">Date d'ajout</span>

            <span className="fw-semibold text-end">
              {formatDateTime(mecanicien.created_at)}
            </span>
          </div>

          {/* Modification */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3">
            <span className="text-muted small">Dernière modification</span>

            <span className="fw-semibold text-end">
              {mecanicien.updated_at === mecanicien.created_at
                ? "Aucune modification"
                : formatDateTime(mecanicien.updated_at)}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================
          DOCUMENT
      ===================================== */}
      <div className="mb-3">
        <div className="small text-muted text-uppercase fw-bold mb-2">
          Documents
        </div>

        <div className="border rounded-3 p-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "38px",
                height: "38px",
                flexShrink: 0,
              }}
            >
              <i className="fas fa-file-alt"></i>
            </div>

            <div>
              <span className="fw-semibold d-block">Fiche d'enrôlement</span>

              <span className="text-muted small">
                Document d'enregistrement
              </span>
            </div>
          </div>

          {mecanicien.fiche_enrolement ? (
            <Link
              to={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${mecanicien.fiche_enrolement}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary btn-sm"
            >
              <i className="fas fa-external-link-alt me-1"></i>
              Voir
            </Link>
          ) : (
            <span className="text-muted small">Non disponible</span>
          )}
        </div>
      </div>

      {/* =====================================
          RÉPARATIONS
      ===================================== */}
      <div>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="small text-muted text-uppercase fw-bold">
            Véhicules réparés
          </div>

          {reparations.length > 0 && (
            <span className="badge bg-body text-secondary border">
              {reparations.length}
            </span>
          )}
        </div>

        <div className="border rounded-3 overflow-hidden">
          {reparations.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <i className="fas fa-car fa-2x mb-2 d-block text-black-50"></i>
              Aucune réparation enregistrée.
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover align="middle" className="mb-0">
                <thead className="bg-body-tertiary text-muted small text-uppercase">
                  <tr>
                    <th className="ps-3 py-3">Véhicule</th>

                    <th className="py-3">Arrivée</th>

                    <th className="py-3">Sortie</th>

                    <th className="py-3 text-center pe-3">Statut</th>
                  </tr>
                </thead>

                <tbody>
                  {reparations.map((rep) => {
                    const vehicle = rep.reception?.vehicule;

                    const isTermine = rep.statut === "termine";

                    return (
                      <tr key={rep.id} className="align-middle">
                        {/* Véhicule */}
                        <td className="ps-3">
                          <div>
                            <span className="badge bg-dark font-monospace px-2 py-1 mb-1">
                              {vehicle?.immatriculation || "N/A"}
                            </span>

                            <span className="text-muted small d-block">
                              {vehicle?.marque || "—"} {vehicle?.modele || ""}
                            </span>
                          </div>
                        </td>

                        {/* Arrivée */}
                        <td className="text-secondary small">
                          <div className="text-secondary small">
                            <span className="fw-semibold d-block">
                              {moment(rep.reception?.date_arrivee).format(
                                "DD/MM/YYYY",
                              )}
                            </span>

                            <span className="text-muted">
                              {moment(rep.reception?.date_arrivee).format(
                                "HH:mm",
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Sortie */}
                        <td className="text-secondary small">
                          {isTermine ? (
                            <div className="text-secondary small">
                              <span className="fw-semibold d-block">
                                {moment(rep.updated_at).format("DD/MM/YYYY")}
                              </span>

                              <span className="text-muted">
                                {moment(rep.updated_at).format("HH:mm")}
                              </span>
                            </div>
                          ) : (
                            "En cours"
                          )}
                        </td>

                        {/* Statut */}
                        <td className="text-center pe-3">
                          <span
                            className={`badge bg-${
                              isTermine ? "success" : "warning"
                            }-subtle text-${
                              isTermine ? "success" : "warning-emphasis"
                            } border border-${
                              isTermine ? "success" : "warning"
                            }-subtle rounded-pill px-2 py-1 text-capitalize`}
                          >
                            {formatStatut(rep.statut)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MecanicienDetails;
