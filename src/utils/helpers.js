export function slugify(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_");
}

export function formatRole(role) {
  if (!role) return "";
  return role
    .split("_") // coupe par "_"
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // met en majuscule la première lettre
    .join(" "); // re-colle avec des espaces
}
