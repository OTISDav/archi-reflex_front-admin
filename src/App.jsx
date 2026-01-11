import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Internships from "./pages/Internships";
import Projects from "./pages/Projects";
import AdminLayout from "./layout/AdminLayout";

const PrivateRoute = ({ children }) => {
  return localStorage.getItem("admin_token")
    ? children
    : <Navigate to="/admin/login" replace />;
};

export default function App() {
  return (
    <Routes>

      {/* Redirection racine */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      {/* Login */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="internships" element={<Internships />} />
        <Route path="projects" element={<Projects />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<h1>404 - Page introuvable</h1>} />

    </Routes>
  );
}
