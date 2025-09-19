import React, { useState } from "react";
import axios from "axios";

const DirectorSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    // Validation simple
    const newErrors = {};
    if (!formData.name) newErrors.name = "Nom requis";
    if (!formData.email) newErrors.email = "Email requis";
    if (!formData.password) newErrors.password = "Mot de passe requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      // 🔹 Remplace localhost par l'URL publique de ton backend Replit
      const BACKEND_URL = "https://1a3d0990-28d1-45f5-bf0c-9acee884f196-00-2xxj8pu3ho37v.picard.replit.dev";

      const response = await axios.post(
        `${BACKEND_URL}/api/auth/signup`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Stocker le token JWT dans localStorage
      localStorage.setItem("token", response.data.token);

      setSuccessMsg("Directeur inscrit avec succès ✅");

      // Reset form
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Erreur signup:", error);
      const serverMsg =
        error.response?.data?.message ||
        error.message ||
        "Erreur serveur";
      setErrors({ submit: serverMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl mt-10">
      <h1 className="text-2xl font-bold text-center mb-6 text-purple-700">
        Inscription Directeur
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-semibold mb-1">Nom complet</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nom complet"
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemple@ecole.com"
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mot de passe"
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}
        </div>

        {errors.submit && <p className="text-red-500">{errors.submit}</p>}
        {successMsg && <p className="text-green-500">{successMsg}</p>}

        <div className="text-center mt-5">
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-purple-800 hover:scale-105 transition-transform duration-300"
          >
            {loading ? "Envoi..." : "S'inscrire"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DirectorSignup;
