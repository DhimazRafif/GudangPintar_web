import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import { getStoredAccounts } from "../services/accountService";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const cleanUsername = form.username.trim().toLowerCase();
    const accounts = getStoredAccounts();

    const matched = accounts.find(
      (acc) =>
        acc.username.trim().toLowerCase() === cleanUsername &&
        acc.password === form.password,
    );

    if (!matched) {
      setMessage("Nama pengguna atau kata sandi salah.");
      return;
    }

    sessionStorage.setItem("gp-admin-session", "active");
    sessionStorage.setItem(
      "gp-current-user",
      JSON.stringify({ id: matched.id, username: matched.username, role: matched.role }),
    );
    navigate("/Dashboard", { replace: true });
  }

  if (sessionStorage.getItem("gp-admin-session") === "active") {
    return <Navigate to="/Dashboard" replace />;
  }

  return (
    <div className="login-app d-flex flex-column min-vh-100 bg-light">
      <header className="login-header d-flex align-items-center">
        <Link className="brand text-decoration-none" to="/login">
          Gudang Pintar
        </Link>
      </header>

      <main className="login-page d-flex align-items-center justify-content-center flex-grow-1">
        <section className="login-popup shadow-sm" aria-labelledby="login-title">
          <div className="popup-brand">Gudang Pintar</div>
          <h1 id="login-title">Masuk</h1>
          <p className="login-intro">Masuk ke akun toko Anda</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <Input
                id="username"
                label="Nama pengguna"
                type="text"
                placeholder="Masukkan nama pengguna"
                autoComplete="username"
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                id="password"
                label="Kata sandi"
                type="password"
                placeholder="Masukkan kata sandi"
                autoComplete="current-password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </div>
            {message && (
              <div className="alert alert-danger py-2" role="alert">
                {message}
              </div>
            )}
            <button className="btn btn-success btn-login w-100 fw-semibold" type="submit">
              Masuk
            </button>
          </form>

          <p className="signup-note mb-0">Belum memiliki akun? Hubungi admin toko.</p>
        </section>
      </main>
    </div>
  );
}
