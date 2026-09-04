import React, { useState, useEffect } from "react";
import "../assets/css/Login.css";
import loginImage from "../assets/img/login.png";
import logo from "../assets/img/logo.png";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useToast } from "../contexts/ToastContext";

const Login = () => {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // État pour indiquer le chargement
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (sessionStorage.getItem("user-info")) {
      navigate("/home"); // Redirige si l'utilisateur est déjà connecté
    }
  }, [navigate]);

  async function login(e) {
    e.preventDefault();

    if (!pseudo || !password) {
      showToast("Le pseudo et le mot de passe sont requis", "danger");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ pseudo, password }),
        },
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        showToast(result.error || "Échec de la connexion", "danger");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("user-info", JSON.stringify(result.user));
      sessionStorage.setItem("token", result.access_token);

      setLoading(false);
      navigate("/home");
    } catch (e) {
      showToast("Une erreur inattendue s'est produite.", "danger");
      setLoading(false);
    }
  }

  return (
    <div>
      <section>
        <div className="container">
          <div className="user signinBx">
            <div className="imgBx bg-body">
              <img src={loginImage} alt="Login Illustration" />
            </div>
            <div className="formBx bg-body">
              <img src={logo} alt="Logo" />
              <form onSubmit={login}>
                <h2 className="h2 text-primary">Connexion</h2>
                <label htmlFor="Pseudo">Pseudo</label>
                <input
                  type="text"
                  placeholder="Pseudo"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                />
                <br />
                <br />
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  placeholder="Mot de Passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="d-flex align-items-center mt-3">
                  <input
                    type="submit"
                    className="btn btn-primary m-0"
                    value={loading ? "Connexion ..." : "Connexion"}
                    disabled={loading}
                  />
                  &nbsp;&nbsp;
                  {loading ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                        className="my-auto"
                      />
                    </>
                  ) : null}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
