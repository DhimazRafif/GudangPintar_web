
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "./history-style.css";

const historyData = [
  { id: 1, action: "Ubah jumlah stok", itemName: "Air mineral", before: "7", after: "31", date: "4/6/2025" },
  { id: 2, action: "Ubah jumlah stok", itemName: "Air mineral", before: "7", after: "5", date: "4/6/2025" },
  { id: 3, action: "Ubah harga", itemName: "Air mineral", before: "3000", after: "4000", date: "4/6/2025" },
  { id: 4, action: "Ubah kategori", itemName: "Air mineral", before: "Makanan dan minuman", after: "ATK", date: "4/6/2025" },
];

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");

  // Header menerima state pencarian seperti pada halaman Dashboard.
  const keyword = searchQuery.trim().toLowerCase();
  const filteredHistory = historyData.filter((entry) =>
    [entry.action, entry.itemName, entry.before, entry.after, entry.date].some(
      (value) => value.toLowerCase().includes(keyword),
    ),
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
                    <div className="history-detail">
                      <strong className="history-item-name">{entry.itemName}</strong>
                      <span className="history-old-value">{entry.before}</span>
                      <span className="history-arrow" aria-label="menjadi">→</span>
                      <span className="history-new-value">{entry.after}</span>
                    </div>
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