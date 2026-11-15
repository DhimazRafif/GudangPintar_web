import React, { useState, useEffect } from "react";
import MainLayout from "../app-layouts/MainLayout";
import Pagination from "../components/common/Pagination";
import Input from "../components/common/Input";
import SelectControl from "../components/common/SelectControl";
import useNotification from "../hooks/useNotification";
import {
  getPendingAccounts,
  getStoredAccounts,
  savePendingAccounts,
  saveStoredAccounts,
} from "../services/accountService";
import "./PengelolaanAkun.css";

export default function PengelolaanAkun() {
  const { notify } = useNotification();
  const [accounts, setAccounts] = useState(getStoredAccounts);
  const [pendingAccounts, setPendingAccounts] = useState(getPendingAccounts);

  useEffect(() => {
    saveStoredAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    savePendingAccounts(pendingAccounts);
  }, [pendingAccounts]);

  // --- STATE PENCARIAN & PAGINATION ---
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- STATE MODAL TAMBAH/EDIT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' atau 'edit'
  const [currentAccount, setCurrentAccount] = useState({
    id: null,
    username: "",
    password: "",
    role: "Pegawai",
  });

  // --- STATE MODAL HAPUS ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  // --- FUNGSI NOTIFIKASI ---
  const showToast = (message, type = "success") => {
    notify({ type, message });
  };

  // --- LOGIKA PENCARIAN & PAGINATION ---
  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page ke 1 saat mencari
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // --- HANDLER MODAL TAMBAH/EDIT ---
  const handleOpenCreate = () => {
    setModalMode("create");
    setCurrentAccount({ id: null, username: "", password: "", role: "Pegawai" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (account) => {
    setModalMode("edit");
    setCurrentAccount({ ...account, password: "" }); // Kosongkan password saat edit
    setIsModalOpen(true);
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();

    if (!currentAccount.username.trim()) {
      return showToast("Username tidak boleh kosong.", "danger");
    }
    if (modalMode === "create" && !currentAccount.password.trim()) {
      return showToast("Password tidak boleh kosong untuk akun baru.", "danger");
    }

    if (modalMode === "create") {
      const newAccount = { ...currentAccount, id: Date.now() };
      setAccounts([...accounts, newAccount]);
      showToast("Akun baru berhasil ditambahkan!", "success");
    } else {
      setAccounts(
        accounts.map((acc) => {
          if (acc.id === currentAccount.id) {
            const updatedPassword = currentAccount.password.trim()
              ? currentAccount.password
              : acc.password;
            return { ...acc, ...currentAccount, password: updatedPassword };
          }
          return acc;
        })
      );
      showToast("Data akun berhasil diperbarui!", "success");
    }
    setIsModalOpen(false);
  };

  // --- HANDLER MODAL HAPUS ---
  const handleOpenDelete = (account) => {
    setAccountToDelete(account);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (accountToDelete) {
      setAccounts(accounts.filter((acc) => acc.id !== accountToDelete.id));
      showToast(`Akun "${accountToDelete.username}" telah dihapus.`, "success");
    }
    setIsDeleteModalOpen(false);
    setAccountToDelete(null);
  };

  const handleApprovePending = (pending) => {
    setAccounts((current) => [
      ...current,
      { id: Date.now(), username: pending.username, password: pending.password, role: pending.role || "Pegawai" },
    ]);
    setPendingAccounts((current) => current.filter((item) => item.id !== pending.id));
    showToast(`Akun "${pending.username}" disetujui dan sekarang aktif.`, "success");
  };

  const handleRejectPending = (pending) => {
    setPendingAccounts((current) => current.filter((item) => item.id !== pending.id));
    showToast(`Pendaftaran "${pending.username}" ditolak.`, "danger");
  };

  // --- HANDLER KEYBOARD (ESC untuk tutup modal) ---
  const handleKeyDown = (e, closeFunc) => {
    if (e.key === "Escape") closeFunc(false);
  };

  return (
    <MainLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      {/* HEADER HALAMAN */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="dashboard-title mb-1">Pengelolaan Akun</h1>
          <p className="dashboard-description mb-0">
            Kelola daftar pengguna dan hak akses sistem.
          </p>
        </div>
        <button
          className="btn btn-success fw-semibold shadow-sm px-4 py-2 d-flex align-items-center justify-content-center gap-2"
          onClick={handleOpenCreate}
        >
          <span>+</span> Tambah Akun Baru
        </button>
      </div>

      <section className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <h2 className="h5 fw-bold mb-0">Permintaan Pendaftaran</h2>
          <span className={`badge ${pendingAccounts.length > 0 ? "text-bg-warning" : "text-bg-secondary"}`}>
            {pendingAccounts.length}
          </span>
        </div>
        {pendingAccounts.length === 0 ? (
          <div className="card account-card shadow-sm border-0">
            <div className="card-body p-3 text-secondary">
              Belum ada permintaan pendaftaran akun baru.
            </div>
          </div>
        ) : (
          pendingAccounts.map((pending) => (
            <div key={pending.id} className="card account-card mb-2 shadow-sm border-0">
              <div className="card-body account-card-body p-3">
                <div className="account-info">
                  <h5 className="fw-bold mb-1 text-dark account-username">{pending.username}</h5>
                  <span className="role-badge user">{pending.role || "Pegawai"}</span>
                </div>
                <div className="account-actions">
                  <button
                    className="btn btn-success btn-sm px-3 fw-semibold"
                    onClick={() => handleApprovePending(pending)}
                  >
                    Terima
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm px-3 fw-semibold"
                    onClick={() => handleRejectPending(pending)}
                  >
                    Tolak
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* DAFTAR AKUN */}
      <div className="mt-4">
        {currentItems.length === 0 ? (
          <div className="alert alert-secondary text-center shadow-sm">
            Tidak ada akun yang cocok dengan pencarian Anda.
          </div>
        ) : (
          currentItems.map((acc) => (
            <div key={acc.id} className="card account-card mb-3 shadow-sm border-0">
              <div className="card-body account-card-body p-3">
                <div className="account-info">
                  <h5 className="fw-bold mb-1 text-dark account-username">{acc.username}</h5>
                  <span className={`role-badge ${acc.role === "Admin" ? "admin" : "user"}`}>
                    {acc.role}
                  </span>
                </div>
                <div className="account-actions">
                  <button
                    className="btn btn-outline-success btn-sm px-3 fw-semibold"
                    onClick={() => handleOpenEdit(acc)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm px-3 fw-semibold"
                    onClick={() => handleOpenDelete(acc)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        ariaLabel="Navigasi Halaman Akun"
      />

      {/* ==========================================
          MODAL TAMBAH / EDIT AKUN
      ========================================== */}
      {isModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          onKeyDown={(e) => handleKeyDown(e, setIsModalOpen)}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold">
                  {modalMode === "create" ? "Tambah Akun Baru" : "Edit Akun"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Tutup"
                ></button>
              </div>
              <form onSubmit={handleSaveAccount}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <Input
                      id="account-username"
                      label="Username"
                      type="text"
                      placeholder="Masukkan username"
                      value={currentAccount.username}
                      onChange={(e) =>
                        setCurrentAccount({ ...currentAccount, username: e.target.value })
                      }
                      autoFocus
                    />
                  </div>

                  <div className="mb-3">
                    <Input
                      id="account-password"
                      label="Password"
                      hint={modalMode === "edit" ? "Kosongkan jika tidak diubah" : undefined}
                      type="password"
                      placeholder={modalMode === "edit" ? "••••••••" : "Masukkan password"}
                      value={currentAccount.password}
                      onChange={(e) =>
                        setCurrentAccount({ ...currentAccount, password: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-2">
                    <SelectControl
                      id="account-role"
                      label="Role"
                      options={[
                        { value: "Admin", label: "Admin" },
                        { value: "Pegawai", label: "Pegawai" },
                      ]}
                      value={currentAccount.role}
                      onChange={(value) =>
                        setCurrentAccount({ ...currentAccount, role: value })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light border-0">
                  <button
                    type="button"
                    className="btn btn-secondary fw-semibold px-4"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-success fw-semibold px-4">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL KONFIRMASI HAPUS
      ========================================== */}
      {isDeleteModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          onKeyDown={(e) => handleKeyDown(e, setIsDeleteModalOpen)}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content shadow-lg border-0 text-center">
              <div className="modal-body p-4">
                <h6 className="mb-4 fw-bold">
                  Apakah Anda yakin ingin menghapus akun <br />
                  <span className="text-danger fs-5">"{accountToDelete?.username}"</span>?
                </h6>
                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-danger fw-semibold px-4" onClick={confirmDelete} autoFocus>
                    Iya, Hapus
                  </button>
                  <button
                    className="btn btn-secondary fw-semibold px-4"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </MainLayout>
  );
}
