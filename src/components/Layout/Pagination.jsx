import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];

  for (let page = 1; page <= totalPages; page++) {
    if (
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
    ) {
      pages.push(page);
    }
  }

  return (
    <nav className="mt-3">
      <ul className="pagination justify-content-center mb-0">
        {/* Précédent */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            type="button"
            className="page-link"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <i className="fas fa-chevron-left me-1"></i>
            Précédent
          </button>
        </li>

        {/* Pages */}
        {pages.map((page, index) => {
          const previousPage = pages[index - 1];

          const showEllipsis = index > 0 && page - previousPage > 1;

          return (
            <React.Fragment key={page}>
              {showEllipsis && (
                <li className="page-item disabled">
                  <span className="page-link">…</span>
                </li>
              )}

              <li
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            </React.Fragment>
          );
        })}

        {/* Suivant */}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            type="button"
            className="page-link"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Suivant
            <i className="fas fa-chevron-right ms-1"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
