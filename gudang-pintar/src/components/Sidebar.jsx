import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar-db bg-white p-3 border-bottom border-md-end d-flex flex-column">
      <nav className="flex-grow-1">
        <ul className="nav flex-row flex-md-column gap-2 flex-nowrap overflow-x-auto pb-2">
          <li className="nav-item">
            <Link
              to="/Dashboard"
              className="nav-link text-black rounded sidebar-link"
            >
              Dasbor
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/supplier"
              className="nav-link text-black rounded sidebar-link"
            >
              Pemasok
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
  );
}
