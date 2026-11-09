import "./App.css";
import Dashboard from "./pages/Dashboard";
import Transaksi from "./pages/Transaksi";
import History from "./pages/History";
import PengelolaanAkun from "./pages/PengelolaanAkun";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Dashboard" replace />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/transaksi" element={<Transaksi />} />
      <Route path="/history" element={<History />} />
      <Route path="/akun" element={<PengelolaanAkun />} />
      <Route path="*" element={<Navigate to="/Dashboard" replace />} />
    </Routes>
  );
}
export default App;