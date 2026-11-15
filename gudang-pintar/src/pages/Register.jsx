import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Input from "../components/common/Input";
import {
  getPendingAccounts,
  getStoredAccounts,
  savePendingAccounts,
} from "../services/accountService";
import "./login-style.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  function handleSubmit(event) {
    event.preventDefault();
    const cleanUsername = form.username.trim();

    if (!cleanUsername || !form.password.trim()) {
      setFeedback({ type: "danger", text: "Nama pengguna dan kata sandi wajib diisi." });
      return;
    }

    if (!/^[a-z0-9._-]+$/.test(cleanUsername)) {
      setFeedback({
        type: "danger",
        text: "Nama pengguna harus huruf kecil semua tanpa spasi.",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFeedback({ type: "danger", text: "Konfirmasi kata sandi tidak cocok." });
      return;
    }

    const accounts = getStoredAccounts();
    const pendingAccounts = getPendingAccounts();
    const existsInActive = accounts.some(
      (acc) => acc.username.trim().toLowerCase() === cleanUsername,
    );
    const existsInPending = pendingAccounts.some(
      (acc) => acc.username.trim().toLowerCase() === cleanUsername,
    );

    if (existsInActive || existsInPending) {
      setFeedback({
        type: "danger",
        text: "Nama pengguna sudah terdaftar atau sedang menunggu persetujuan.",
      });
      return;
    }

    const newRequest = {
      id: Date.now(),
      username: cleanUsername,
      password: form.password,
      role: "Pegawai",
    };

    savePendingAccounts([...pendingAccounts, newRequest]);
    setForm({ username: "", password: "", confirmPassword: "" });
    setFeedback({
      type: "success",
      text: "Pendaftaran berhasil dikirim. Menunggu persetujuan admin di Pengelolaan Akun.",
    });
  }

  if (sessionStorage.getItem("gp-admin-session") === "active") {
    return <Navigate to="/Dashboard" replace />;
  }

  return (
    <div className="login-app d-flex flex-column min-vh-100 bg-light">
      <header className="login-header d-flex align-items-center justify-content-between">
        <Link className="brand text-decoration-none" to="/login">
          Gudang Pintar
        </Link>
        <Link className="btn btn-outline-success btn-sm fw-semibold" to="/login">
          Masuk
        </Link>
      </header>

      <main className="login-page d-flex align-items-center justify-content-center flex-grow-1">
        <section className="login-popup shadow-sm" aria-labelledby="register-title">
          <div className="popup-brand">Gudang Pintar</div>
          <h1 id="register-title">Daftar Akun</h1>
          <p className="login-intro">
            Ajukan pendaftaran akun baru untuk disetujui admin
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <Input
                id="register-username"
                label="Nama pengguna"
                hint="Huruf kecil semua tanpa spasi"
                type="text"
                placeholder="contoh: budisantoso"
                autoComplete="username"
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <Input
                id="register-password"
                label="Kata sandi"
                type="password"
                placeholder="Masukkan kata sandi"
                autoComplete="new-password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                id="register-confirm-password"
                label="Konfirmasi kata sandi"
                type="password"
                placeholder="Ulangi kata sandi"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm({ ...form, confirmPassword: event.target.value })
                }
                required
              />
            </div>
            {feedback.text && (
              <div className={`alert alert-${feedback.type} py-2`} role="alert">
                {feedback.text}
              </div>
            )}
            <button className="btn btn-success btn-login w-100 fw-semibold" type="submit">
              Daftar
            </button>
          </form>

          <p className="signup-note mb-0">
            Sudah memiliki akun?{" "}
            <Link className="login-account-link" to="/login">
              Masuk
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
