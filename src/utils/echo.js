import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

let echoInstance = null;

export const getEcho = () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    if (echoInstance) {
      echoInstance.disconnect();
      echoInstance = null;
    }
    return null;
  }

  if (echoInstance) {
    return echoInstance;
  }

  const rawBase =
    process.env.REACT_APP_BASE_URL ||
    (process.env.REACT_APP_API_BASE_URL
      ? process.env.REACT_APP_API_BASE_URL.replace(/\/api\/?$/, "")
      : "http://localhost:8000");

  const cleanBaseUrl = rawBase.replace(/\/+$/, "");

  // Support des deux conventions (priorité à REVERB_* avec fallback sur REACT_APP_REVERB_*)
  const reverbKey =
    process.env.REVERB_APP_KEY ||
    process.env.REACT_APP_REVERB_APP_KEY;

  if (!reverbKey || typeof reverbKey !== "string" || reverbKey.trim() === "") {
    // Si la clé n'est pas renseignée, ne pas instancier Pusher pour éviter l'exception bloquante (page blanche)
    console.warn(
      "[Echo] Clé Reverb absente (REACT_APP_REVERB_APP_KEY manquante). Le WebSocket est inactif, le polling HTTP prend le relais."
    );
    return null;
  }

  const reverbHost =
    process.env.REVERB_HOST ||
    process.env.REACT_APP_REVERB_HOST ||
    "localhost";

  const reverbPort =
    Number(process.env.REVERB_PORT || process.env.REACT_APP_REVERB_PORT) ||
    8080;

  const reverbScheme =
    process.env.REVERB_SCHEME ||
    process.env.REACT_APP_REVERB_SCHEME ||
    "http";

  try {
    echoInstance = new Echo({
      broadcaster: "reverb",
      key: reverbKey,
      wsHost: reverbHost,
      wsPort: reverbPort,
      wssPort: reverbPort,
      forceTLS: reverbScheme === "https",
      enabledTransports: ["ws", "wss"],
      authEndpoint: `${cleanBaseUrl}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    });

    return echoInstance;
  } catch (error) {
    console.warn("[Echo] Erreur lors de l'initialisation de Laravel Echo :", error);
    echoInstance = null;
    return null;
  }
};

export const disconnectEcho = () => {
  if (echoInstance) {
    try {
      echoInstance.disconnect();
    } catch (e) {
      // Ignorer si déjà déconnecté
    }
    echoInstance = null;
  }
};

