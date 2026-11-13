import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ isOpen, closeSidebar }) {
  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay d-md-none" onClick={closeSidebar}></div>
      )}

      <aside
        className={`sidebar-db bg-white p-3 border-bottom border-md-end d-flex flex-column ${isOpen ? "open" : ""}`}
      >
        <div className="d-flex justify-content-between align-items-center d-md-none mb-3">
          <span className="fw-bold fs-5 text-success">Menu</span>
          <button className="btn-close" onClick={closeSidebar}></button>
        </div>

        <nav className="flex-grow-1">
          <ul className="nav flex-column gap-2 pb-2">
            <li className="nav-item">
              <Link
                to="/Dashboard"
                className="nav-link text-black rounded sidebar-link"
              >
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/barang"
                className="nav-link text-black rounded sidebar-link"
              >
                Barang
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/transaksi"
                className="nav-link text-black rounded sidebar-link"
              >
                Transaksi
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/history"
                className="nav-link text-black rounded sidebar-link"
              >
                Riwayat
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/akun"
                className="nav-link text-black rounded sidebar-link"
              >
                Akun
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
