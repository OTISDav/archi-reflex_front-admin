import { useEffect, useState } from "react";
import api from "../api/axios"; // axios avec token Bearer JWT
import "./Dashboard.css";

export default function AppointmentsAdmin() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "pending", "confirmed", "cancelled"
  const [search, setSearch] = useState(""); // recherche nom/email

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      // 🔹 Vérifie que l'URL correspond bien à ton backend
      const res = await api.get("/appointments/admin/appointments/"); 
      console.log("RDV reçus :", res.data); // 🔹 Debug : voir les RDV dans la console
      setAppointments(res.data);
      setFilteredAppointments(res.data);
    } catch (err) {
      console.error("Erreur API:", err);
      setError(
        "Impossible de charger les rendez-vous. Vérifie l'URL et ton token admin."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/admin/appointments/${id}/`, { status });
      fetchAppointments(); // rafraîchir après changement
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  // Filtrage combiné : status + recherche
  useEffect(() => {
    let filtered = [...appointments];

    if (filter !== "all") {
      filtered = filtered.filter((apt) => apt.status === filter);
    }

    if (search.trim() !== "") {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.name.toLowerCase().includes(lower) ||
          apt.email.toLowerCase().includes(lower)
      );
    }

    setFilteredAppointments(filtered);
  }, [filter, search, appointments]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <section className="dashboard">
      <div className="dashboard-inner">
        <header className="dashboard-header">
          <h1>Rendez-vous Admin</h1>
          <p>Gestion complète des rendez-vous</p>

          {/* Filtres */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {["all", "pending", "confirmed", "cancelled"].map((f) => (
              <button
                key={f}
                className={`px-3 py-1 rounded ${
                  filter === f ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
                }`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "Tous" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}

            {/* Input recherche */}
            <input
              type="text"
              placeholder="Rechercher par nom ou email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input ml-2"
              style={{ minWidth: "200px" }}
            />
          </div>
        </header>

        {loading ? (
          <p>Chargement des rendez-vous...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredAppointments.length === 0 ? (
          <p>Aucun rendez-vous disponible.</p>
        ) : (
          <div className="dashboard-cards">
            {filteredAppointments.map((apt) => (
              <div key={apt.id} className="dashboard-card">
                <span className="card-label">{apt.name}</span>
                <p className="text-sm mb-1">{apt.email}</p>
                <p className="text-sm mb-1">{apt.phone}</p>
                <p className="text-sm mb-1">{apt.project_type}</p>
                <p className="text-sm mb-1">
                  {new Date(apt.date).toLocaleString()}
                </p>

                <span
                  className={`text-xs text-white px-2 py-1 rounded ${getStatusColor(
                    apt.status
                  )}`}
                >
                  {apt.status}
                </span>

                <div className="mt-4 flex gap-2">
                  {apt.status !== "confirmed" && (
                    <button
                      className="btn btn-edit"
                      onClick={() => updateStatus(apt.id, "confirmed")}
                    >
                      Confirmer
                    </button>
                  )}
                  {apt.status !== "cancelled" && (
                    <button
                      className="btn btn-delete"
                      onClick={() => updateStatus(apt.id, "cancelled")}
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
