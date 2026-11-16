import React from "react";
import { useNavigate } from "react-router-dom";
import Input from "../common/Input";
import "./Header.css";

export default function Header({ searchQuery, setSearchQuery, toggleSidebar }) {
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem("gp-admin-session");
    sessionStorage.removeItem("gp-current-user");
    navigate("/login", { replace: true });
  }

  return (
    <header className="header-db">
      <div className="logo"> Gudang Pintar</div>
      <div className="search-container">
        <form id="search-form" onSubmit={(e) => e.preventDefault()}>
          <Input
            id="global-item-search"
            label="Cari barang"
            hideLabel
            type="search"
            placeholder="cari barang..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="header-right d-none d-md-flex">
        <button className="logout-btn" onClick={handleLogout}>Log out</button>
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
