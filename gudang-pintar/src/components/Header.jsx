import React from "react";
import "./Header.css";

export default function Header({ searchQuery, setSearchQuery, toggleSidebar }) {
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

      <div className="header-right d-none d-md-flex">
        <button className="logout-btn">Log out</button>
      </div>

      <button
        className="hamburger-btn"
        onClick={toggleSidebar}
        aria-label="Buka Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="#198754"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </button>
    </header>
  );
}
