import { useState } from "react";
import "./transaksi-style.css";

const initialItems = [
  { id: 1, name: "Air Mineral", stock: 31 },
  { id: 2, name: "Buku Tulis", stock: 15 },
  { id: 3, name: "Pulpen Hitam", stock: 40 },
];

export default function Transaksi() {
  const [type, setType] = useState("masuk");
  const [supplier, setSupplier] = useState("");
  const [items, setItems] = useState(
    initialItems.map((item) => ({ ...item, selected: false, quantity: 0 })),
  );

  function updateItem(id, changes) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, ...changes } : item,
      ),
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="header-db">
        <div className="logo">Gudang Pintar</div>
        <div className="search-container">
          <form onSubmit={(event) => event.preventDefault()}>
            <input
              type="search"
              placeholder="Cari..."
              className="form-control"
              aria-label="Cari"
            />
          </form>
        </div>
        <div className="header-right" />
      </header>

      <div className="d-flex flex-grow-1">
        <aside
          className="sidebar-db bg-white p-3 border-end d-flex flex-column"
          style={{ width: 250 }}
        >
          <nav className="flex-grow-1">
            <ul className="nav flex-column gap-2">
              <li className="nav-item"><a href="#dashboard" className="nav-link text-black sidebar-link rounded">Dashboard</a></li>
              <li className="nav-item"><a href="#barang" className="nav-link text-black sidebar-link rounded">Barang</a></li>
              <li className="nav-item"><a href="#transaksi" className="nav-link text-black sidebar-link active-link rounded" aria-current="page">Transaksi</a></li>
              <li className="nav-item"><a href="#riwayat" className="nav-link text-black sidebar-link rounded">Riwayat</a></li>
              <li className="nav-item"><a href="#akun" className="nav-link text-black sidebar-link rounded">Akun</a></li>
            </ul>
          </nav>
        </aside>

        <main className="flex-grow-1 p-4">
          <div className="container-fluid p-0">
            <h2 className="mb-4 fw-bold">Menu Transaksi</h2>

            <div className="d-flex flex-wrap gap-3 mb-4">
              <button
                type="button"
                className={`btn btn-success btn-lg px-4 shadow-sm ${type === "masuk" ? "active" : ""}`}
                aria-pressed={type === "masuk"}
                onClick={() => setType("masuk")}
              >
                Transaksi Stok Masuk
              </button>
              <button
                type="button"
                className={`btn btn-danger btn-lg px-4 shadow-sm ${type === "keluar" ? "active" : ""}`}
                aria-pressed={type === "keluar"}
                onClick={() => setType("keluar")}
              >
                Transaksi Stok Keluar
              </button>
            </div>

            <section className="card shadow-sm border-0 p-4">
              <h4 className="card-title mb-3">Form Input Transaksi</h4>

              {type === "masuk" && (
                <div className="mb-3">
                  <label htmlFor="supplier" className="form-label fw-semibold">
                    Nama Supplier (Opsional / Stok Masuk)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="supplier"
                    placeholder="Masukkan nama supplier..."
                    value={supplier}
                    onChange={(event) => setSupplier(event.target.value)}
                  />
                </div>
              )}

              <label className="form-label fw-semibold mb-2">
                Pilih Barang &amp; Ubah Kuantitas:
              </label>
              <div className="table-responsive border rounded p-2 bg-light mb-3">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" style={{ width: 50 }} className="text-center">Check</th>
                      <th scope="col">Nama Barang</th>
                      <th scope="col">Stok Saat Ini</th>
                      <th scope="col" style={{ width: 180 }}>Jumlah Ditambah / Dikurang</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="text-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`item-${item.id}`}
                            checked={item.selected}
                            onChange={(event) => updateItem(item.id, { selected: event.target.checked })}
                          />
                        </td>
                        <td><label htmlFor={`item-${item.id}`} className="user-select-none">{item.name}</label></td>
                        <td>{item.stock}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            min="0"
                            value={item.quantity}
                            aria-label={`Jumlah ${item.name}`}
                            onChange={(event) => updateItem(item.id, { quantity: Math.max(0, Number(event.target.value)) })}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <button type="button" className="btn btn-primary px-4">
                  Simpan Transaksi
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
