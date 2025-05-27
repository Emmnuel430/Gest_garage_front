import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import Loader from "../../components/Layout/Loader";

const Recents = () => {
  const [receptions, setReceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //   const navigate = useNavigate();

  useEffect(() => {
    fetchReceptions();
  }, []);

  const fetchReceptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/dashboard_stats`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des réceptions.");
      }
      const data = await response.json();
      setReceptions(data.latest_receptions);
    } catch (err) {
      setError("Impossible de charger les données : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const statutColors = {
    attente: "bg-secondary",
    validee: "bg-primary",
    termine: "bg-success",
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <Loader />
        </div>
      ) : (
        <div className="bg-body text-center border rounded p-4 mb-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h6 className="mb-0">Dernières réceptions</h6>
            <Link to="/receptions">Voir</Link>
          </div>
          <div className="table-responsive">
            <Table hover responsive className="centered-table">
              <thead>
                <tr className="text-dark">
                  <th scope="col">ID</th>
                  <th scope="col">Véhicule</th>
                  <th scope="col">Gardien</th>
                  <th scope="col">Statut</th>
                  <th scope="col">Motif</th>
                  <th scope="col">Date d’arrivée</th>
                  {/* <th scope="col">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {receptions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Aucune réception en attente pour le moment.
                    </td>
                  </tr>
                ) : (
                  receptions.map((item) => (
                    <tr key={item.id}>
                      <td>rec-{item.id}</td>
                      <td>
                        {item.vehicule?.marque} {item.vehicule?.modele}
                      </td>
                      <td>
                        {item.gardien?.first_name} {item.gardien?.last_name}
                      </td>
                      <td className="text-center text-uppercase">
                        <span
                          className={`badge ${
                            statutColors[item.statut] || "bg-dark"
                          } text-white`}
                        >
                          {item.statut}
                        </span>
                      </td>
                      <td>{item.motif_visite}</td>
                      <td>{item.date_arrivee}</td>

                      {/* <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => navigate(`/reception/${item.id}`)}
                        >
                          Voir
                        </button>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recents;
