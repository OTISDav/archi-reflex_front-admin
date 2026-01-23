import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Dashboard.css";

export default function InternshipsAdmin() {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // 📄 Extraire le nom du fichier depuis l’URL renvoyée par le serializer
  const getFileName = (url) => {
    if (!url) return "document.pdf";
    return decodeURIComponent(url.split("/").pop());
  };

  // 🔄 Charger les demandes
  const fetchInternships = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/internships/admin/");
      setInternships(res.data);
      setFilteredInternships(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les demandes de stage.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  // 🔍 Recherche
  useEffect(() => {
    let filtered = [...internships];
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.phone.toLowerCase().includes(q) ||
          (i.school && i.school.toLowerCase().includes(q))
      );
    }
    setFilteredInternships(filtered);
  }, [search, internships]);

  // 🗑️ Supprimer
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette demande ?")) return;
    try {
      await api.delete(`/internships/admin/${id}/`);
      setInternships((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <section className="dashboard">
      <div className="dashboard-inner">
        <header className="dashboard-header">
          <h1>Demandes de stage</h1>
          <p>Gestion complète des demandes de stage</p>

          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone ou école"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input mt-2"
            style={{ minWidth: "300px" }}
          />
        </header>

        {loading ? (
          <p>Chargement des demandes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredInternships.length === 0 ? (
          <p>Aucune demande disponible.</p>
        ) : (
          <div className="dashboard-cards">
            {filteredInternships.map((i) => (
              <div key={i.id} className="dashboard-card">
                <span className="card-label">{i.name}</span>
                <p className="text-sm"><strong>Email :</strong> {i.email}</p>
                <p className="text-sm"><strong>Téléphone :</strong> {i.phone}</p>
                <p className="text-sm"><strong>École :</strong> {i.school || "-"}</p>

                {/* 📎 CV */}
                {i.cv && (
                  <p className="text-sm mt-2">
                    <strong>CV :</strong>{" "}
                    <a
                      href={i.cv}
                      download={getFileName(i.cv)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      Voir
                    </a>
                  </p>
                )}

                {/* 📎 Lettre */}
                {i.letter && (
                  <p className="text-sm">
                    <strong>Lettre :</strong>{" "}
                    <a
                      href={i.letter}
                      download={getFileName(i.letter)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      Voir
                    </a>
                  </p>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(i.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
