export const HISTORY_STORAGE_KEY = "gudang-pintar-history-v1";
export const HISTORY_UPDATED_EVENT = "gudang-pintar-history-updated";

let memoryHistory = [];

function createHistoryId() {
  return `history-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createChange({ itemName, before, after }) {
  if (!itemName || before == null || after == null || String(before) === String(after)) {
    return null;
  }
  return { itemName, before: String(before), after: String(after) };
}

function getStockAction(changes) {
  if (changes.every(({ before, after }) => Number(after) > Number(before))) {
    return "Transaksi stok masuk";
  }
  if (changes.every(({ before, after }) => Number(after) < Number(before))) {
    return "Transaksi stok keluar";
  }
  return "Transaksi stok";
}

function groupLegacyTransactions(entries) {
  const result = [];
  const groups = new Map();

  for (const entry of entries) {
    const isLegacyStock = entry.action === "Ubah jumlah stok" &&
      entry.createdAt && !Array.isArray(entry.changes);
    if (!isLegacyStock) {
      result.push(entry);
      continue;
    }

    const key = entry.createdAt;
    let group = groups.get(key);
    if (!group) {
      group = {
        id: `transaction-${entry.id}`,
        action: "Transaksi stok",
        date: entry.date,
        createdAt: entry.createdAt,
        changes: [],
      };
      groups.set(key, group);
      result.push(group);
    }
    const change = createChange(entry);
    if (change) group.changes.push(change);
  }

  for (const group of groups.values()) {
    if (group.changes.length) group.action = getStockAction(group.changes);
  }
  return result;
}

export function getHistoryEntries() {
  try {
    const saved = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved !== null) {
      const entries = JSON.parse(saved);
      return Array.isArray(entries) ? groupLegacyTransactions(entries) : [];
    }
  } catch (error) {
    console.warn("Riwayat tidak dapat dibaca dari localStorage:", error);
  }
  return groupLegacyTransactions(memoryHistory);
}

function saveHistoryEntry(entry) {
  const updatedHistory = [entry, ...getHistoryEntries()];
  memoryHistory = updatedHistory;
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.warn("Riwayat hanya tersimpan selama tab dibuka:", error);
  }
  window.dispatchEvent(new Event(HISTORY_UPDATED_EVENT));
  return entry;
}

export function recordTransactionStockHistory(selectedItems, type) {
  if (type !== "masuk" && type !== "keluar") return null;
  const sign = type === "masuk" ? 1 : -1;
  const changes = selectedItems
    .map((item) => createChange({
      itemName: item.name,
      before: item.quantity,
      after: item.quantity + sign * item.transactionQuantity,
    }))
    .filter(Boolean);

  if (changes.length === 0) return null;
  const now = new Date();
  return saveHistoryEntry({
    id: createHistoryId(),
    action: type === "masuk" ? "Transaksi stok masuk" : "Transaksi stok keluar",
    changes,
    date: now.toLocaleDateString("id-ID"),
    createdAt: now.toISOString(),
  });
}

export function recordPriceChange(itemName, oldPrice, newPrice) {
  const change = createChange({ itemName, before: oldPrice, after: newPrice });
  if (!change) return null;
  const now = new Date();
  return saveHistoryEntry({
    id: createHistoryId(),
    action: "Ubah harga",
    ...change,
    date: now.toLocaleDateString("id-ID"),
    createdAt: now.toISOString(),
  });
}

export function recordCategoryChange(itemName, oldCategory, newCategory) {
  const change = createChange({ itemName, before: oldCategory, after: newCategory });
  if (!change) return null;
  const now = new Date();
  return saveHistoryEntry({
    id: createHistoryId(),
    action: "Ubah kategori",
    ...change,
    date: now.toLocaleDateString("id-ID"),
    createdAt: now.toISOString(),
  });
}