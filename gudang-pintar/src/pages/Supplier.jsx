import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./supplier-style.css";

const initialSuppliers = [
  { supplierid: 1, name: "PT Sumber Segar" },
  { supplierid: 2, name: "CV Alat Tulis Jaya" },
  { supplierid: 3, name: "PT Sumber Pangan" },
  { supplierid: 4, name: "CV Rasa Nusantara" },
  { supplierid: 5, name: "PT Minyak Sejahtera" },
];

const emptyForm = { name: "" };

export default function Supplier() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState("");

  const filteredSuppliers = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return suppliers.filter((supplier) => supplier.name.toLowerCase().includes(keyword));
  }, [query, suppliers]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const cleanForm = { name: form.name.trim() };

    if (editingId === null) {
      const nextId = Math.max(0, ...suppliers.map((supplier) => supplier.supplierid)) + 1;
      setSuppliers((current) => [...current, { supplierid: nextId, ...cleanForm }]);
      setFeedback("Supplier berhasil ditambahkan.");
    } else {
      setSuppliers((current) => current.map((supplier) =>
        supplier.supplierid === editingId ? { ...supplier, ...cleanForm } : supplier,
      ));
      setFeedback("Data supplier berhasil diperbarui.");
    }
    resetForm();
  }

  function editSupplier(supplier) {
    setEditingId(supplier.supplierid);
    setForm({ name: supplier.name });
    setFeedback("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteSupplier(supplier) {
    if (!window.confirm(`Hapus supplier ${supplier.name}?`)) return;
    setSuppliers((current) => current.filter((item) => item.supplierid !== supplier.supplierid));
    if (editingId === supplier.supplierid) resetForm();
    setFeedback("Supplier berhasil dihapus.");
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="header-db">
        <div className="logo">Gudang Pintar</div>
        <div className="search-container">
          <input className="form-control" type="search" placeholder="Cari supplier..." aria-label="Cari supplier" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="header-right" />
      </header>

      <div className="dashboard-layout d-flex">
        <Sidebar />
        <main className="main-content flex-grow-1">
          <div className="container-fluid p-3 p-md-4 supplier-page">
            <h1 className="dashboard-title">Kelola Supplier</h1>
            <p className="dashboard-description">Atur daftar pemasok barang toko.</p>

            {feedback && <div className="alert alert-success" role="status">{feedback}</div>}

            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body p-3 p-md-4">
                <h2 className="h5 fw-bold mb-3">{editingId === null ? "Tambah Supplier" : "Edit Supplier"}</h2>
                <form className="supplier-form" onSubmit={handleSubmit}>
                  <div className="supplier-name-field">
                    <label className="form-label" htmlFor="supplier-name">Nama supplier</label>
                    <input id="supplier-name" className="form-control" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
                  </div>
                  <div className="supplier-form-actions">
                    <button className="btn btn-success fw-semibold" type="submit">{editingId === null ? "Tambah Supplier" : "Simpan Perubahan"}</button>
                    {editingId !== null && <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>Batal</button>}
                  </div>
                </form>
              </div>
            </section>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-bold mb-0">Daftar Supplier</h2>
              <span className="badge text-bg-success">{filteredSuppliers.length} supplier</span>
            </div>

            {filteredSuppliers.length === 0 ? (
              <div className="card border-0 shadow-sm"><div className="card-body text-center text-secondary py-5">Supplier tidak ditemukan.</div></div>
            ) : (
              <div className="supplier-grid">
                {filteredSuppliers.map((supplier) => (
                  <article className="card supplier-card border-0 shadow-sm" key={supplier.supplierid}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                        <div><span className="supplier-id">SUP-{String(supplier.supplierid).padStart(3, "0")}</span><h3 className="h6 fw-bold mt-2 mb-0">{supplier.name}</h3></div>
                        <span className="supplier-mark" aria-hidden="true">S</span>
                      </div>
                      <div className="d-flex gap-2 border-top pt-3">
                        <button className="btn btn-outline-success btn-sm flex-grow-1" type="button" onClick={() => editSupplier(supplier)}>Edit</button>
                        <button className="btn btn-outline-danger btn-sm flex-grow-1" type="button" onClick={() => deleteSupplier(supplier)}>Hapus</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <p className="supplier-demo-note mt-4 mb-0">Data mengikuti mode demo proyek dan akan kembali ke data awal saat halaman dimuat ulang.</p>
          </div>
        </main>
      </div>
      <footer className="footer-db"><p className="mb-0">&copy; 2026 Gudang Pintar</p></footer>
    </div>
  );
}
