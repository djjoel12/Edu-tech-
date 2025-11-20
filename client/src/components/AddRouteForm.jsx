// src/components/AddRouteForm.jsx
import React, { useState } from 'react';

const AddRouteForm = ({ onClose, onRouteAdded }) => {
  const [formData, setFormData] = useState({
    departureCity: '',
    arrivalCity: '',
    departureStation: '',
    arrivalStation: '',
    price: '',
    routeType: 'standard',
    departureTime: '',
    // Nouveaux champs pour EnhancedRoute
    estimatedDuration: '',
    amenities: [],
    contactPhone: '',
    canBookOnline: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cities = [
    "Abidjan", "Bouaké", "Daloa", "Korhogo", "San-Pédro", "Yamoussoukro",
    "Divo", "Gagnoa", "Abengourou", "Man", "Anyama", "Bingerville"
  ];

  // Options pour les équipements
  const amenityOptions = [
    { value: 'wifi', label: 'Wi-Fi' },
    { value: 'ac', label: 'Climatisation' },
    { value: 'snack', label: 'Snacks' },
    { value: 'toilet', label: 'Toilettes' },
    { value: 'charging', label: 'Prises de charge' },
    { value: 'entertainment', label: 'Divertissement' },
    { value: 'blanket', label: 'Couvertures' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => {
      const currentAmenities = prev.amenities || [];
      const newAmenities = currentAmenities.includes(amenity)
        ? currentAmenities.filter(a => a !== amenity)
        : [...currentAmenities, amenity];
      
      return {
        ...prev,
        amenities: newAmenities
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const savedCompany = localStorage.getItem('company');
      const company = JSON.parse(savedCompany);
      
      if (!company) {
        throw new Error('Compagnie non trouvée. Veuillez vous reconnecter.');
      }
      
      // Créer un nom automatique basé sur les villes
      const autoName = `${formData.departureCity} - ${formData.arrivalCity} ${formData.routeType === 'vip' ? 'VIP' : 'Standard'}`;
      
      // 1. CRÉER LA ROUTE STANDARD
      const routeData = {
        ...formData,
        name: autoName,
        distance: 0,
        duration: 0,
        companyId: company.id,
        features: {
          wifi: formData.amenities.includes('wifi'),
          airConditioning: formData.amenities.includes('ac'),
          snack: formData.amenities.includes('snack'),
          toilet: formData.amenities.includes('toilet')
        }
      };

      console.log('📨 Création route standard:', routeData);

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
      console.log('✅ Route standard créée:', newRoute);

      // 2. CRÉER LA ENHANCED ROUTE (pour les pages SEO)
      try {
        const enhancedRouteData = {
          routeKey: `${formData.departureCity.toLowerCase()}-${formData.arrivalCity.toLowerCase()}`,
          departureCity: formData.departureCity,
          arrivalCity: formData.arrivalCity,
          companyId: company.id,
          companyName: company.companyName,
          departureStations: [
            {
              name: formData.departureStation,
              departureTimes: [formData.departureTime]
            }
          ],
          priceRange: {
            min: parseInt(formData.price),
            max: parseInt(formData.price) + (formData.routeType === 'vip' ? 2000 : 1000)
          },
          estimatedDuration: formData.estimatedDuration || '5-6 heures',
          busType: formData.routeType === 'vip' ? 'vip' : 'comfort',
          amenities: formData.amenities,
          contactPhone: formData.contactPhone || company.phone,
          canBookOnline: formData.canBookOnline,
          rating: 4.0 + (Math.random() * 1.0), // Note entre 4.0 et 5.0
          reviewCount: Math.floor(Math.random() * 50) + 10,
          status: 'active'
        };

        console.log('📨 Création enhanced route:', enhancedRouteData);

        const enhancedResponse = await fetch('/api/enhanced-routes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(enhancedRouteData),
        });

        if (enhancedResponse.ok) {
          const enhancedRoute = await enhancedResponse.json();
          console.log('✅ Enhanced route créée:', enhancedRoute);
        } else {
          console.warn('⚠️ Enhanced route non créée, mais route standard OK');
        }
      } catch (enhancedError) {
        console.warn('⚠️ Erreur création enhanced route (non critique):', enhancedError);
        // On continue même si enhanced route échoue
      }

      // Notifier le parent
      onRouteAdded(newRoute.route);
      onClose();
      
    } catch (err) {
      console.error('❌ Erreur création route:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Déterminer le type de bus basé sur le type de route
  const getBusType = () => {
    if (formData.routeType === 'vip') return 'vip';
    if (formData.amenities?.length >= 3) return 'comfort';
    return 'economy';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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

          {/* NOUVEAU : Informations Enhanced Route */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations complémentaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée estimée
                </label>
                <input
                  type="text"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="ex: 5-6 heures"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone de contact
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="ex: +225 07 12 34 56 78"
                />
              </div>
            </div>
          </div>

          {/* Équipements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Équipements disponibles
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {amenityOptions.map(amenity => (
                <label key={amenity.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.amenities?.includes(amenity.value)}
                    onChange={() => handleAmenityChange(amenity.value)}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Réservation en ligne */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="canBookOnline"
                checked={formData.canBookOnline}
                onChange={(e) => setFormData(prev => ({...prev, canBookOnline: e.target.checked}))}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Réservation en ligne disponible
              </span>
            </label>
          </div>

          {/* Aperçu du type de bus */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              {getBusType() === 'vip' ? '🚗 Trajet VIP' : 
               getBusType() === 'comfort' ? '🚌 Trajet Confort' : '🚐 Trajet Économique'}
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              {getBusType() === 'vip' 
                ? 'Service premium avec tous les équipements'
                : getBusType() === 'comfort'
                ? 'Service confortable avec équipements sélectionnés'
                : 'Service économique de base'
              }
            </p>
            {formData.amenities?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.amenities.map(amenity => (
                  <span key={amenity} className="bg-white px-2 py-1 rounded text-xs text-gray-600 border">
                    {amenity}
                  </span>
                ))}
              </div>
            )}
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