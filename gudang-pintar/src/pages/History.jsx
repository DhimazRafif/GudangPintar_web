import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "./history-style.css";
import {
  getHistoryEntries,
  HISTORY_STORAGE_KEY,
  HISTORY_UPDATED_EVENT,
} from "../services/historyService";

const historyData = [
  { id: 1, action: "Ubah jumlah stok", itemName: "Air mineral", before: "7", after: "31", date: "4/6/2025" },
  { id: 2, action: "Ubah jumlah stok", itemName: "Air mineral", before: "7", after: "5", date: "4/6/2025" },
  { id: 3, action: "Ubah harga", itemName: "Air mineral", before: "3000", after: "4000", date: "4/6/2025" },
  { id: 4, action: "Ubah kategori", itemName: "Air mineral", before: "Makanan dan minuman", after: "ATK", date: "4/6/2025" },
];

function getChanges(entry) {
  return Array.isArray(entry.changes)
    ? entry.changes
    : [{ itemName: entry.itemName, before: entry.before, after: entry.after }];
}

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedHistory, setSavedHistory] = useState(getHistoryEntries);

  useEffect(() => {
    const updateHistory = () => setSavedHistory(getHistoryEntries());
    const handleStorage = (event) => {
      if (event.key === HISTORY_STORAGE_KEY) updateHistory();
    };

    window.addEventListener(HISTORY_UPDATED_EVENT, updateHistory);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(HISTORY_UPDATED_EVENT, updateHistory);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const keyword = searchQuery.trim().toLowerCase();
  const filteredHistory = [...savedHistory, ...historyData].filter((entry) =>
    [entry.action, entry.date, ...getChanges(entry).flatMap((change) => [
      change.itemName, change.before, change.after,
    ])].some((value) => String(value ?? "").toLowerCase().includes(keyword)),
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="dashboard-layout d-flex flex-column flex-md-row">
        <Sidebar />

        <main className="main-content history-main flex-grow-1">
          <div className="history-list container-fluid p-2 p-md-3">
            {filteredHistory.length === 0 ? (
              <p className="text-secondary p-3" role="status">Riwayat tidak ditemukan.</p>
            ) : (
              filteredHistory.map((entry) => (
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
        </main>
      </div>

      <footer className="footer-db mt-auto">
        <p className="mb-0">&copy; 2026 Gudang Pintar</p>
      </footer>
    </div>
  );
}