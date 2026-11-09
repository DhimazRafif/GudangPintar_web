import "./App.css";
import Dashboard from "./pages/Dashboard";
import Transaksi from "./pages/Transaksi";
import Login from "./pages/Login";
import Supplier from "./pages/Supplier";
import { Navigate, Route, Routes } from "react-router-dom";

function RequireAuth({ children }) {
  return sessionStorage.getItem("gp-admin-session") === "active"
    ? children
    : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={sessionStorage.getItem("gp-admin-session") === "active" ? "/Dashboard" : "/login"} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/transaksi" element={<RequireAuth><Transaksi /></RequireAuth>} />
      <Route path="/supplier" element={<RequireAuth><Supplier /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
export default App;
