// src/components/SchoolRegistrationForm.jsx
import React, { useState } from "react";
import axios from "axios";

const SchoolRegistrationForm = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolType: "",
    address: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
    director: "",
    creationYear: "",
    accreditationNumber: "",
    logo: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setFormData({ ...formData, logo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Soumission formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    // Validation simple
    const newErrors = {};
    if (!formData.schoolName) newErrors.schoolName = "Nom requis";
    if (!formData.email) newErrors.email = "Email requis";
    if (!formData.phone) newErrors.phone = "Téléphone requis";
    if (!formData.director) newErrors.director = "Directeur requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Préparer FormData
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        submitData.append(key, formData[key]);
      }
    });

    try {
      setLoading(true);

      const response = await axios.post(
        "/api/register",
        submitData
      );

      console.log("Réponse backend :", response.data);
      setSuccessMsg("École inscrite avec succès ✅");

      // Réinitialiser le formulaire
      setFormData({
        schoolName: "",
        schoolType: "",
        address: "",
        postalCode: "",
        city: "",
        phone: "",
        email: "",
        director: "",
        creationYear: "",
        accreditationNumber: "",
        logo: null,
      });
    } catch (error) {
      console.error("Erreur backend :", error.response ?? error);
      const serverMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Une erreur est survenue, réessayez.";
      setErrors({ submit: serverMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">
        Inscription de l'école
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom et Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Nom de l'école</label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              placeholder="Nom complet de l'école"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.schoolName && (
              <p className="text-red-500 mt-1">{errors.schoolName}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold mb-1">Type d'école</label>
            <input
              type="text"
              name="schoolType"
              value={formData.schoolType}
              onChange={handleChange}
              placeholder="Ex: Primaire, Secondaire, Université"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Adresse, Code postal, Ville */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-semibold mb-1">Adresse</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Adresse complète"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Code postal</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Ex: 00123"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Ville</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ville"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Téléphone, Email, Directeur */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-semibold mb-1">Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ex: +225 01 23 45 67"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.phone && <p className="text-red-500 mt-1">{errors.phone}</p>}
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
            <label className="block font-semibold mb-1">Directeur</label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              placeholder="Nom du directeur"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.director && (
              <p className="text-red-500 mt-1">{errors.director}</p>
            )}
          </div>
        </div>

        {/* Année, Numéro, Logo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-semibold mb-1">Année de création</label>
            <input
              type="number"
              name="creationYear"
              value={formData.creationYear}
              onChange={handleChange}
              placeholder="Ex: 2005"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Numéro d'accréditation
            </label>
            <input
              type="text"
              name="accreditationNumber"
              value={formData.accreditationNumber}
              onChange={handleChange}
              placeholder="Numéro officiel"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Logo</label>
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Messages */}
        {errors.submit && <p className="text-red-500">{errors.submit}</p>}
        {successMsg && <p className="text-green-500">{successMsg}</p>}

        {/* Bouton */}
        <div className="text-center mt-6">
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

export default SchoolRegistrationForm;
