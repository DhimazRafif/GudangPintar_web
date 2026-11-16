import React, { useState, useEffect, useRef } from "react";
import MainLayout from "../app-layouts/MainLayout";
import Pagination from "../components/common/Pagination";
import Input from "../components/common/Input";
import SelectControl from "../components/common/SelectControl";
import Button from "../components/common/Button"; // Button Component
import useNotification from "../hooks/useNotification";
import useFocusTrap from "../hooks/useFocusTrap";
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

  // State Pencarian & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentAccount, setCurrentAccount] = useState({ id: null, username: "", password: "", role: "Pegawai" });
  const [formError, setFormError] = useState({ username: "", password: "" }); // Inline Error State

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [accountToReject, setAccountToReject] = useState(null);

  const modalRef = useRef(null);
  const deleteModalRef = useRef(null);
  const rejectModalRef = useRef(null);

  useFocusTrap({
    active: isModalOpen,
    containerRef: modalRef,
    onEscape: () => setIsModalOpen(false),
  });
  useFocusTrap({
    active: isDeleteModalOpen,
    containerRef: deleteModalRef,
    onEscape: () => {
      setIsDeleteModalOpen(false);
      setAccountToDelete(null);
    },
  });
  useFocusTrap({
    active: isRejectModalOpen,
    containerRef: rejectModalRef,
    onEscape: () => {
      setIsRejectModalOpen(false);
      setAccountToReject(null);
    },
  });

  // Simpan ke localStorage setiap ada perubahan
  useEffect(() => { saveStoredAccounts(accounts); }, [accounts]);
  useEffect(() => { savePendingAccounts(pendingAccounts); }, [pendingAccounts]);

  // Filter & Pagination Logika
  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = pageSize === "all" ? filteredAccounts.length : Number(pageSize);
  const totalPages = Math.max(
    1,
    pageSize === "all" ? 1 : Math.ceil(filteredAccounts.length / itemsPerPage),
  );
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentItems = pageSize === "all"
    ? filteredAccounts
    : filteredAccounts.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

  // Reset halaman ke 1 saat mencari
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  // Cek jika halaman kosong setelah dihapus
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setModalMode("create");
    setCurrentAccount({ id: null, username: "", password: "", role: "Pegawai" });
    setFormError({ username: "", password: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (account) => {
    setModalMode("edit");
    setCurrentAccount({ ...account, password: "" });
    setFormError({ username: "", password: "" });
    setIsModalOpen(true);
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    
    // Validasi Inline
    let hasError = false;
    let newError = { username: "", password: "" };

    if (!currentAccount.username.trim()) {
      newError.username = "Username wajib diisi.";
      hasError = true;
    }
    if (modalMode === "create" && !currentAccount.password.trim()) {
      newError.password = "Password wajib diisi untuk akun baru.";
      hasError = true;
    }

    if (hasError) {
      setFormError(newError);
      return;
    }

    // Simpan Data
    if (modalMode === "create") {
      const newAccount = { ...currentAccount, id: Date.now() };
      setAccounts([...accounts, newAccount]);
      notify({ type: "success", message: "Akun baru berhasil ditambahkan!" });
    } else {
      setAccounts(
        accounts.map((acc) => {
          if (acc.id === currentAccount.id) {
            const updatedPassword = currentAccount.password.trim() ? currentAccount.password : acc.password;
            return { ...acc, ...currentAccount, password: updatedPassword };
          }
          return acc;
        })
      );
      notify({ type: "success", message: "Data akun berhasil diperbarui!" });
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (accountToDelete) {
      setAccounts(accounts.filter((acc) => acc.id !== accountToDelete.id));
      notify({ type: "success", message: `Akun "${accountToDelete.username}" telah dihapus.` });
    }
    setIsDeleteModalOpen(false);
    setAccountToDelete(null);
  };

  // --- PENDING ACTIONS ---
  const handleApprovePending = (pending) => {
    setAccounts((current) => [
      ...current,
      { id: Date.now(), username: pending.username, password: pending.password, role: pending.role || "Pegawai" },
    ]);
    setPendingAccounts((current) => current.filter((item) => item.id !== pending.id));
    notify({ type: "success", message: `Akun "${pending.username}" disetujui.` });
  };

  const confirmRejectPending = () => {
    if (accountToReject) {
      setPendingAccounts((current) => current.filter((item) => item.id !== accountToReject.id));
      notify({ type: "danger", message: `Pendaftaran "${accountToReject.username}" ditolak.` });
    }
    setIsRejectModalOpen(false);
    setAccountToReject(null);
  };

  return (
    <MainLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      {/* HEADER HALAMAN */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="dashboard-title mb-1">Pengelolaan Akun</h1>
          <p className="dashboard-description mb-0">Kelola daftar pengguna dan hak akses sistem.</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} icon="+">
          Tambah Akun Baru
        </Button>
      </div>

      <div className="mt-4">
        {currentItems.length === 0 ? (
          <div className="alert alert-secondary text-center shadow-sm">Tidak ada akun yang cocok.</div>
        ) : (
          currentItems.map((acc) => (
            <div key={acc.id} className="card account-card mb-3 shadow-sm border-0">
              <div className="card-body account-card-body p-3">
                <div className="account-info">
                  <h5 className="fw-bold mb-1 text-dark account-username">{acc.username}</h5>
                  <span className={`role-badge ${acc.role === "Admin" ? "admin" : "user"}`}>{acc.role}</span>
                </div>
                <div className="account-actions">
                  <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(acc)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => { setAccountToDelete(acc); setIsDeleteModalOpen(true); }}>Hapus</Button>
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
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        itemLabel="akun"
      />

     
      {isModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="account-modal-title" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered" ref={modalRef}>
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold" id="account-modal-title">{modalMode === "create" ? "Tambah Akun Baru" : "Edit Akun"}</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)} aria-label="Tutup"></button>
              </div>
              <form onSubmit={handleSaveAccount}>
                <div className="modal-body p-4">
                  <Input
                    id="account-username"
                    label="Username"
                    type="text"
                    placeholder="Masukkan username"
                    value={currentAccount.username}
                    onChange={(e) => {
                      setCurrentAccount({ ...currentAccount, username: e.target.value });
                      if (formError.username) setFormError({ ...formError, username: "" }); // Hapus error saat diketik
                    }}
                    error={formError.username} // Tampilkan inline error
                  />
                  <div className="mb-3 mt-3">
                    <Input
                      id="account-password"
                      label="Password"
                      hint={modalMode === "edit" ? "Kosongkan jika tidak diubah" : undefined}
                      type="password"
                      placeholder={modalMode === "edit" ? "••••••••" : "Masukkan password"}
                      value={currentAccount.password}
                      onChange={(e) => {
                        setCurrentAccount({ ...currentAccount, password: e.target.value });
                        if (formError.password) setFormError({ ...formError, password: "" });
                      }}
                      error={formError.password}
                    />
                  </div>
                  <div className="mb-2">
                    <SelectControl
                      id="account-role"
                      label="Role"
                      options={[{ value: "Admin", label: "Admin" }, { value: "Pegawai", label: "Pegawai" }]}
                      value={currentAccount.role}
                      onChange={(value) => setCurrentAccount({ ...currentAccount, role: value })}
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light border-0">
                  <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                  <Button type="submit" variant="primary">Simpan</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

     
      {isDeleteModalOpen && (
        <div ref={deleteModalRef} className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="delete-account-title" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content shadow-lg border-0 text-center">
              <div className="modal-body p-4">
                <h6 className="mb-4 fw-bold" id="delete-account-title">
                  Yakin ingin menghapus akun <br />
                  <span className="text-danger fs-5">"{accountToDelete?.username}"</span>?
                </h6>
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="danger" onClick={confirmDelete}>Iya, Hapus</Button>
                  <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Batalkan</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {isRejectModalOpen && (
        <div ref={rejectModalRef} className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="reject-account-title" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content shadow-lg border-0 text-center">
              <div className="modal-body p-4">
                <h6 className="mb-4 fw-bold" id="reject-account-title">
                  Tolak pendaftaran akun <br />
                  <span className="text-danger fs-5">"{accountToReject?.username}"</span>?
                </h6>
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="danger" onClick={confirmRejectPending}>Iya, Tolak</Button>
                  <Button variant="secondary" onClick={() => setIsRejectModalOpen(false)}>Batalkan</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </MainLayout>
  );
}
