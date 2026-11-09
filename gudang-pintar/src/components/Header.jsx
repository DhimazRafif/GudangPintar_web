import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem("gp-admin-session");
    navigate("/login", { replace: true });
  }

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
      <div className="header-right">
        <button className="logout-btn" onClick={handleLogout}>Keluar</button>
      </div>
    </header>
  );
}
