import { useEffect, useMemo, useState } from "react";
import MainLayout from "../app-layouts/MainLayout";
import Input from "../components/common/Input";
import Pagination from "../components/common/Pagination";
import useNotification from "../hooks/useNotification";
import "./supplier-style.css";

const initialSuppliers = [
  { supplierid: 1, name: "PT Sumber Segar" },
  { supplierid: 2, name: "CV Alat Tulis Jaya" },
  { supplierid: 3, name: "PT Sumber Pangan" },
  { supplierid: 4, name: "CV Rasa Nusantara" },
  { supplierid: 5, name: "PT Minyak Sejahtera" },
];

const emptyForm = { name: "" };

function loadSuppliers() {
  try {
    const raw = localStorage.getItem("gp-suppliers");
    if (!raw) return initialSuppliers;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialSuppliers;
  } catch {
    return initialSuppliers;
  }
}

export default function Supplier() {
  const { notify } = useNotification();
  const [suppliers, setSuppliers] = useState(loadSuppliers);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    try {
      localStorage.setItem("gp-suppliers", JSON.stringify(suppliers));
    } catch {
      return;
    }
  }, [suppliers]);

  const filteredSuppliers = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return suppliers.filter((supplier) => supplier.name.toLowerCase().includes(keyword));
  }, [query, suppliers]);

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const displayedSuppliers = filteredSuppliers.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage,
  );

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const cleanName = form.name.trim();
    if (!cleanName) {
      notify({ type: "danger", message: "Nama supplier tidak boleh kosong." });
      return;
    }

    if (editingId === null) {
      const nextId = Math.max(0, ...suppliers.map((supplier) => supplier.supplierid)) + 1;
      setSuppliers((current) => [...current, { supplierid: nextId, name: cleanName }]);
      notify({ type: "success", message: "Supplier berhasil ditambahkan." });
    } else {
      setSuppliers((current) =>
        current.map((supplier) =>
          supplier.supplierid === editingId ? { ...supplier, name: cleanName } : supplier,
        ),
      );
      notify({ type: "success", message: "Data supplier berhasil diperbarui." });
    }
    resetForm();
  }

  function editSupplier(supplier) {
    setEditingId(supplier.supplierid);
    setForm({ name: supplier.name });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteSupplier(supplier) {
    setSupplierToDelete(supplier);
  }

  function confirmDeleteSupplier() {
    if (!supplierToDelete) return;
    setSuppliers((current) =>
      current.filter((item) => item.supplierid !== supplierToDelete.supplierid),
    );
    if (editingId === supplierToDelete.supplierid) resetForm();
    notify({
      type: "success",
      message: `Supplier "${supplierToDelete.name}" berhasil dihapus.`,
    });
    setSupplierToDelete(null);
  }

  return (
    <MainLayout searchQuery={query} setSearchQuery={setQuery}>
      <div className="supplier-page">
        <div className="mb-4">
          <h1 className="dashboard-title mb-1">Kelola Supplier</h1>
          <p className="dashboard-description mb-0">Atur daftar supplier barang di toko.</p>
        </div>

        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3 p-md-4">
            <h2 className="h5 fw-bold mb-3">
              {editingId === null ? "Tambah Supplier" : "Ubah Data Supplier"}
            </h2>
            <form className="supplier-form" onSubmit={handleSubmit}>
              <div className="supplier-name-field">
                <Input
                  id="supplier-name"
                  label="Nama supplier"
                  type="text"
                  placeholder="Masukkan nama supplier"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                />
              </div>
              <div className="supplier-form-actions">
                <button className="btn btn-success fw-semibold px-4" type="submit">
                  {editingId === null ? "Tambah Supplier" : "Simpan Perubahan"}
                </button>
                {editingId !== null && (
                  <button
                    className="btn btn-outline-secondary fw-semibold"
                    type="button"
                    onClick={resetForm}
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 fw-bold mb-0">Daftar Supplier</h2>
          <span className="badge text-bg-success">{filteredSuppliers.length} supplier</span>
        </div>

        {filteredSuppliers.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center text-secondary py-5">
              Supplier tidak ditemukan.
            </div>
          </div>
        ) : (
          <div className="supplier-grid">
            {displayedSuppliers.map((supplier) => (
              <article className="card supplier-card border-0 shadow-sm" key={supplier.supplierid}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                    <div>
                      <span className="supplier-id">
                        SUP-{String(supplier.supplierid).padStart(3, "0")}
                      </span>
                      <h3 className="h6 fw-bold mt-2 mb-0 text-dark">{supplier.name}</h3>
                    </div>
                    <span className="supplier-mark" aria-hidden="true">
                      S
                    </span>
                  </div>
                  <div className="d-flex gap-2 border-top pt-3">
                    <button
                      className="btn btn-outline-success btn-sm flex-grow-1 fw-semibold"
                      type="button"
                      onClick={() => editSupplier(supplier)}
                    >
                      Ubah
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm flex-grow-1 fw-semibold"
                      type="button"
                      onClick={() => deleteSupplier(supplier)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <Pagination
          currentPage={activePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          ariaLabel="Navigasi Halaman Supplier"
        />
      </div>

      {supplierToDelete && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          onKeyDown={(event) => {
            if (event.key === "Escape") setSupplierToDelete(null);
          }}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content shadow-lg border-0 text-center">
              <div className="modal-body p-4">
                <h6 className="mb-4 fw-bold">
                  Apakah Anda yakin ingin menghapus supplier <br />
                  <span className="text-danger fs-5">"{supplierToDelete.name}"</span>?
                </h6>
                <div className="d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-danger fw-semibold px-4"
                    type="button"
                    onClick={confirmDeleteSupplier}
                    autoFocus
                  >
                    Iya, Hapus
                  </button>
                  <button
                    className="btn btn-secondary fw-semibold px-4"
                    type="button"
                    onClick={() => setSupplierToDelete(null)}
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
