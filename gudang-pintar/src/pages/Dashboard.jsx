import React, { useState, useEffect } from "react";
import ItemCard from "../components/ItemCard";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardSummary from "../components/DashboardSummary";
import "./dashboard-style.css";
import useFetch from "../hooks/useFetch";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [showNotification, setShowNotification] = useState(true);
  const { data: items, isLoading, error, refetch } = useFetch("/barang.json");

  const currentItems = items || [];
  const filteredItems = currentItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const warningItemsCount = currentItems.filter(
    (item) => item.quantity <= item.notification_threshold,
  ).length;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const displayedItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scroll({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="dashboard-layout d-flex">
        <Sidebar />

        <main className="main-content flex-grow-1">
          <div className="container-fluid p-3">
            {showNotification &&
              warningItemsCount > 0 &&
              !isLoading &&
              !error && (
                <div
                  className="alert alert-warning shadow-sm d-flex align-items-center justify-content-between mb-4"
                  role="alert"
                  style={{ borderLeft: "5px solid #ffc107" }}
                >
                  <div>
                    <span className="fs-5 me-2"></span>
                    <strong>Perhatian!</strong> Terdapat{" "}
                    <strong>{warningItemsCount} barang</strong> yang stoknya
                    menipis atau habis. Segera lakukan pengecekan.
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowNotification(false)}
                    aria-label="Close"
                  ></button>
                </div>
              )}
            <h1 className="dashboard-title">Daftar Barang</h1>
            <p className="dashboard-description">
              Pantau jumlah dan status stok barang di gudang.
            </p>

            {error && (
              <div
                className="alert alert-danger text-center shadow-sm"
                role="alert"
              >
                <p className="mb-2">{error}</p>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={refetch}
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {isLoading && !error && (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-secondary">Memuat data barang...</p>
              </div>
            )}

            {!isLoading && !error && (
              <>
                <DashboardSummary items={filteredItems} />
                <div className="item-list">
                  {displayedItems.map((item) => (
                    <ItemCard key={item.barangid} item={item} />
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <p className="text-secondary mt-3">Barang tidak ditemukan.</p>
                )}
                {totalPages > 1 && (
                  <nav
                    aria-label="Navigasi Halaman Dashboard"
                    className="mt-4 mb-2 d-flex justify-content-center"
                  >
                    <ul className="pagination pagination-sm">
                      <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link text-success"
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          &laquo;prev
                        </button>
                      </li>

                      {[...Array(totalPages)].map((_, index) => (
                        <li
                          key={index + 1}
                          className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                        >
                          <button
                            className={`page-link ${currentPage === index + 1 ? "bg-success border-success text-white" : "text-success"}`}
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}

                      <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link text-success"
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          Next &raquo;
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      <footer className="footer-db">
        <p className="mb-0">&copy; 2026 Gudang Pintar</p>
      </footer>
    </div>
  );
}
