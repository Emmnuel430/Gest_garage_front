import React from "react";
import { Card, Button } from "react-bootstrap";
import moment from "moment";
import BadgeVehicule from "../../others/BadgeVehicule";
import { renderElapsedTime } from "../../../utils/helpers";

const ChronoCard = ({
  chrono,
  userRole,
  onPause,
  onResume,
  pauseLoadingIds = [],
  resumeLoadingIds = [],
}) => {
  const isAdmin = userRole === "admin";
  const isPaused = Boolean(chrono.pause_time);
  const isPauseLoading = pauseLoadingIds.includes(chrono.id);
  const isResumeLoading = resumeLoadingIds.includes(chrono.reception?.id);

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <Card className="shadow-sm h-100 d-flex flex-column align-items-center">
        <Card.Body className="d-flex flex-column justify-content-between align-items-center text-center p-4">
          <div>
            <Card.Title className="mb-3">
              <BadgeVehicule
                immatriculation={chrono.reception?.vehicule?.immatriculation}
                marque={chrono.reception?.vehicule?.marque}
                modele={chrono.reception?.vehicule?.modele}
                orientation="vertical"
              />
            </Card.Title>

            <Card.Text className="text-muted small mb-3">
              Démarré le{" "}
              {moment(chrono.start_time).format("DD/MM/YYYY à HH:mm")}
            </Card.Text>

            <Card.Text className="mb-2">
              <span className="text-secondary small d-block mb-1">
                Temps écoulé
              </span>
              <span
                className={`fw-bold h2 d-block ${
                  isPaused ? "text-warning-emphasis" : "text-success"
                }`}
              >
                {renderElapsedTime(
                  chrono.start_time,
                  chrono.pause_time || chrono.end_time,
                )}
              </span>
            </Card.Text>

            {isPaused && (
              <div className="mb-2">
                <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-1 rounded-pill small fw-semibold">
                  <i className="fas fa-pause me-1 text-xs"></i> En pause
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 w-100 px-3">
            {isAdmin &&
              !chrono.end_time &&
              (isPaused ? (
                <Button
                  variant="success"
                  className="w-100 rounded-pill shadow-sm"
                  onClick={() => onResume(chrono.reception?.id)}
                  disabled={isResumeLoading}
                >
                  {isResumeLoading ? (
                    <span>
                      <i className="fas fa-spinner fa-spin me-1"></i> Reprise...
                    </span>
                  ) : (
                    <span>
                      <i className="fas fa-play me-1"></i> Reprendre
                    </span>
                  )}
                </Button>
              ) : (
                <Button
                  variant="outline-secondary"
                  className="w-100 rounded-pill"
                  onClick={() => onPause(chrono)}
                  disabled={isPauseLoading}
                >
                  {isPauseLoading ? (
                    <span>
                      <i className="fas fa-spinner fa-spin me-1"></i> Pause...
                    </span>
                  ) : (
                    <span>
                      <i className="fas fa-pause me-1"></i> Mettre en pause
                    </span>
                  )}
                </Button>
              ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChronoCard;
