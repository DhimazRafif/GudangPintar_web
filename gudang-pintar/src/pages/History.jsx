import { useEffect, useState } from "react";
import MainLayout from "../Layouts/MainLayout";
import FilterGroup from "../components/common/FilterGroup";
import Pagination from "../components/common/Pagination";
import Button from "../components/common/Button";
import "./history-style.css";
import {
  getHistoryEntries,
  HISTORY_STORAGE_KEY,
  HISTORY_UPDATED_EVENT,
} from "../services/historyService";

// Data contoh lama
const historyData = [
  { id: 1, action: "Ubah jumlah stok", itemName: "Air mineral", before: "7", after: "31", date: "4/6/2025" },
  { id: 2, action: "Ubah jumlah stok", itemName: "Air mineral", before: "7", after: "5", date: "4/6/2025" },
  { id: 3, action: "Ubah harga", itemName: "Air mineral", before: "3000", after: "4000", date: "4/6/2025" },
  { id: 4, action: "Ubah kategori", itemName: "Air mineral", before: "Makanan dan minuman", after: "ATK", date: "4/6/2025" },
];

// Jumlah card tiap halaman
const ITEMS_PER_PAGE = 6;

function getChanges(entry) {
  return Array.isArray(entry.changes)
    ? entry.changes
    : [{ itemName: entry.itemName, before: entry.before, after: entry.after }];
}

function getHistoryCategory(entry) {
  const action = String(entry.action ?? "").toLowerCase();

  if (entry.source === "transaksi" || action.startsWith("transaksi")) {
    return "transaksi";
  }
  if (action.includes("harga")) return "harga";
  if (action.includes("kategori")) return "kategori";
  if (entry.source === "barang" || action.includes("stok")) return "stok";

  return "lainnya";
}

function getStockDirection(entry) {
  const changes = getChanges(entry);
  if (!changes.length) return null;

  const differences = changes.map(({ before, after }) => Number(after) - Number(before));
  if (differences.some((difference) => !Number.isFinite(difference))) return null;
  if (differences.every((difference) => difference > 0)) return "stok-masuk";
  if (differences.every((difference) => difference < 0)) return "stok-keluar";
  return null;
}

function matchesType(entry, type) {
  if (type === "all") return true;

  const category = getHistoryCategory(entry);
  if (type === "stok-masuk" || type === "stok-keluar") {
    return category === "stok" && getStockDirection(entry) === type;
  }
  return category === type;
}

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedHistory, setSavedHistory] = useState(getHistoryEntries);

  // Sinkronisasi History saat ada perubahan pada tab ini atau tab lain.
  useEffect(() => {
    const updateHistory = () => {
      setSavedHistory(getHistoryEntries());
      setCurrentPage(1);
    };
    const handleStorage = (event) => {
      if (event.key === HISTORY_STORAGE_KEY || event.key === null) updateHistory();
    };

    window.addEventListener(HISTORY_UPDATED_EVENT, updateHistory);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(HISTORY_UPDATED_EVENT, updateHistory);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Kembalikan ke halaman pertama ketika filter atau pencarian berubah.
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setSearchQuery("");
    setSelectedType("all");
    setCurrentPage(1);
  };

  const keyword = searchQuery.trim().toLowerCase();
  const allHistory = [...savedHistory, ...historyData];
  const searchedHistory = allHistory.filter((entry) =>
    [entry.action, entry.date, ...getChanges(entry).flatMap((change) => [
      change.itemName, change.before, change.after,
    ])].some((value) => String(value ?? "").toLowerCase().includes(keyword)),
  );

  const filterOptions = [
    { value: "all", label: "Semua Riwayat" },
    { value: "transaksi", label: "Transaksi" },
    { value: "stok", label: "Kelola Stok (Tambah/Kurang)" },
    { value: "stok-masuk", label: "Tambah Stok" },
    { value: "stok-keluar", label: "Kurang Stok" },
    { value: "harga", label: "Update Harga" },
    { value: "kategori", label: "Update Kategori" },
  ].map((option) => ({
    ...option,
    count: searchedHistory.filter((entry) => matchesType(entry, option.value)).length,
  }));

  const filteredHistory = searchedHistory.filter((entry) => matchesType(entry, selectedType));
  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const displayedHistory = filteredHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const isFilterActive = keyword !== "" || selectedType !== "all";

  return (
    <MainLayout searchQuery={searchQuery} setSearchQuery={handleSearchChange}>
      <div className="history-page">
        <h1 className="dashboard-title">Riwayat Aktivitas</h1>
        <p className="dashboard-description">
          Pantau transaksi dan perubahan stok, harga, serta kategori barang.
        </p>

        <div className="history-filter bg-white p-3 rounded-3 border mb-3 shadow-sm d-flex flex-column flex-sm-row align-items-stretch align-items-sm-end justify-content-between gap-3">
          <FilterGroup
            id="filter-jenis-riwayat"
            label="Jenis Riwayat"
            options={filterOptions}
            selectedValue={selectedType}
            onChange={handleTypeChange}
          />
          {isFilterActive && (
            <Button variant="secondary" size="sm" onClick={handleResetFilter}>
              Reset Filter
            </Button>
          )}
        </div>

        <div className="history-list">
          {displayedHistory.length === 0 ? (
            <div className="alert alert-secondary text-center" role="status">
              Tidak ada riwayat yang sesuai dengan pencarian atau filter.
            </div>
          ) : (
            displayedHistory.map((entry) => (
              <article className="card history-card" key={entry.id}>
                <div className="card-body">
                  <div className="history-head d-flex justify-content-between gap-3">
                    <span>{entry.action}</span>
                    <time className="history-date">{entry.date}</time>
                  </div>
                  {getChanges(entry).map((change, index) => (
                    <div
                      className={`history-detail${index > 0 ? " border-top" : ""}`}
                      key={`${entry.id}-${index}`}
                    >
                      <strong className="history-item-name">{change.itemName}</strong>
                      <span className="history-old-value">{change.before}</span>
                      <span className="history-arrow" aria-label="menjadi">→</span>
                      <span className="history-new-value">{change.after}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>

        <Pagination
          currentPage={activePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          ariaLabel="Navigasi Halaman Riwayat"
        />
      </div>
    </MainLayout>
  );
}
