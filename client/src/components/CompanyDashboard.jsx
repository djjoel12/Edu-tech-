// src/components/CompanyDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    // Vérifier si la compagnie est connectée
    const savedCompany = localStorage.getItem('company');
    if (savedCompany) {
      setCompany(JSON.parse(savedCompany));
    } else {
      // Rediriger vers la connexion si pas connecté
      navigate('/login-company');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('company');
    navigate('/login-company');
  };

  // Loading state
  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Simple */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {company.companyName.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{company.companyName}</h1>
                <p className="text-sm text-gray-500">Tableau de bord</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Contenu Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message de Bienvenue */}
        <div className="bg-gradient-to-r from-orange-500 to-green-500 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenue, {company.companyName} ! 🎉
          </h1>
          <p className="text-orange-100 text-lg">
            Votre espace professionnel est maintenant actif
          </p>
        </div>

        {/* Premières Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Prochaines étapes</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <span className="font-medium">Ajouter vos véhicules</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <span className="font-medium text-gray-500">Créer vos lignes</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <span className="font-medium text-gray-500">Définir les horaires</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🚌</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Ajouter un véhicule</h3>
                    <p className="text-sm text-gray-600">Enregistrez votre premier bus</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🗺️</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Créer une ligne</h3>
                    <p className="text-sm text-gray-600">Définissez vos trajets</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Section Informations */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Vos informations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nom de la compagnie</p>
              <p className="font-medium">{company.companyName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{company.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Téléphone</p>
              <p className="font-medium">{company.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ville</p>
              <p className="font-medium">{company.city}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;