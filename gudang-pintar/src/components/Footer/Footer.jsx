import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-db mt-auto">
      <p className="mb-0 text-secondary">
        &copy; {new Date().getFullYear()} Gudang Pintar.
      </p>
    </footer>
  );
}
