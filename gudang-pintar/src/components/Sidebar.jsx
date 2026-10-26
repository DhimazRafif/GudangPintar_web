import React from "react";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar-db bg-white p-3 border-end d-flex flex-column">
      <nav className="flex-grow-1">
        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <a
              href="/Dashboard"
              className="nav-link text-black rounded sidebar-link active-link"
            >
              Dashboard
            </a>
          </li>

          <li className="nav-item">
            <a
              href="/barang"
              className="nav-link text-black rounded sidebar-link"
            >
              Barang
            </a>
          </li>

          <li className="nav-item">
            <a
              href="/transaksi"
              className="nav-link text-black rounded sidebar-link"
            >
              Transaksi
            </a>
          </li>

          <li className="nav-item">
            <a
              href="/history"
              className="nav-link text-black rounded sidebar-link"
            >
              Riwayat
            </a>
          </li>

          <li className="nav-item">
            <a
              href="/akun"
              className="nav-link text-black rounded sidebar-link"
            >
              Akun
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
