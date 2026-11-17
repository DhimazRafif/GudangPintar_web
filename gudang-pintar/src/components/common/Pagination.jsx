import React from "react";
import SelectControl from "./SelectControl";
import "./Pagination.css";

export const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20, 50, "all"].map((size) => ({
  value: String(size),
  label: size === "all" ? "Semua" : String(size),
}));

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  ariaLabel = "Navigasi Halaman",
  pageSize,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  pageSizeLabel = "Tampilkan",
  itemLabel = "item",
  scrollToTop = true,
}) {
  const showPageSize = pageSize !== undefined && Boolean(onPageSizeChange);
  if (totalPages <= 1 && !showPageSize) return null;

  const handleSelect = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
    if (scrollToTop) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className={`gp-pagination-bar${showPageSize ? " gp-pagination-bar--with-size" : ""}`}>
      {showPageSize && (
        <div className="gp-pagination-size">
          <span>{pageSizeLabel}</span>
          <SelectControl
            id={`${ariaLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-page-size`}
            className="gp-pagination-size-field"
            selectClassName="form-select-sm"
            options={pageSizeOptions}
            value={String(pageSize)}
            onChange={(value) => {
              onPageSizeChange(value);
              onPageChange(1);
            }}
            aria-label={`Jumlah ${itemLabel} per halaman`}
          />
          <span>{itemLabel} per halaman</span>
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label={ariaLabel} className="gp-pagination-nav">
          <ul className="pagination pagination-sm mb-0 shadow-sm">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                type="button"
                className="page-link text-success"
                onClick={() => handleSelect(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Halaman Sebelumnya"
                title="Ke halaman sebelumnya"
              >
                &laquo;prev
              </button>
            </li>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <li key={`ellipsis-${index}`} className="page-item disabled">
                  <span className="page-link text-secondary">...</span>
                </li>
              ) : (
                <li
                  key={page}
                  className={`page-item ${currentPage === page ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className={`page-link ${
                      currentPage === page
                        ? "bg-success border-success text-white fw-bold"
                        : "text-success"
                    }`}
                    onClick={() => handleSelect(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    title={`Halaman ${page}`}
                  >
                    {page}
                  </button>
                </li>
              ),
            )}

            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                type="button"
                className="page-link text-success"
                onClick={() => handleSelect(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Halaman Berikutnya"
                title="Ke halaman berikutnya"
              >
                Next &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
