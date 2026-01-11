import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

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

      localStorage.setItem("admin_token", res.data.token);
      toast.success("Connexion réussie");
      window.location.href = "/admin";
    } catch {
      toast.error("Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 w-full max-w-md shadow"
      >
        <h1 className="text-2xl mb-8">Admin Login</h1>

        <input
          name="username"
          placeholder="Nom d’utilisateur"
          className="w-full mb-4 border p-3"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          className="w-full mb-6 border p-3"
          required
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
