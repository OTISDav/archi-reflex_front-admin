import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import "./Login.css";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login/", {
        username: e.target.username.value,
        password: e.target.password.value,
      });

      // ⚡ Stockage du JWT correct
      localStorage.setItem("admin_token", res.data.access);
      localStorage.setItem("admin_refresh_token", res.data.refresh);

      toast.success("Connexion réussie");
      window.location.href = "/admin"; // redirection vers dashboard
    } catch {
      toast.error("Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="login-card">
        <h1 className="login-title">ADMIN</h1>
        <p className="login-subtitle">Accès sécurisé</p>

        <input
          name="username"
          placeholder="Nom d’utilisateur"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          required
        />

        <button disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
