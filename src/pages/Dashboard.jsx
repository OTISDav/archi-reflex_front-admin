import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // axios configuré avec Bearer JWT
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Récupérer les RDV
  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments/admin/appointments/"); 
      setAppointments(res.data);
    } catch (err) {
      console.error("Erreur RDV:", err);
    }
  };

  // 🔹 Récupérer les projets
  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects/projects/admin/"); 
      setProjects(res.data);
    } catch (err) {
      console.error("Erreur projets:", err);
    }
  };

  // 🔹 Récupérer les demandes de stage
  const fetchInternships = async () => {
    try {
      const res = await api.get("/internships/admin/"); 
      setInternships(res.data);
    } catch (err) {
      console.error("Erreur stage:", err);
    }
  };

  // 🔹 useEffect global
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAppointments(), fetchProjects(), fetchInternships()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // 🔹 Stats RDV
  const totalRDV = appointments.length;
  const pendingRDV = appointments.filter((a) => a.status === "pending").length;
  const confirmedRDV = appointments.filter((a) => a.status === "confirmed").length;
  const cancelledRDV = appointments.filter((a) => a.status === "cancelled").length;

  return (
    <section className="dashboard">
      <div className="dashboard-inner">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Vue d’ensemble & statistiques générales</p>
        </header>

        {loading ? (
          <p>Chargement des données...</p>
        ) : (
          <div className="dashboard-cards">
            {/* Carte RDV */}
            <div
              className="dashboard-card cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate("/admin/appointments")}
            >
              <span className="card-label">Rendez-vous</span>
              <strong className="card-value">{totalRDV}</strong>
              <p className="text-sm">Total</p>
              <p className="text-xs text-yellow-400">En attente: {pendingRDV}</p>
              <p className="text-xs text-green-400">Confirmés: {confirmedRDV}</p>
              <p className="text-xs text-red-400">Annulés: {cancelledRDV}</p>
            </div>

            {/* Carte Stages */}
            <div
              className="dashboard-card cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate("/admin/internships")}
            >
              <span className="card-label">Demandes de stage</span>
              <strong className="card-value">{internships.length}</strong>
            </div>

            {/* Carte Projets */}
            <div
              className="dashboard-card cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate("/admin/projects")}
            >
              <span className="card-label">Projets</span>
              <strong className="card-value">{projects.length}</strong>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
