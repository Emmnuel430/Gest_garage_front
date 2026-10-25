import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { getEcho } from "../utils/echo";
import { fetchWithToken } from "../utils/fetchWithToken";
import { useToast } from "./ToastContext";

const NotificationContext = createContext();

const getApiBaseUrl = () => {
  const base = (
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api"
  ).replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
};

const getStoredAuth = () => {
  const token = sessionStorage.getItem("token");
  const userStr = sessionStorage.getItem("user-info");
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch {
      user = null;
    }
  }
  return { token, user };
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState(getStoredAuth);
  const { showToast } = useToast();
  const showToastRef = useRef(showToast);

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  // Synchronisation dynamique de l'état d'authentification
  useEffect(() => {
    const syncAuth = () => {
      const current = getStoredAuth();
      setAuth((prev) => {
        if (
          prev.token !== current.token ||
          prev.user?.id !== current.user?.id ||
          prev.user?.role !== current.user?.role
        ) {
          return current;
        }
        return prev;
      });
    };

    // Écouter les événements de connexion/déconnexion locaux et inter-onglets
    window.addEventListener("storage", syncAuth);
    window.addEventListener("garage-auth-changed", syncAuth);

    // Vérification périodique légère (toutes les 1.5s) pour détecter immédiatement un login sans rechargement
    const interval = setInterval(syncAuth, 1500);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("garage-auth-changed", syncAuth);
      clearInterval(interval);
    };
  }, []);

  const loadNotifications = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetchWithToken(`${getApiBaseUrl()}/notifications`);
      if (res && res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
          setUnreadCount(Number(data.unread_count) || 0);
        }
      }
    } catch (err) {
      console.error("Erreur chargement notifications :", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Écoute WebSocket temps réel via Reverb / Laravel Echo
  useEffect(() => {
    const { token, user } = auth;
    if (!token || !user || !user.id) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const echo = getEcho();
    if (!echo) return;

    const userId = user.id;
    const userRole = user.role || "admin";

    // Gestionnaire centralisé pour formater et insérer une notification entrante
    const handleIncomingNotification = (raw) => {
      const formatted = {
        id: raw.id || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: raw.title || "Notification",
        message: raw.message || "",
        type: raw.type || "info",
        action_url: raw.action_url || raw.actionUrl || null,
        created_at: raw.created_at || "À l'instant",
        read: false,
      };

      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === formatted.id);
        if (exists) return prev;
        return [formatted, ...prev.slice(0, 29)];
      });

      setUnreadCount((prev) => prev + 1);

      if (showToastRef.current) {
        showToastRef.current(
          formatted.message || formatted.title,
          formatted.type || "info"
        );
      }
    };

    // 1. Canal personnel format court : user.{id}
    const userChannel = echo.private(`user.${userId}`);
    userChannel.notification((notification) => {
      handleIncomingNotification(notification);
    });

    // 2. Canal personnel format standard Laravel : App.Models.User.{id}
    const modelUserChannel = echo.private(`App.Models.User.${userId}`);
    modelUserChannel.notification((notification) => {
      handleIncomingNotification(notification);
    });

    // 3. Canal de rôle opérationnel : garage.1.role.{role}
    const roleChannel = echo.private(`garage.1.role.${userRole}`);
    roleChannel.listen(".garage.alert", (data) => {
      handleIncomingNotification(data);
    });

    // Chargement initial pour l'utilisateur connecté
    loadNotifications();

    // Rafraîchissement automatique au focus de l'onglet et toutes les 25 secondes
    const handleFocus = () => loadNotifications();
    window.addEventListener("focus", handleFocus);
    const syncInterval = setInterval(loadNotifications, 25000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(syncInterval);
      if (echo) {
        echo.leave(`user.${userId}`);
        echo.leave(`App.Models.User.${userId}`);
        echo.leave(`garage.1.role.${userRole}`);
      }
    };
  }, [auth, loadNotifications]);

  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await fetchWithToken(`${getApiBaseUrl()}/notifications/${id}/read`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Erreur markAsRead :", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      await fetchWithToken(`${getApiBaseUrl()}/notifications/read-all`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Erreur markAllAsRead :", err);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        loadNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
