import "./App.css";
import Dashboard from "./pages/Dashboard";
import Transaksi from "./pages/Transaksi";
import History from "./pages/History";
import PengelolaanAkun from "./pages/PengelolaanAkun";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Supplier from "./pages/Supplier";
import { Navigate, Route, Routes } from "react-router-dom";
import NotificationProvider from "./contexts/NotificationProvider";

function RequireAuth({ children }) {
  return sessionStorage.getItem("gp-admin-session") === "active"
    ? children
    : <Navigate to="/login" replace />;
}

function App() {
  return (
    <NotificationProvider>
      <Routes>
        <Route path="/" element={<Navigate to={sessionStorage.getItem("gp-admin-session") === "active" ? "/Dashboard" : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/transaksi" element={<RequireAuth><Transaksi /></RequireAuth>} />
        <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
        <Route path="/akun" element={<RequireAuth><PengelolaanAkun /></RequireAuth>} />
        <Route path="/supplier" element={<RequireAuth><Supplier /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </NotificationProvider>
  );
}
export default App;
