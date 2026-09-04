import { useCallback, useState } from "react";

const usePagination = (totalPages = 1) => {
  const [currentPage, setCurrentPage] = useState(1);
  const safeTotalPages = Math.max(1, totalPages || 1);

  const goToPage = useCallback(
    (page) => {
      const maxPages = Math.max(1, totalPages || 1);
      if (page >= 1 && page <= maxPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages: safeTotalPages,
    goToPage,
    nextPage,
    previousPage,
    reset,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < safeTotalPages,
  };
};

export default usePagination;
