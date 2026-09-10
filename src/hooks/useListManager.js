import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function useListManager({ dataList, alphaField, dateField }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Lire les valeurs depuis l'URL (ou vide par défaut)
  const filter = searchParams.get("filter") || "";
  const sortOption = searchParams.get("sort") || "";

  // 2. Fonctions pour mettre à jour l'URL
  const setFilter = (newFilter) => {
    setSearchParams((prev) => {
      if (newFilter) prev.set("filter", newFilter);
      else prev.delete("filter");
      return prev;
    });
  };

  const setSortOption = (newSort) => {
    setSearchParams((prev) => {
      if (newSort) prev.set("sort", newSort);
      else prev.delete("sort");
      return prev;
    });
  };

  // 3. Calculer les données à afficher (Trie à la volée)
  const processedList = useMemo(() => {
    if (!Array.isArray(dataList)) return [];
    let result = [...dataList];

    if (!sortOption) return result;

    if (sortOption === "updated_desc" && dateField) {
      result.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } else if (sortOption === "alpha" && alphaField) {
      result.sort((a, b) =>
        (a[alphaField] || "").localeCompare(b[alphaField] || ""),
      );
    } else if (
      ["date_auj", "date_semaine", "date_mois", "date_annee"].includes(
        sortOption,
      )
    ) {
      const today = new Date();
      result = result.filter((item) => {
        const itemDate = new Date(item[dateField]);
        if (isNaN(itemDate)) return false;

        switch (sortOption) {
          case "date_auj":
            return itemDate.toDateString() === today.toDateString();
          case "date_semaine":
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);
            return itemDate >= oneWeekAgo && itemDate <= today;
          case "date_mois":
            return (
              itemDate.getMonth() === today.getMonth() &&
              itemDate.getFullYear() === today.getFullYear()
            );
          case "date_annee":
            return itemDate.getFullYear() === today.getFullYear();
          default:
            return true;
        }
      });
    }
    return result;
  }, [dataList, sortOption, alphaField, dateField]);

  // On retourne ce dont les composants ont besoin
  return { filter, setFilter, sortOption, setSortOption, processedList };
}
