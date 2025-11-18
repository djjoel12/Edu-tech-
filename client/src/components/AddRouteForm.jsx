// src/components/AddRouteForm.jsx
import React, { useState } from 'react';

const AddRouteForm = ({ onClose, onRouteAdded }) => {
  const [formData, setFormData] = useState({
    departureCity: '',
    arrivalCity: '',
    departureStation: '',
    arrivalStation: '',
    price: '',
    routeType: 'standard', // 'standard' ou 'vip'
    departureTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cities = [
    "Abidjan", "Bouaké", "Daloa", "Korhogo", "San-Pédro", "Yamoussoukro",
    "Divo", "Gagnoa", "Abengourou", "Man", "Anyama", "Bingerville"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const savedCompany = localStorage.getItem('company');
      const company = JSON.parse(savedCompany);
      
      // Créer un nom automatique basé sur les villes
      const autoName = `${formData.departureCity} - ${formData.arrivalCity} ${formData.routeType === 'vip' ? 'VIP' : 'Standard'}`;
      
      const routeData = {
        ...formData,
        name: autoName,
        distance: 0, // Valeur par défaut
        duration: 0, // Valeur par défaut
        companyId: company.id,
        features: {
          wifi: formData.routeType === 'vip',
          airConditioning: formData.routeType === 'vip',
          snack: formData.routeType === 'vip',
          toilet: formData.routeType === 'vip'
        }
      };

      const response = await fetch('/api/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création du trajet');
      }

      const newRoute = await response.json();
      onRouteAdded(newRoute.route);
      onClose();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Créer un nouveau trajet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Départ */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Départ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville de départ *
                </label>
                <select
                  name="departureCity"
                  value={formData.departureCity}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Sélectionnez une ville</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gare de départ *
                </label>
                <input
                  type="text"
                  name="departureStation"
                  value={formData.departureStation}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="ex: Gare routière d'Adjamé"
                />
              </div>
            </div>
          </div>

          {/* Arrivée */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Arrivée</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville d'arrivée *
                </label>
                <select
                  name="arrivalCity"
                  value={formData.arrivalCity}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Sélectionnez une ville</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gare d'arrivée *
                </label>
                <input
                  type="text"
                  name="arrivalStation"
                  value={formData.arrivalStation}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="ex: Gare de Bouaké"
                />
              </div>
            </div>
          </div>

          {/* Détails du trajet */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du trajet</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de trajet *
                </label>
                <select
                  name="routeType"
                  value={formData.routeType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="standard">Standard</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de départ *
                </label>
                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (FCFA) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="ex: 5000"
                />
              </div>
            </div>
          </div>

          {/* Informations sur le type */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              {formData.routeType === 'vip' ? '🚗 Trajet VIP' : '🚌 Trajet Standard'}
            </h4>
            <p className="text-sm text-gray-600">
              {formData.routeType === 'vip' 
                ? 'Confort premium avec Wi-Fi, climatisation, snacks et toilettes'
                : 'Service standard confortable'
              }
            </p>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer le trajet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRouteForm;