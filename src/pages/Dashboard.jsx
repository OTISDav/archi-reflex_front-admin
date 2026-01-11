import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <section className="dashboard">
      <div className="dashboard-inner">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Vue d’ensemble & statistiques générales</p>
        </header>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <span className="card-label">Rendez-vous</span>
            <strong className="card-value">—</strong>
          </div>

          <div className="dashboard-card">
            <span className="card-label">Demandes de stage</span>
            <strong className="card-value">—</strong>
          </div>

          {/* Carte Projets cliquable */}
          <div
            className="dashboard-card cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/admin/projects")}
          >
            <span className="card-label">Projets</span>
            <strong className="card-value">—</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
