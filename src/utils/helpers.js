import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale"; // Importation pour la localisation française
// ----------
export function slugify(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_");
}

export function formatRole(role) {
  if (!role) return "";
  const rolesMap = {
    admin: "Administrateur",
    super_admin: "Administrateur",
    caisse_outils: "Caisse à outils",
    reception: "Réceptionniste",
    secretaire: "Réceptionniste",
    gardien: "Gardien",
    caisse: "Caissier",
    mecanicien: "Mécanicien",
  };
  if (rolesMap[role]) {
    return rolesMap[role];
  }
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatMontant(amount, isDashboard = false) {
  // 1. Validation stricte du montant
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "0 FCFA";
  }

  const num = Number(amount);

  // 2. Mode Dashboard (Abréviations)
  if (isDashboard) {
    if (num >= 1_000_000_000)
      return `${(num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1).replace(".", ",")} Md FCFA`;
    if (num >= 1_000_000)
      return `${(num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1).replace(".", ",")} M FCFA`;
    if (num >= 1_000)
      return `${(num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1).replace(".", ",")} K FCFA`;

    // Si < 1000 en mode dashboard, on tronque et on applique le format standard
    const formattedDash = new Intl.NumberFormat("fr-FR", {
      useGrouping: true,
    }).format(Math.trunc(num));
    return `${formattedDash} FCFA`;
  }

  // 3. Mode Standard (Normal)
  const formattedStandard = new Intl.NumberFormat("fr-FR").format(num);
  return `${formattedStandard} FCFA`;
}

export const formatMinutesToDHMM = (minutes) => {
  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const mins = Math.floor(minutes % 60);

  return (
    [days > 0 && `${days}j`, hours > 0 && `${hours}h`, mins > 0 && `${mins}min`]
      .filter(Boolean)
      .join(" ") || "0min"
  );
};

export const statutColors = {
  attente: "bg-secondary",
  validee: "bg-primary",
  en_reparation: "bg-warning",
  sortie: "bg-info",
  termine: "bg-success",
};

export const statutLabel = {
  attente: (
    <>
      En attente <br /> de validation
    </>
  ),
  validee: "Réception validée",
  en_reparation: "En réparation",
  sortie: "Sorti",
  termine: "Terminé",
};

// Configuration centralisée des styles de badges (Plus doux pour les yeux)
export const STATUT_COLOR_CONFIG = {
  attente: { label: "En attente", bg: "danger" },
  validee: { label: "En réparation", bg: "warning" },
  termine: { label: "Terminée", bg: "success" },
};

// Fonction utilitaire pour formater joliment les dates en français
export const formatTableDate = (dateString) => {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTableName = (tableName) => {
  if (!tableName) return "Non disponible";

  return tableName
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

// Traduction des actions en français
// Les actions backend actuellement utilisées sont : add, update, delete, maj, create, pause, resume.
export const ACTION_LABELS = {
  add: "Ajout",
  update: "M à j.",
  maj: "M à j. (👤)",
  delete: "Suppr.",
  create: "Créer",
  pause: "Pause",
  resume: "Repr.",
};

// Palette Bootstrap dédiée, avec une couleur par action.
export const ACTION_COLORS = {
  add: "success",
  update: "info",
  maj: "info",
  delete: "danger",
  create: "secondary",
  pause: "warning",
  resume: "primary",
};

export const getActionLabel = (action) => {
  return ACTION_LABELS[action] || "Action inconnue";
};

export const getActionColor = (action) => {
  return ACTION_COLORS[action] || "dark";
};

export const formatDateRelative = (date) => {
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

export const getBootstrapSelectTheme = (isDarkMode) => (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    neutral0: isDarkMode ? "#212529" : "#fff",
    neutral80: isDarkMode ? "#f8f9fa" : "#212529",
    primary25: isDarkMode ? "#343a40" : "#e9ecef",
    primary: "#0d6efd",
  },
});

// Fonction pour calculer le temps écoulé
export const renderElapsedTime = (start, end) => {
  const startTime = new Date(start).getTime();
  const endTime = end ? new Date(end).getTime() : Date.now();
  const duration = Math.floor((endTime - startTime) / 1000);

  if (duration <= 0) return "0s";

  // 1. Calculs sous forme de nombres
  const days = Math.floor(duration / (3600 * 24));
  const hours = Math.floor((duration % (3600 * 24)) / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  // 2. Construction d'un tableau de segments valides
  const parts = [];
  if (days > 0) parts.push(`${days}j`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  // 3. Jointure avec un espace
  return parts.join(" ");
};

export const getStatus = (statut) => {
  switch (statut) {
    case "payee":
      return {
        label: "Payée",
        color: "success",
        icon: "fa-check",
      };

    case "generee":
      return {
        label: "À payer",
        color: "warning",
        icon: "fa-file-invoice",
      };

    case "en_attente":
      return {
        label: "À générer",
        color: "secondary",
        icon: "fa-clock",
      };

    default:
      return {
        label: statut || "Inconnu",
        color: "secondary",
        icon: "fa-question",
      };
  }
};

export const formatDateTime = (value) =>
  value ? format(new Date(value), "dd/MM/yyyy à HH:mm") : "N/A";

// Fonction pour formater un numéro de téléphone
export const formatPhoneNumber = (number) => {
  if (!number) return "N/A";
  return number.toString().replace(/(\d{2})(?=(\d{2})+(?!\d))/g, "$1 ");
};

export const filterReceptionsOptions = [
  { value: "", label: "Tous les statuts" },
  { value: "attente", label: "En attente" },
  { value: "validee", label: "En réparation" },
  { value: "termine", label: "Terminé" },
];
