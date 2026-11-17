import { useCallback, useEffect, useRef, useState } from "react";
import MainLayout from "../app-layouts/MainLayout";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import Input from "../components/common/Input";
import CheckboxControl from "../components/common/CheckboxControl";
import useNotification from "../hooks/useNotification";
import useFetch from "../hooks/useFetch";
import useFocusTrap from "../hooks/useFocusTrap";
import "./Transaksi.css";
import { recordTransactionStockHistory } from "../services/historyService";

// ID pengguna contoh untuk menggantikan user yang nantinya berasal dari autentikasi.
const MOCK_USER_ID = 1;

function getSupplierName(item) {
  return item.supplierName ?? item.supplier ?? "Belum ditentukan";
}

export default function Transaksi() {
  const { data: fetchedItems, isLoading, error, refetch } = useFetch("/barang.json");
  const { notify } = useNotification();
  const [type, setType] = useState("masuk");
  const [searchQuery, setSearchQuery] = useState("");
  const [listSearchQuery, setListSearchQuery] = useState("");
  const [modalPageSize, setModalPageSize] = useState("10");
  const [listPageSize, setListPageSize] = useState("10");
  const [modalPage, setModalPage] = useState(1);
  const [listPage, setListPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nextTransactionId, setNextTransactionId] = useState(1);
  const [nextDetailId, setNextDetailId] = useState(1);
  const [nextHistoryId, setNextHistoryId] = useState(1);
  // Daftar transaksi yang berhasil dibuat selama sesi halaman.
  const [transactions, setTransactions] = useState([]);
  const [, setTransactionDetails] = useState([]);
  const [, setStockHistory] = useState([]);
  // Data barang dari public/barang.json beserta pilihan sementara pada formulir.
  const [items, setItems] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!fetchedItems.length) return;
    setItems(
      fetchedItems.map((item) => ({
        ...item,
        selected: false,
        transactionQuantity: 0,
      })),
    );
  }, [fetchedItems]);

  useEffect(() => {
    if (error) {
      notify({ type: "danger", title: "Gagal memuat barang", message: error });
    }
  }, [error, notify]);

  const cancelTransaction = useCallback(() => {
    // Buang perubahan form yang belum disimpan tanpa mengubah stok.
    setItems((currentItems) =>
      currentItems.map((item) => ({ ...item, selected: false, transactionQuantity: 0 })),
    );
    setSearchQuery("");
    setIsModalOpen(false);
  }, []);

  useFocusTrap({
    active: isModalOpen,
    containerRef: modalRef,
    onEscape: cancelTransaction,
  });

  // Pencarian pada daftar barang di dalam modal transaksi.
  const filteredItems = items.filter((item) => {
    if (Number(item.isActive) !== 1) return false;
    const query = searchQuery.trim().toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      getSupplierName(item).toLowerCase().includes(query)
    );
  });

  // Pencarian pada daftar barang utama.
  const filteredListItems = items.filter((item) => {
    if (Number(item.isActive) !== 1) return false;
    const query = listSearchQuery.trim().toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      getSupplierName(item).toLowerCase().includes(query)
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
    setIsModalOpen(true);
  }

  function showFormError(message) {
    notify({ type: "danger", message });
  }

  // CRUD (Create): Menyimpan transaksi baru ke state hardcode, sekaligus menyesuaikan stok barang yang dipilih.
  function saveTransaction() {
    const selectedItems = items.filter((item) => item.selected);

    if (selectedItems.length === 0) {
      showFormError("Pilih setidaknya satu barang untuk transaksi.");
      return;
    }

    const invalidQuantityItem = selectedItems.find(
      (item) => !Number.isInteger(item.transactionQuantity) || item.transactionQuantity <= 0,
    );
    if (invalidQuantityItem) {
      showFormError(`Masukkan jumlah lebih dari 0 untuk ${invalidQuantityItem.name}.`);
      return;
    }

    if (type === "keluar") {
      // Mengecek apakah barang keluar melebihi stok yang tersedia.
      const insufficientStockItem = selectedItems.find(
        (item) => item.transactionQuantity > item.quantity,
      );
      if (insufficientStockItem) {
        showFormError(
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
      supplierid: null,
      change_date: createdAt,
    }));

    // Tambahkan catatan transaksi ke memori sesi; data hilang setelah reload.
    setTransactions((currentTransactions) => [...currentTransactions, transaction]);
    setTransactionDetails((currentDetails) => [...currentDetails, ...details]);
    setStockHistory((currentHistory) => [...currentHistory, ...newStockHistory]);

    // Catat perubahan stok hanya setelah transaksi berhasil divalidasi.
    recordTransactionStockHistory(selectedItems, type);
    
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
    notify({
      type: "success",
      title: "Transaksi berhasil",
      message: `Transaksi #${transaction.transaksiid} berhasil disimpan. Total ${transaction.total_quantity} barang, senilai Rp${transaction.total_price.toLocaleString("id-ID")}. ${transactions.length + 1} transaksi dibuat pada sesi ini.`,
    });
    setIsModalOpen(false);
  }

  return (
    <MainLayout
      searchQuery={listSearchQuery}
      setSearchQuery={(query) => {
        setListSearchQuery(query);
        setListPage(1);
      }}
    >
      <div className="transaction-page">
        <main className="transaction-content">
          <div className="container-fluid p-0">
            <h2 className="mb-4 fw-bold">Menu Transaksi</h2>

            {isLoading && (
              <div className="alert alert-info" role="status" aria-live="polite">
                Memuat data barang...
              </div>
            )}

            <section className="card shadow-sm border-0 p-4">
              <h4 className="card-title mb-3">Pilih Jenis Transaksi</h4>
              <p className="text-secondary">Pilih transaksi untuk membuka formulir.</p>
              <div className="d-flex flex-wrap gap-3">
                <Button
                  className="transaction-action-button transaction-action-button--in"
                  disabled={isLoading || Boolean(error)}
                  onClick={() => openTransactionModal("masuk")}
                >
                  Transaksi Stok Masuk
                </Button>
                <Button
                  variant="danger"
                  className="transaction-action-button transaction-action-button--out"
                  disabled={isLoading || Boolean(error)}
                  onClick={() => openTransactionModal("keluar")}
                >
                  Transaksi Stok Keluar
                </Button>
              </div>
            </section>

            {/* CRUD (Read): daftar barang dan stok yang tersedia untuk transaksi. */}
            <section className="card shadow-sm border-0 p-4 mt-4">
              <h4 className="card-title mb-3">Daftar Barang</h4>
              <div className="table-responsive border rounded p-2 bg-light">
                <table className="table table-hover align-middle mb-0 transaction-table">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Nama Barang</th>
                      <th scope="col">Supplier</th>
                      <th scope="col">Harga</th>
                      <th scope="col">Stok</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="4" className="text-center text-secondary py-3">
                          Memuat barang...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="4" className="text-center text-secondary py-3">
                          <div className="d-flex flex-column align-items-center gap-2">
                            <span>Data barang belum dapat ditampilkan.</span>
                            <Button variant="secondary" size="sm" onClick={refetch}>
                              Coba lagi
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : visibleListItems.map((item) => (
                      <tr key={item.barangid}>
                        <td>{item.name}</td>
                        <td>{getSupplierName(item)}</td>
                        <td>Rp{item.price.toLocaleString("id-ID")}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                    {!isLoading && !error && filteredListItems.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-secondary py-3">
                          {items.length === 0
                            ? "Belum ada data barang."
                            : "Barang atau supplier tidak ditemukan."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={listPage}
                totalPages={listPageCount}
                onPageChange={setListPage}
                ariaLabel="Halaman daftar barang transaksi"
                pageSize={listPageSize}
                onPageSizeChange={setListPageSize}
                itemLabel="barang"
              />
            </section>

          </div>
        </main>

      {isModalOpen && (
        <>
          <div className="modal-backdrop fade show" onClick={cancelTransaction} />
          <div
            ref={modalRef}
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
                    onClick={cancelTransaction}
                  />
                </div>
                <div className="modal-body">
                  <Input
                    id="item-search"
                    label="Cari Barang atau Supplier"
                    type="search"
                    className="transaction-search mb-3"
                    placeholder="Masukkan nama barang atau supplier..."
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setModalPage(1);
                    }}
                  />

                  <label className="form-label fw-semibold mb-2">
                    Pilih Barang &amp; Ubah Kuantitas:
                  </label>
                  <div className="table-responsive border rounded p-2 bg-light">
                    <table className="table table-hover align-middle mb-0 transaction-table modal-table">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" className="text-center transaction-check-column">Pilih</th>
                          <th scope="col">Nama Barang</th>
                          <th scope="col">Supplier</th>
                          <th scope="col">Harga</th>
                          <th scope="col">Stok Saat Ini</th>
                          <th scope="col" className="transaction-quantity-column">Jumlah Barang</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleModalItems.map((item) => (
                      <tr key={item.barangid}>
                        <td className="text-center">
                          <CheckboxControl
                            id={`item-${item.barangid}`}
                            checked={item.selected}
                            onChange={(event) => updateItem(item.barangid, { selected: event.target.checked })}
                          />
                        </td>
                        <td><label htmlFor={`item-${item.barangid}`} className="user-select-none">{item.name}</label></td>
                        <td>{getSupplierName(item)}</td>
                        <td>Rp{item.price.toLocaleString("id-ID")}</td>
                        <td>{item.quantity}</td>
                        <td>
                          <Input
                            id={`item-quantity-${item.barangid}`}
                            type="number"
                            className="transaction-quantity-field"
                            inputClassName="form-control-sm"
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
              <Pagination
                currentPage={modalPage}
                totalPages={modalPageCount}
                onPageChange={setModalPage}
                ariaLabel="Halaman pilihan barang transaksi"
                pageSize={modalPageSize}
                onPageSizeChange={setModalPageSize}
                itemLabel="barang"
                scrollToTop={false}
              />

                  {/* Ringkasan ini berubah langsung saat pilihan atau kuantitas diedit. */}
                  {selectedItemsForSummary.length > 0 && (
                    <section className="mt-4 p-3 border rounded bg-white" aria-labelledby="transaction-summary-title">
                      <h3 className="h6 fw-bold mb-3" id="transaction-summary-title">
                        Ringkasan Transaksi
                      </h3>
                      <div className="table-responsive">
                        <table className="table table-sm align-middle mb-0 summary-table">
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
                                <td>{getSupplierName(item)}</td>
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
                  <Button
                    variant="secondary"
                    onClick={cancelTransaction}
                  >
                    Batal
                  </Button>
                  <Button
                    variant="primary"
                    onClick={saveTransaction}
                  >
                  Simpan Transaksi
                  </Button>
              </div>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </MainLayout>
  );
}
