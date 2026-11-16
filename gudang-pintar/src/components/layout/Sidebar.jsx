import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/accountService";
import "./Sidebar.css";
import Button from "../common/Button";

export default function Sidebar({ isOpen, closeSidebar }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(
    sessionStorage.getItem("gp-current-user") || "{}",
  );
  const handleLogout = () => {
    if (closeSidebar) closeSidebar();
    sessionStorage.removeItem("gp-admin-session");
    sessionStorage.removeItem("gp-current-user");
    navigate("/login", { replace: true });
  };
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "Admin";

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
              <NavLink
                to="/Dashboard"
                onClick={closeSidebar}
                className="nav-link rounded sidebar-link"
              >
                Dashboard
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/barang"
                onClick={closeSidebar}
                className="nav-link rounded sidebar-link"
              >
                Barang
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/transaksi"
                onClick={closeSidebar}
                className="nav-link rounded sidebar-link"
              >
                Transaksi
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/history"
                onClick={closeSidebar}
                className="nav-link rounded sidebar-link"
              >
                Riwayat
              </NavLink>
            </li>

            {isAdmin && (
              <li className="nav-item">
                <NavLink
                  to="/akun"
                  onClick={closeSidebar}
                  className="nav-link rounded sidebar-link"
                >
                  Akun
                </NavLink>
              </li>
            )}

            <li className="nav-item">
              <NavLink
                to="/supplier"
                onClick={closeSidebar}
                className="nav-link rounded sidebar-link"
              >
                Supplier
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-3 border-top">
          <Button
            variant="danger"
            className="w-100"
            onClick={handleLogout}
            title="Keluar dari aplikasi Gudang Pintar"
          >
            Log Out
          </Button>
        </div>
      </aside>
    </>
  );
}
