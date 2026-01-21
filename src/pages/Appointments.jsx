import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Dashboard.css";

export default function AppointmentsAdmin() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("all"); // all | pending | confirmed | cancelled
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // ==========================
  // 🔄 Charger les RDV
  // ==========================
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/appointments/admin/appointments/");
      setAppointments(res.data);
      setFilteredAppointments(res.data);
    } catch (err) {
      console.error(err);
      setError(
        "Impossible de charger les rendez-vous. Vérifie ton token admin."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // ✏️ Modifier le statut
  // ==========================
  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/appointments/admin/appointments/${id}/`, { status });
      await fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du statut.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================
  // 🔍 Filtres + recherche
  // ==========================
  useEffect(() => {
    let filtered = [...appointments];

    if (filter !== "all") {
      filtered = filtered.filter((apt) => apt.status === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.name.toLowerCase().includes(q) ||
          apt.email.toLowerCase().includes(q)
      );
    }

    setFilteredAppointments(filtered);
  }, [filter, search, appointments]);

  // ==========================
  // 🎨 Couleur du statut
  // ==========================
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-green-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "confirmed":
        return "Confirmé";
      case "cancelled":
        return "Annulé";
      default:
        return status;
    }
  };

  // ==========================
  // 🚀 On mount
  // ==========================
  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <section className="dashboard">
      <div className="dashboard-inner">
        <header className="dashboard-header">
          <h1>Rendez-vous – Admin</h1>
          <p>Validation et gestion des rendez-vous clients</p>

          {/* Filtres */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {["all", "pending", "confirmed", "cancelled"].map((f) => (
              <button
                key={f}
                className={`px-3 py-1 rounded text-white ${
                  filter === f ? "bg-blue-600" : "bg-gray-700"
                }`}
                onClick={() => setFilter(f)}
              >
                {f === "all"
                  ? "Tous"
                  : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}

            {/* Recherche */}
            <input
              type="text"
              placeholder="Rechercher par nom ou email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input ml-2"
              style={{ minWidth: "220px" }}
            />
          </div>
        </header>

        {/* Contenu */}
        {loading ? (
          <p>Chargement des rendez-vous...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredAppointments.length === 0 ? (
          <p>Aucun rendez-vous trouvé.</p>
        ) : (
          <div className="dashboard-cards">
            {filteredAppointments.map((apt) => (
              <div key={apt.id} className="dashboard-card">
                <span className="card-label">{apt.name}</span>

                <p className="text-sm">{apt.email}</p>
                <p className="text-sm">{apt.phone}</p>
                <p className="text-sm">{apt.project_type}</p>

                <p className="text-sm">
                  📅 {apt.date} à {apt.time}
                </p>

                <span
                  className={`inline-block mt-2 text-xs text-white px-2 py-1 rounded ${getStatusColor(
                    apt.status
                  )}`}
                >
                  {getStatusLabel(apt.status)}
                </span>

                <div className="mt-4 flex gap-2">
                  {apt.status !== "confirmed" && (
                    <button
                      disabled={updatingId === apt.id}
                      className="btn btn-edit"
                      onClick={() => updateStatus(apt.id, "confirmed")}
                    >
                      {updatingId === apt.id
                        ? "Traitement..."
                        : "Confirmer"}
                    </button>
                  )}

                  {apt.status !== "cancelled" && (
                    <button
                      disabled={updatingId === apt.id}
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
