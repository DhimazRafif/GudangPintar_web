import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./transaksi-style.css";

// ID pengguna contoh untuk menggantikan user yang nantinya berasal dari autentikasi.
const MOCK_USER_ID = 1;

// Data supplier terpisah; supplierid dicatat pada stock_history untuk stok masuk.
const initialSuppliers = [
  { supplierid: 1, name: "PT Sumber Segar" },
  { supplierid: 2, name: "CV Alat Tulis Jaya" },
  { supplierid: 3, name: "PT Sumber Pangan" },
  { supplierid: 4, name: "CV Rasa Nusantara" },
  { supplierid: 5, name: "PT Minyak Sejahtera" },
];

// Data barang mengikuti kolom yang digunakan halaman transaksi pada tabel barang.
const initialItems = [
  { barangid: 1, name: "Air Mineral", price: 3000, quantity: 31, isActive: true },
  { barangid: 2, name: "Buku Tulis", price: 5000, quantity: 15, isActive: true },
  { barangid: 3, name: "Pulpen Hitam", price: 2500, quantity: 40, isActive: true },
  { barangid: 4, name: "Mie", price: 3000, quantity: 12, isActive: true },
  { barangid: 5, name: "Kecap", price: 8000, quantity: 24, isActive: true },
  { barangid: 6, name: "Minyak Goreng", price: 18000, quantity: 24, isActive: true },
];

// Supplier contoh untuk tampilan barang; relasi transaksi masuk disimpan di stock_history.
const supplierIdByBarangId = {
  1: 1,
  2: 2,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};

function getSupplierName(barangid) {
  const supplierid = supplierIdByBarangId[barangid];
  return initialSuppliers.find((supplier) => supplier.supplierid === supplierid)?.name ?? "Belum ditentukan";
}

export default function Transaksi() {
  const [type, setType] = useState("masuk");
  const [searchQuery, setSearchQuery] = useState("");
  const [listSearchQuery, setListSearchQuery] = useState("");
  const [modalPageSize, setModalPageSize] = useState("5");
  const [listPageSize, setListPageSize] = useState("5");
  const [modalPage, setModalPage] = useState(1);
  const [listPage, setListPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [nextTransactionId, setNextTransactionId] = useState(1);
  const [nextDetailId, setNextDetailId] = useState(1);
  const [nextHistoryId, setNextHistoryId] = useState(1);
  // Daftar transaksi yang berhasil dibuat selama sesi halaman.
  const [transactions, setTransactions] = useState([]);
  const [, setTransactionDetails] = useState([]);
  const [, setStockHistory] = useState([]);
  // Data barang aktif, termasuk stok dan pilihan sementara pada form.
  const [items, setItems] = useState(
    initialItems.map((item) => ({ ...item, selected: false, transactionQuantity: 0 })),
  );

  // Pencarian pada daftar barang di dalam modal transaksi.
  const filteredItems = items.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      getSupplierName(item.barangid).toLowerCase().includes(query)
    );
  });

  // Pencarian pada daftar barang utama.
  const filteredListItems = items.filter((item) => {
    const query = listSearchQuery.trim().toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      getSupplierName(item.barangid).toLowerCase().includes(query)
    );
  });

  // Pembatas jumlah barang yang ditampilkan per halaman di modal transaksi dan daftar barang utama.
  const modalPageCount = modalPageSize === "all"
    ? 1
    : Math.max(1, Math.ceil(filteredItems.length / Number(modalPageSize)));
  const listPageCount = listPageSize === "all"
    ? 1
    : Math.max(1, Math.ceil(filteredListItems.length / Number(listPageSize)));
  const visibleModalItems = modalPageSize === "all"
    ? filteredItems
    : filteredItems.slice((modalPage - 1) * Number(modalPageSize), modalPage * Number(modalPageSize));
  const visibleListItems = listPageSize === "all"
    ? filteredListItems
    : filteredListItems.slice((listPage - 1) * Number(listPageSize), listPage * Number(listPageSize));
  // Hitung pratinjau transaksi dari barang yang dicentang sebelum disimpan.
  const selectedItemsForSummary = items.filter((item) => item.selected);
  const summaryTotalQuantity = selectedItemsForSummary.reduce(
    (total, item) => total + item.transactionQuantity,
    0,
  );
  const summaryTotalPrice = selectedItemsForSummary.reduce(
    (total, item) => total + item.transactionQuantity * item.price,
    0,
  );

  // Mengubah centang atau jumlah barang sebelum transaksi disimpan.
  function updateItem(id, changes) {
    setFormError("");
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.barangid === id ? { ...item, ...changes } : item,
      ),
    );
  }

  function openTransactionModal(transactionType) {
    setType(transactionType);
    setSearchQuery("");
    setModalPage(1);
    setFormError("");
    setFeedback(null);
    setIsModalOpen(true);
  }

  function cancelTransaction() {
    // Buang perubahan form yang belum disimpan tanpa mengubah stok.
    setItems((currentItems) =>
      currentItems.map((item) => ({ ...item, selected: false, transactionQuantity: 0 })),
    );
    setFormError("");
    setSearchQuery("");
    setIsModalOpen(false);
  }

  // CRUD (Create): Menyimpan transaksi baru ke state hardcode, sekaligus menyesuaikan stok barang yang dipilih.
  function saveTransaction() {
    const selectedItems = items.filter((item) => item.selected);

    if (selectedItems.length === 0) {
      setFormError("Pilih setidaknya satu barang untuk transaksi.");
      return;
    }

    const invalidQuantityItem = selectedItems.find(
      (item) => !Number.isInteger(item.transactionQuantity) || item.transactionQuantity <= 0,
    );
    if (invalidQuantityItem) {
      setFormError(`Masukkan jumlah lebih dari 0 untuk ${invalidQuantityItem.name}.`);
      return;
    }

    if (type === "keluar") {
      // Mengecek apakah barang keluar melebihi stok yang tersedia.
      const insufficientStockItem = selectedItems.find(
        (item) => item.transactionQuantity > item.quantity,
      );
      if (insufficientStockItem) {
        setFormError(
          `Stok ${insufficientStockItem.name} hanya ${insufficientStockItem.quantity}; jumlah keluar terlalu banyak.`,
        );
        return;
      }
    }

    const createdAt = new Date().toISOString();
    const details = selectedItems.map((item, index) => ({
      detailid: nextDetailId + index,
      transaksiid: nextTransactionId,
      barangid: item.barangid,
      quantity: item.transactionQuantity,
      price: item.price,
      subtotal: item.transactionQuantity * item.price,
    }));
    // Ringkasan transaksi yang akan disimpan, termasuk total kuantitas dan total harga.
    const transaction = {
      transaksiid: nextTransactionId,
      created_by: MOCK_USER_ID,
      total_quantity: details.reduce((total, detail) => total + detail.quantity, 0),
      total_price: details.reduce((total, detail) => total + detail.subtotal, 0),
      created_at: createdAt,
    };

    // Arah transaksi ditunjukkan dengan tanda changed_quantity di stock_history.
    const newStockHistory = details.map((detail, index) => ({
      historyid: nextHistoryId + index,
      barangid: detail.barangid,
      changed_quantity: type === "masuk" ? detail.quantity : -detail.quantity,
      changed_by: MOCK_USER_ID,
      supplierid: type === "masuk" ? supplierIdByBarangId[detail.barangid] : null,
      change_date: createdAt,
    }));

    // Tambahkan catatan transaksi ke memori sesi; data hilang setelah reload.
    setTransactions((currentTransactions) => [...currentTransactions, transaction]);
    setTransactionDetails((currentDetails) => [...currentDetails, ...details]);
    setStockHistory((currentHistory) => [...currentHistory, ...newStockHistory]);
    setNextTransactionId((currentId) => currentId + 1);
    setNextDetailId((currentId) => currentId + details.length);
    setNextHistoryId((currentId) => currentId + newStockHistory.length);
    // CRUD (Update): Sesuaikan stok barang yang dipilih berdasarkan transaksi yang disimpan.
    setItems((currentItems) =>
      currentItems.map((item) => {
        const detail = details.find((selectedItem) => selectedItem.barangid === item.barangid);
        if (!detail) return item;

        return {
          ...item,
          quantity: item.quantity + (type === "masuk" ? detail.quantity : -detail.quantity),
          selected: false,
          transactionQuantity: 0,
        };
      }),
    );
    setFeedback({
      type: "success",
      message: `Transaksi #${transaction.transaksiid} berhasil disimpan. Total ${transaction.total_quantity} barang, senilai Rp${transaction.total_price.toLocaleString("id-ID")}. ${transactions.length + 1} transaksi dibuat pada sesi ini.`,
    });
    setFormError("");
    setIsModalOpen(false);
  }

  return (
    <div className="transaction-page d-flex flex-column min-vh-100">
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

      <div className="d-flex flex-grow-1 transaction-layout">
        <Sidebar />

        <main className="flex-grow-1 p-4">
          <div className="container-fluid p-0">
            <h2 className="mb-4 fw-bold">Menu Transaksi</h2>

            {feedback && (
              <div className={`alert alert-${feedback.type}`} role="status">
                {feedback.message}
              </div>
            )}

            <section className="card shadow-sm border-0 p-4">
              <h4 className="card-title mb-3">Pilih Jenis Transaksi</h4>
              <p className="text-secondary">Pilih transaksi untuk membuka formulir.</p>
              <div className="d-flex flex-wrap gap-3">
                <button
                  type="button"
                  className="btn transaction-action-button transaction-action-button--in"
                  onClick={() => openTransactionModal("masuk")}
                >
                  Transaksi Stok Masuk
                </button>
                <button
                  type="button"
                  className="btn transaction-action-button transaction-action-button--out"
                  onClick={() => openTransactionModal("keluar")}
                >
                  Transaksi Stok Keluar
                </button>
              </div>
            </section>

            {/* CRUD (Read): daftar barang dan stok yang tersedia untuk transaksi. */}
            <section className="card shadow-sm border-0 p-4 mt-4">
              <h4 className="card-title mb-3">Daftar Barang</h4>
              <div className="mb-3" style={{ maxWidth: 420 }}>
                <label htmlFor="list-item-search" className="form-label fw-semibold">
                  Cari Barang atau Supplier
              </label>
                <input
                  id="list-item-search"
                  type="search"
                  className="form-control"
                  placeholder="Masukkan nama barang atau supplier..."
                  value={listSearchQuery}
                  onChange={(event) => {
                    setListSearchQuery(event.target.value);
                    setListPage(1);
                  }}
                />
              </div>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <label className="d-flex align-items-center gap-2">
                  Tampilkan
                  <select
                    className="form-select form-select-sm"
                    style={{ width: 100 }}
                    value={listPageSize}
                    onChange={(event) => {
                      setListPageSize(event.target.value);
                      setListPage(1);
                    }}
                    aria-label="Jumlah barang yang ditampilkan"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="all">Semua</option>
                  </select>
                  barang
                </label>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-secondary small">
                    Halaman {listPage} dari {listPageCount}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={listPage <= 1 || listPageSize === "all"}
                    onClick={() => setListPage((page) => page - 1)}
                  >
                    Sebelumnya
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={listPage >= listPageCount || listPageSize === "all"}
                    onClick={() => setListPage((page) => page + 1)}
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
              <div className="table-responsive border rounded p-2 bg-light">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Nama Barang</th>
                      <th scope="col">Supplier</th>
                      <th scope="col">Harga</th>
                      <th scope="col">Stok</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleListItems.map((item) => (
                      <tr key={item.barangid}>
                        <td>{item.name}</td>
                        <td>{getSupplierName(item.barangid)}</td>
                        <td>Rp{item.price.toLocaleString("id-ID")}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                    {filteredListItems.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-secondary py-3">
                          Barang atau supplier tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        </main>
      </div>

      {isModalOpen && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setIsModalOpen(false)} />
          <div
            className="modal fade show d-block"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-modal-title"
            tabIndex="-1"
          >
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable transaction-modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title fs-5" id="transaction-modal-title">
                    {type === "masuk" ? "Transaksi Stok Masuk" : "Transaksi Stok Keluar"}
                  </h2>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Tutup"
                    onClick={() => setIsModalOpen(false)}
                  />
                </div>
                <div className="modal-body">
                  {formError && (
                    <div className="alert alert-danger" role="alert">
                      {formError}
                    </div>
                  )}
                  <div className="mb-3" style={{ maxWidth: 420 }}>
                    <label htmlFor="item-search" className="form-label fw-semibold">
                      Cari Barang atau Supplier
                    </label>
                    <input
                      id="item-search"
                      type="search"
                      className="form-control"
                      placeholder="Masukkan nama barang atau supplier..."
                      value={searchQuery}
                      onChange={(event) => {
                        setSearchQuery(event.target.value);
                        setModalPage(1);
                      }}
                    />
                  </div>

                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <label className="d-flex align-items-center gap-2">
                      Tampilkan
                      <select
                        className="form-select form-select-sm"
                        style={{ width: 100 }}
                        value={modalPageSize}
                        onChange={(event) => {
                          setModalPageSize(event.target.value);
                          setModalPage(1);
                        }}
                        aria-label="Jumlah barang yang ditampilkan di formulir transaksi"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="all">Semua</option>
                      </select>
                      barang
                    </label>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-secondary small">
                        Halaman {modalPage} dari {modalPageCount}
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        disabled={modalPage <= 1 || modalPageSize === "all"}
                        onClick={() => setModalPage((page) => page - 1)}
                      >
                        Sebelumnya
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        disabled={modalPage >= modalPageCount || modalPageSize === "all"}
                        onClick={() => setModalPage((page) => page + 1)}
                      >
                        Berikutnya
                      </button>
                    </div>
                  </div>

                  <label className="form-label fw-semibold mb-2">
                    Pilih Barang &amp; Ubah Kuantitas:
                  </label>
                  <div className="table-responsive border rounded p-2 bg-light">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" style={{ width: 50 }} className="text-center">Check</th>
                          <th scope="col">Nama Barang</th>
                          <th scope="col">Supplier</th>
                          <th scope="col">Harga</th>
                          <th scope="col">Stok Saat Ini</th>
                          <th scope="col" style={{ width: 180 }}>Jumlah Barang</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleModalItems.map((item) => (
                      <tr key={item.barangid}>
                        <td className="text-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`item-${item.barangid}`}
                            checked={item.selected}
                            onChange={(event) => updateItem(item.barangid, { selected: event.target.checked })}
                          />
                        </td>
                        <td><label htmlFor={`item-${item.barangid}`} className="user-select-none">{item.name}</label></td>
                        <td>{getSupplierName(item.barangid)}</td>
                        <td>Rp{item.price.toLocaleString("id-ID")}</td>
                        <td>{item.quantity}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            min="0"
                            value={item.transactionQuantity}
                            aria-label={`Jumlah ${item.name}`}
                            onChange={(event) => updateItem(item.barangid, { transactionQuantity: Math.max(0, Number(event.target.value)) })}
                          />
                        </td>
                      </tr>
                    ))}
                        {filteredItems.length === 0 && (
                          <tr>
                            <td colSpan="6" className="text-center text-secondary py-3">
                              Barang atau supplier tidak ditemukan.
                            </td>
                          </tr>
                        )}
                  </tbody>
                </table>
              </div>

                  {/* Ringkasan ini berubah langsung saat pilihan atau kuantitas diedit. */}
                  {selectedItemsForSummary.length > 0 && (
                    <section className="mt-4 p-3 border rounded bg-white" aria-labelledby="transaction-summary-title">
                      <h3 className="h6 fw-bold mb-3" id="transaction-summary-title">
                        Ringkasan Transaksi
                      </h3>
                      <div className="table-responsive">
                        <table className="table table-sm align-middle mb-0">
                          <thead>
                            <tr>
                              <th scope="col">Barang</th>
                              <th scope="col">Supplier</th>
                              <th scope="col">Jumlah</th>
                              <th scope="col">Harga Satuan</th>
                              <th scope="col">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedItemsForSummary.map((item) => (
                              <tr key={item.barangid}>
                                <td>{item.name}</td>
                                <td>{getSupplierName(item.barangid)}</td>
                                <td>{item.transactionQuantity}</td>
                                <td>Rp{item.price.toLocaleString("id-ID")}</td>
                                <td>Rp{(item.transactionQuantity * item.price).toLocaleString("id-ID")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="d-flex flex-wrap justify-content-end gap-3 mt-3">
                        <span>Total kuantitas: <strong>{summaryTotalQuantity}</strong></span>
                        <span>Total harga: <strong>Rp{summaryTotalPrice.toLocaleString("id-ID")}</strong></span>
                      </div>
                    </section>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelTransaction}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={saveTransaction}
                  >
                  Simpan Transaksi
                </button>
              </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}