import React, { useState } from "react";
import ItemCard from "../components/ItemCard";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardSummary from "../components/DashboardSummary";
import "./dashboard-style.css";
import useFetch from "../hooks/useFetch";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: items, isLoading, error, refetch } = useFetch("/barang.json");

  const currentItems = items || [];
  const filteredItems = currentItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="dashboard-layout d-flex">
        <Sidebar />

        <main className="main-content flex-grow-1">
          <div className="container-fluid p-3">
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
                <DashboardSummary items={currentItems} />
                <div className="item-list">
                  {filteredItems.map((item) => (
                    <ItemCard key={item.barangid} item={item} />
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <p className="text-secondary mt-3">Barang tidak ditemukan.</p>
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
