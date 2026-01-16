import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Dashboard.css";
import "./ProjectForm.css";

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formVisible, setFormVisible] = useState(false);
  const [fileName, setFileName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    project_type: "",
    year: "",
    image: null,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects/projects/admin/");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les projets.");
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Année via calendrier (month -> year)
    if (name === "year") {
      setForm((prev) => ({
        ...prev,
        year: value.split("-")[0],
      }));
      return;
    }

    // Image
    if (name === "image" && files?.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setFileName(file.name);
      setImagePreview(URL.createObjectURL(file));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setFileName("");
    setImagePreview(null);
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      description: "",
      project_type: "",
      year: "",
      image: null,
    });
    setFileName("");
    setImagePreview(null);
    setFormVisible(false);
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
        await api.put(`/projects/projects/admin/${form.id}/`, formData);
      } else {
        await api.post("/projects/projects/admin/", formData);
      }

      resetForm();
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
    setFileName("Image actuelle conservée");
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
    try {
      await api.delete(`/projects/projects/admin/${id}/`);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <section className="dashboard">
      <div className="dashboard-inner">
        <header className="dashboard-header">
          <h1>Projets Admin</h1>
          <button className="btn" onClick={() => setFormVisible(!formVisible)}>
            {formVisible ? "Annuler" : "Ajouter un projet"}
          </button>
        </header>

        {/* ================= FORMULAIRE ================= */}
        {formVisible && (
          <form className="project-form" onSubmit={handleSubmit}>
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

            {/* Champ année avec icône */}
            <div className="year-field">
              <span className="year-icon">📅</span>
              <input
                type="month"
                name="year"
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="input"
              required
            />

            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="input"
            />

            {fileName && <p className="file-name">📎 {fileName}</p>}

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button type="button" onClick={removeImage}>
                  Retirer l’image
                </button>
              </div>
            )}

            <button type="submit" className="btn">
              {form.id ? "Modifier" : "Ajouter"}
            </button>
          </form>
        )}

        {/* ================= LISTE ================= */}
        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : projects.length === 0 ? (
          <p>Aucun projet disponible.</p>
        ) : (
          <div className="dashboard-cards">
            {projects.map((project) => (
              <div key={project.id} className="dashboard-card">
                <strong>{project.title}</strong>
                <p>{project.project_type} • {project.year}</p>
                <p>{project.description}</p>

                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{ width: "100%", marginTop: 8, borderRadius: 6 }}
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
