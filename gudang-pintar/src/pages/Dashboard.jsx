import React, { useState } from "react";
import ItemCard from "../components/ItemCard";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { initialItems } from "../data";
import "./dashboard-style.css";
import ItemCards from "../components/ItemCard";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = initialItems.filter((item) =>
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

            <div className="item-list">
              {filteredItems.map((item) => (
                <ItemCards key={item.id} item={item} />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <p className="text-secondary mt-3">Barang tidak ditemukan.</p>
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
