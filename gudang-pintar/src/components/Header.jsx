import React from "react";
import "./Header.css";

export default function Header({ searchQuery, setSearchQuery }) {
  return (
    <header className="header-db">
      <div className="logo"> Gudang Pintar</div>
      <div className="search-container">
        <form id="search-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            placeholder="cari barang..."
            className="form-control"
            aria-label="Cari Barang"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      <div className="header-right"></div>
    </header>
  );
}
