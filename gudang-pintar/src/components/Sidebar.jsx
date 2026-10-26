import React from "react";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar-db bg-white p-3 border-end d-flex flex-column">
      <nav className="flex-grow-1">
        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <Link
              href="/Dashboard"
              className="nav-link text-black rounded sidebar-link active-link"
            >
              Dashboard
            </Link>
          </li>

          <li className="nav-item">
            <Link
              href="/barang"
              className="nav-link text-black rounded sidebar-link"
            >
              Barang
            </Link>
          </li>

          <li className="nav-item">
            <Link
              href="/transaksi"
              className="nav-link text-black rounded sidebar-link"
            >
              Transaksi
            </Link>
          </li>

          <li className="nav-item">
            <Link
              href="/history"
              className="nav-link text-black rounded sidebar-link"
            >
              Riwayat
            </Link>
          </li>

          <li className="nav-item">
            <Link
              href="/akun"
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
