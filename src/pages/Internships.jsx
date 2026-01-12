import { useEffect, useState } from "react";
import api from "../api/axios"; 
import "./Dashboard.css";

export default function InternshipsAdmin() {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const res = await api.get("/internships/admin/"); // endpoint Django
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

  // Filtrage par nom/email/phone/école
  useEffect(() => {
    let filtered = [...internships];
    if (search.trim() !== "") {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(lower) ||
          i.email.toLowerCase().includes(lower) ||
          i.phone.toLowerCase().includes(lower) ||
          (i.school && i.school.toLowerCase().includes(lower))
      );
    }
    setFilteredInternships(filtered);
  }, [search, internships]);

  // Supprimer une demande
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette demande ?")) return;
    try {
      await api.delete(`/internships/admin/${id}/`);
      fetchInternships();
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
            placeholder="Rechercher par nom, email, numéro ou école"
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
                <p className="text-sm mb-1">{i.email}</p>
                <p className="text-sm mb-1">{i.phone}</p>
                <p className="text-sm mb-1">{i.school}</p>
                {/* <p className="text-sm mb-1">{i.status}</p>
                <p className="text-sm mb-1">{new Date(i.created_at).toLocaleString()}</p> */}

                {/* CV */}
                {i.cv && (
                  <p>
                    CV:{" "}
                    <a
                      href={i.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      Voir / Télécharger
                    </a>
                  </p>
                )}

                {/* Lettre de motivation */}
                {i.letter && (
                  <p>
                    Lettre de motivation:{" "}
                    <a
                      href={i.letter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      Voir / Télécharger
                    </a>
                  </p>
                )}

                <div className="mt-2 flex gap-2">
                  <button className="btn btn-delete" onClick={() => handleDelete(i.id)}>
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
