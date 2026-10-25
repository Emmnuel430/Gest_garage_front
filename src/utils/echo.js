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

  const reverbKey = process.env.REVERB_APP_KEY || process.env.REACT_APP_REVERB_APP_KEY;
  const reverbHost = process.env.REVERB_HOST || process.env.REACT_APP_REVERB_HOST || "localhost";
  const reverbPort = Number(process.env.REVERB_PORT || process.env.REACT_APP_REVERB_PORT) || 8080;
  const reverbScheme = process.env.REVERB_SCHEME || process.env.REACT_APP_REVERB_SCHEME || "http";

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
};

export const disconnectEcho = () => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};
