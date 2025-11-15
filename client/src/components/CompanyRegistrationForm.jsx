// src/components/CompanyRegistrationForm.jsx
import React, { useState } from "react";
import axios from "axios";

const CompanyRegistrationForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "Transport",
    address: "",
    city: "",
    country: "Côte d'Ivoire",
    phone: "",
    email: "",
    ceoName: "",
    yearFounded: "",
    transportLicense: "",
    logo: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setFormData({ ...formData, logo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
      if (name === "email" && errors.email) {
        setErrors({ ...errors, email: "" });
      }
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = "Nom requis";
    if (!formData.email) newErrors.email = "Email requis";
    if (!formData.phone) newErrors.phone = "Téléphone requis";
    if (!formData.ceoName) newErrors.ceoName = "Nom du responsable requis";

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email invalide";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      // Prepare FormData (multipart)
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        dataToSend.append(key, formData[key]);
      });

      const response = await axios.post("/api/companies/register", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg("Compagnie enregistrée avec succès 🎉");

      setFormData({
        companyName: "",
        companyType: "Transport",
        address: "",
        city: "",
        country: "Côte d'Ivoire",
        phone: "",
        email: "",
        ceoName: "",
        yearFounded: "",
        transportLicense: "",
        logo: null,
      });

    } catch (error) {
      if (error.response) {
        const msg = error.response.data?.message || "Erreur lors de l'inscription";
        if (msg.includes("déjà")) {
          setErrors({ email: "Cet email ou numéro existe déjà", submit: msg });
        } else setErrors({ submit: msg });
      } else {
        setErrors({ submit: "Impossible de contacter le serveur" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        Enregistrer une Compagnie de Transport
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Company Name + Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">Nom *</label>
            <input type="text" name="companyName" value={formData.companyName}
              onChange={handleChange} className="input" placeholder="Ex: UTB, STIF, Air Ivoire" />
            {errors.companyName && <p className="text-red-500">{errors.companyName}</p>}
          </div>

          <div>
            <label className="font-semibold">Type</label>
            <input type="text" name="companyType" value={formData.companyType}
              onChange={handleChange} className="input" />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="font-semibold">Adresse</label>
          <input type="text" name="address" value={formData.address}
            onChange={handleChange} className="input" />
        </div>

        {/* City + Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">Ville</label>
            <input type="text" name="city" value={formData.city}
              onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="font-semibold">Pays</label>
            <input type="text" name="country" value={formData.country}
              onChange={handleChange} className="input" />
          </div>
        </div>

        {/* Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">Téléphone *</label>
            <input type="tel" name="phone" value={formData.phone}
              onChange={handleChange} className="input" placeholder="+225 01 23 45 67 89" />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          </div>
          <div>
            <label className="font-semibold">Email *</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} className="input" placeholder="contact@entreprise.com" />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
        </div>

        {/* CEO + License */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">Responsable / DG *</label>
            <input type="text" name="ceoName" value={formData.ceoName}
              onChange={handleChange} className="input" />
            {errors.ceoName && <p className="text-red-500">{errors.ceoName}</p>}
          </div>
          <div>
            <label className="font-semibold">Numéro de licence</label>
            <input type="text" name="transportLicense" value={formData.transportLicense}
              onChange={handleChange} className="input" />
          </div>
        </div>

        {/* Year + Logo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">Année de création</label>
            <input type="number" name="yearFounded" value={formData.yearFounded}
              onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="font-semibold">Logo</label>
            <input type="file" name="logo" accept="image/*"
              onChange={handleChange} className="input" />
          </div>
        </div>

        {/* Error & Success messages */}
        {errors.submit && <p className="text-red-500 text-center">{errors.submit}</p>}
        {successMsg && <p className="text-green-600 text-center">{successMsg}</p>}

        {/* Submit button */}
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-bold">
          {loading ? "Enregistrement..." : "Enregistrer la compagnie"}
        </button>
      </form>
    </div>
  );
};

export default CompanyRegistrationForm;
