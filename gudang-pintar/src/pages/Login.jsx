import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import "./login-style.css";

const DEMO_ADMIN = {
  email: "admin@gmail.com",
  username: "admin",
  password: "Admin123!",
};

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const isValid = form.email.trim().toLowerCase() === DEMO_ADMIN.email &&
      form.username.trim().toLowerCase() === DEMO_ADMIN.username &&
      form.password.trim() === DEMO_ADMIN.password;

    if (!isValid) {
      setMessage("Email, nama pengguna, atau kata sandi salah.");
      return;
    }

    sessionStorage.setItem("gp-admin-session", "active");
    navigate("/Dashboard", { replace: true });
  }

  if (sessionStorage.getItem("gp-admin-session") === "active") {
    return <Navigate to="/Dashboard" replace />;
  }

  return (
    <div className="login-app">
      <header className="login-header d-flex align-items-center">
        <Link className="brand text-decoration-none" to="/login">
          Gudang Pintar
        </Link>
      </header>

      <main className="login-page d-flex align-items-center justify-content-center">
        <section className="login-popup" aria-labelledby="login-title">
          <button
            className="close-button"
            type="button"
            onClick={() => navigate("/Dashboard")}
            aria-label="Tutup"
          >
            ×
          </button>
          <div className="popup-brand">Gudang Pintar</div>
          <h1 id="login-title">Masuk</h1>
          <p className="login-intro">Masuk ke akun toko Anda</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Alamat email</label>
              <input className="form-control" type="email" id="email" name="email" placeholder="nama@gmail.com" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Nama pengguna</label>
              <input className="form-control" type="text" id="username" name="username" placeholder="Masukkan nama pengguna" autoComplete="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Kata sandi</label>
              <input className="form-control" type="password" id="password" name="password" placeholder="Masukkan kata sandi" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            </div>
            {message && <div className="alert alert-danger py-2" role="alert">{message}</div>}
            <button className="btn btn-login w-100" type="submit">Masuk</button>
          </form>

          <p className="signup-note mb-0">Belum memiliki akun? Hubungi admin toko.</p>
        </section>
      </main>
    </div>
  );
}
