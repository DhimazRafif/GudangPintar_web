import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../pengelolaan_akun-style.css"; 
import "../dashboard-style.css";

export default function PengelolaanAkun() {
  // State untuk data akun (dummy)
  const [accounts, setAccounts] = useState([
    { id: 1, username: "Siti Khadijah", password: "admin123", role: "Admin" },
    { id: 2, username: "Dhimaz", password: "user123", role: "Pegawai" },
  ]);

  // State untuk pencarian
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk Modal Tambah/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("tambah"); // 'tambah' atau 'edit'
  const [currentAccount, setCurrentAccount] = useState({
    id: null,
    username: "",
    password: "",
    role: "Pegawai", // Default role
  });
  const [formError, setFormError] = useState("");

  // State untuk Modal Hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  // --- FUNGSI PENCARIAN ---
  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- FUNGSI BUKA MODAL TAMBAH ---
  const handleOpenTambah = () => {
    setModalMode("tambah");
    setCurrentAccount({ id: null, username: "", password: "", role: "Pegawai" });
    setFormError("");
    setIsModalOpen(true);
  };

  // --- FUNGSI BUKA MODAL EDIT ---
  const handleOpenEdit = (account) => {
    setModalMode("edit");
    // Saat edit, password dikosongkan dulu agar tidak terlihat (opsional)
    setCurrentAccount({ ...account, password: "" });
    setFormError("");
    setIsModalOpen(true);
  };

  // --- FUNGSI SIMPAN (TAMBAH / EDIT) ---
  const handleSaveAccount = (e) => {
    e.preventDefault();
    setFormError("");

    // Validasi Username wajib diisi
    if (!currentAccount.username.trim()) {
      setFormError("Username tidak boleh kosong.");
      return;
    }

    // Validasi Password
    // Jika mode Tambah, password wajib diisi.
    // Jika mode Edit, password boleh kosong (artinya tidak diubah).
    if (modalMode === "tambah" && !currentAccount.password.trim()) {
      setFormError("Password tidak boleh kosong untuk akun baru.");
      return;
    }

    if (modalMode === "tambah") {
      // Logika Tambah Data
      const newAccount = {
        ...currentAccount,
        id: Date.now(), // Generate ID unik sederhana
      };
      setAccounts([...accounts, newAccount]);
    } else {
      // Logika Edit Data
      setAccounts(
        accounts.map((acc) => {
          if (acc.id === currentAccount.id) {
            // Jika password di form kosong, gunakan password lama
            const updatedPassword = currentAccount.password.trim() 
              ? currentAccount.password 
              : acc.password;
              
            return { ...acc, ...currentAccount, password: updatedPassword };
          }
          return acc;
        })
      );
    }

    setIsModalOpen(false);
  };

  // --- FUNGSI BUKA MODAL HAPUS ---
  const handleOpenDelete = (account) => {
    setAccountToDelete(account);
    setIsDeleteModalOpen(true);
  };

  // --- FUNGSI KONFIRMASI HAPUS ---
  const confirmDelete = () => {
    if (accountToDelete) {
      setAccounts(accounts.filter((acc) => acc.id !== accountToDelete.id));
    }
    setIsDeleteModalOpen(false);
    setAccountToDelete(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="dashboard-layout d-flex">
        <Sidebar />
        <main className="main-content flex-grow-1 p-4">
          <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="dashboard-title mb-1">Pengelolaan Akun</h1>
                <p className="dashboard-description mb-0">
                  Kelola daftar akun pengguna dan hak aksesnya.
                </p>
              </div>
              <button
                className="btn btn-success fw-semibold shadow-sm px-4 py-2"
                onClick={handleOpenTambah}
              >
                + Tambah Akun
              </button>
            </div>

            <div className="mt-4">
              {filteredAccounts.length === 0 ? (
                <div className="alert alert-secondary text-center">
                  Akun tidak ditemukan.
                </div>
              ) : (
                filteredAccounts.map((acc) => (
                  <div key={acc.id} className="card account-card mb-3 shadow-sm">
                    <div className="card-body d-flex justify-content-between align-items-center p-3">
                      <div>
                        <h5 className="fw-bold mb-1 text-dark">{acc.username}</h5>
                        <span
                          className={`role-badge ${
                            acc.role === "Admin" ? "admin" : "user"
                          }`}
                        >
                          {acc.role}
                        </span>
                      </div>
                      <div className="d-flex gap-2">
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
          </div>
        </main>
      </div>

      <footer className="footer-db mt-auto">
        <p className="mb-0">&copy; 2026 Gudang Pintar</p>
      </footer>

      {isModalOpen && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setIsModalOpen(false)}></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-bold">
                    {modalMode === "tambah" ? "Tambah Akun Baru" : "Edit Akun"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setIsModalOpen(false)}
                  ></button>
                </div>
                <form onSubmit={handleSaveAccount}>
                  <div className="modal-body p-4">
                    {formError && (
                      <div className="alert alert-danger py-2">{formError}</div>
                    )}

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Masukkan username"
                        value={currentAccount.username}
                        onChange={(e) =>
                          setCurrentAccount({ ...currentAccount, username: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Password {modalMode === "edit" && <span className="text-muted fw-normal">(Kosongkan jika tidak diubah)</span>}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder={modalMode === "edit" ? "••••••••" : "Masukkan password"}
                        value={currentAccount.password}
                        onChange={(e) =>
                          setCurrentAccount({ ...currentAccount, password: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label fw-semibold">Role</label>
                      <select
                        className="form-select"
                        value={currentAccount.role}
                        onChange={(e) =>
                          setCurrentAccount({ ...currentAccount, role: e.target.value })
                        }
                      >
                        <option value="Admin">Admin</option>
                        <option value="Pegawai">Pegawai</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer bg-light border-0">
                    <button
                      type="button"
                      className="btn btn-danger fw-semibold px-4"
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
        </>
      )}

      {isDeleteModalOpen && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-sm">
              <div className="modal-content shadow-lg border-0 text-center">
                <div className="modal-body p-4">
                  <h6 className="mb-4 fw-bold">
                    Apakah Anda yakin ingin menghapus akun <br /> 
                    <span className="text-danger fs-5">"{accountToDelete?.username}"</span>?
                  </h6>
                  <div className="d-flex justify-content-center gap-3">
                    <button
                      className="btn btn-success fw-semibold px-4"
                      onClick={confirmDelete}
                    >
                      Iya
                    </button>
                    <button
                      className="btn btn-danger fw-semibold px-4"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Batalkan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}