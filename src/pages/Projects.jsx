import { useEffect, useState } from "react";
import api from "../api/axios"; // axios avec Bearer JWT
import "./Dashboard.css";

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    project_type: "",
    year: "",
    image: null,
  });
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    setLoading(true);
    api
      .get("/projects/projects/admin/") // on laisse l’URL comme tu veux
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(
          "Impossible de charger les projets. Vérifie que tu es connecté en admin."
        );
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("project_type", form.project_type);
      formData.append("year", form.year);
      if (form.image) formData.append("image", form.image);

      if (form.id) {
        await api.put(`/projects/projects/admin/${form.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/projects/projects/admin/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setForm({
        id: null,
        title: "",
        description: "",
        project_type: "",
        year: "",
        image: null,
      });
      setFormVisible(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement du projet.");
    }
  };

  const handleEdit = (project) => {
    setForm({
      id: project.id,
      title: project.title,
      description: project.description,
      project_type: project.project_type,
      year: project.year,
      image: null,
    });
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
    try {
      await api.delete(`/projects/projects/admin/${id}/`);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression du projet.");
    }
  };

  return (
    <section className="dashboard">
      <div className="dashboard-inner">
        <header className="dashboard-header">
          <h1>Projets Admin</h1>
          <p>Gestion complète des projets</p>
          <button className="btn" onClick={() => setFormVisible(!formVisible)}>
            {formVisible ? "Annuler" : "Ajouter un projet"}
          </button>
        </header>

        {/* Formulaire */}
        {formVisible && (
          <form
            className="mb-6 p-4 border rounded bg-white shadow"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="title"
              placeholder="Titre"
              value={form.title}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="text"
              name="project_type"
              placeholder="Type"
              value={form.project_type}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="number"
              name="year"
              placeholder="Année"
              value={form.year}
              onChange={handleChange}
              className="input"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="input"
              required
            />
            <input type="file" name="image" onChange={handleChange} className="input" />
            <button type="submit" className="btn mt-2">
              {form.id ? "Modifier" : "Ajouter"}
            </button>
          </form>
        )}

        {/* Liste des projets */}
        {loading ? (
          <p>Chargement des projets...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : projects.length === 0 ? (
          <p>Aucun projet disponible.</p>
        ) : (
          <div className="dashboard-cards">
            {projects.map((project) => (
              <div key={project.id} className="dashboard-card">
                <span className="card-label">{project.title}</span>
                <strong className="card-value">{project.year}</strong>
                <p>{project.project_type}</p>
                <p className="mt-2">{project.description}</p>
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{ width: "100%", marginTop: "8px", borderRadius: "4px" }}
                  />
                )}
                <div className="mt-2 flex gap-2">
                  <button className="btn btn-edit" onClick={() => handleEdit(project)}>
                    Modifier
                  </button>
                  <button className="btn btn-delete" onClick={() => handleDelete(project.id)}>
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
