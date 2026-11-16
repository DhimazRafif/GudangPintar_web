const ACCOUNTS_STORAGE_KEY = "gp-accounts";
const PENDING_ACCOUNTS_STORAGE_KEY = "gp-pending-accounts";

export const DEFAULT_ACCOUNTS = [
  { id: 1, username: "sitikhadijah", password: "admin123", role: "Admin" },
  { id: 2, username: "dhimaz", password: "user123", role: "Pegawai" },
  { id: 3, username: "budisantoso", password: "budi123", role: "Pegawai" },
  { id: 4, username: "rinamelati", password: "rina123", role: "Admin" },
  { id: 5, username: "agussalim", password: "agus123", role: "Pegawai" },
  { id: 6, username: "dewilestari", password: "dewi123", role: "Pegawai" },
];

export function getStoredAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return DEFAULT_ACCOUNTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ACCOUNTS;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

export function saveStoredAccounts(accounts) {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    return;
  }
}

export function getPendingAccounts() {
  try {
    const raw = localStorage.getItem(PENDING_ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePendingAccounts(pendingAccounts) {
  try {
    localStorage.setItem(PENDING_ACCOUNTS_STORAGE_KEY, JSON.stringify(pendingAccounts));
  } catch {
    return;
  }
}

export function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem("gp-current-user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
