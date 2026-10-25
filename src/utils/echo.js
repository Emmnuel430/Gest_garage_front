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

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: process.env.REACT_APP_REVERB_APP_KEY,
    wsHost: process.env.REACT_APP_REVERB_HOST || "localhost",
    wsPort: Number(process.env.REACT_APP_REVERB_PORT) || 8080,
    wssPort: Number(process.env.REACT_APP_REVERB_PORT) || 8080,
    forceTLS: (process.env.REACT_APP_REVERB_SCHEME || "http") === "https",
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
};

export const disconnectEcho = () => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};
