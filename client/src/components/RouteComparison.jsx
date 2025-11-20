// src/components/RouteComparison.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RouteComparison = () => {
  const { departure, arrival } = useParams();
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // État pour le carrousel d'images
  const [currentBackground, setCurrentBackground] = useState(0);

  const [filters, setFilters] = useState({
    busType: 'all',
    priceRange: 'all',
    sortBy: 'price'
  });

  // ---------------------------------------------------------
  // IMAGES DU CARROUSEL (Fond Plein Écran) - 7 IMAGES
  // ---------------------------------------------------------
  const backgroundImages = [
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1594717523093-61d5b571702c?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3"
  ];

  // Effet pour faire défiler les images (5 secondes)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------------------
  // LOGIQUE ET DONNÉES (STRICTEMENT INCHANGÉES)
  // ---------------------------------------------------------

  const transformRouteData = (routesData) => {
    return routesData.map(route => {
      if (route.priceRange && route.departureStations) {
        return {
          _id: route._id,
          companyName: route.companyName || route.companyId?.companyName || "Compagnie",
          companyLogo: "🚌",
          priceRange: route.priceRange || { min: 0, max: 0 },
          busType: route.busType || 'comfort',
          departureStations: route.departureStations || [],
          estimatedDuration: route.estimatedDuration || '5-6 heures',
          amenities: route.amenities || [],
          contactPhone: route.contactPhone || route.companyId?.phone || '+225 XX XX XX XX',
          canBookOnline: route.canBookOnline !== undefined ? route.canBookOnline : true,
          rating: route.rating || 4.0,
          reviewCount: route.reviewCount || 0
        };
      }
      return {
        _id: route._id,
        companyName: route.companyId?.companyName || route.companyName || "Compagnie",
        companyLogo: "🚌",
        priceRange: { min: route.price || 6000, max: (route.price || 6000) + 1000 },
        busType: route.routeType === 'vip' ? 'vip' : 'comfort',
        departureStations: [{ name: route.departureStation || 'Gare principale', departureTimes: [route.departureTime || '08:00'] }],
        estimatedDuration: '5-6 heures',
        amenities: convertFeaturesToAmenities(route.features),
        contactPhone: route.companyId?.phone || '+225 XX XX XX XX',
        canBookOnline: true,
        rating: 4.0 + (Math.random() * 1.0),
        reviewCount: Math.floor(Math.random() * 50) + 10
      };
    });
  };

  const convertFeaturesToAmenities = (features) => {
    const amenities = [];
    if (!features) return amenities;
    if (features.wifi) amenities.push('wifi');
    if (features.airConditioning) amenities.push('ac');
    if (features.snack) amenities.push('snack');
    if (features.toilet) amenities.push('toilet');
    if (features.charging) amenities.push('charging');
    return amenities;
  };

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoading(true);
        setError('');
        let response = await fetch(`/api/enhanced-routes/comparison/${departure}/${arrival}`);
        let routesData = [];
        if (response.ok) routesData = await response.json();
        if (routesData.length === 0) {
          response = await fetch(`/api/routes/search/${departure}/${arrival}`);
          if (response.ok) routesData = await response.json();
        }
        setRoutes(transformRouteData(routesData));
      } catch (err) {
        setError('Données temporairement indisponibles - Affichage en mode démonstration');
        setRoutes(getDemoRoutes());
      } finally {
        setLoading(false);
      }
    };
    loadRoutes();
  }, [departure, arrival]);

  const getDemoRoutes = () => {
    return [{
      _id: 1,
      companyName: "STL Transport",
      companyLogo: "🚌",
      priceRange: { min: 6500, max: 7500 },
      busType: "vip",
      departureStations: [{ name: "Gare de Yopougon", departureTimes: ["06:30", "08:00", "10:00", "14:00"] }],
      estimatedDuration: "5-6 heures",
      amenities: ["wifi", "ac", "snack", "toilet", "charging"],
      contactPhone: "+225 07 12 34 56 78",
      canBookOnline: true,
      rating: 4.5,
      reviewCount: 124
    }];
  };

  const filteredRoutes = routes.filter(route => {
    if (filters.busType !== 'all' && route.busType !== filters.busType) return false;
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (route.priceRange?.min < min || route.priceRange?.max > max) return false;
    }
    return true;
  }).sort((a, b) => {
    switch(filters.sortBy) {
      case 'price': return (a.priceRange?.min || 0) - (b.priceRange?.min || 0);
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'departure': 
        const timeA = a.departureStations?.[0]?.departureTimes?.[0] || '00:00';
        const timeB = b.departureStations?.[0]?.departureTimes?.[0] || '00:00';
        return timeA.localeCompare(timeB);
      default: return 0;
    }
  });

  const getBusTypeLabel = (type) => {
    const labels = { economy: "Économique", comfort: "Confort", vip: "VIP", premium: "Premium" };
    return labels[type] || type;
  };

  const getAmenityIcon = (amenity) => {
    const icons = { wifi: "📶", ac: "❄️", snack: "🍫", toilet: "🚻", charging: "🔌", entertainment: "📺", blanket: "🛏️" };
    return icons[amenity] || "✅";
  };

  const handleViewDetails = () => navigate(`/trajet/${departure}/${arrival}`);

  const handleDirectCall = (route) => {
    const leads = JSON.parse(localStorage.getItem('leads') || '[]');
    const newLead = {
      name: 'Lead Direct - Appel',
      phone: route.contactPhone,
      email: '',
      departure,
      arrival,
      company: route.companyName,
      timestamp: new Date().toISOString(),
      status: 'direct_call',
      routeId: route._id
    };
    leads.push(newLead);
    localStorage.setItem('leads', JSON.stringify(leads));
    alert(`📞 Appelez directement: ${route.contactPhone}\n\nLead enregistré pour suivi.`);
  };

  // ---------------------------------------------------------
  // RENDER - AVEC FOND COMME LES AUTRES PAGES
  // ---------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p className="text-sky-600 font-medium animate-pulse">Chargement des meilleurs trajets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden">
      
      {/* Bandeau tricolore - Toujours visible */}
      <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-green-600 fixed top-0 z-[100] shadow-lg"></div>

      {/* Navigation Responsive */}
      <nav className="fixed top-2 w-full z-[99] bg-black/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg mr-2">
                🚌
              </div>
              <span className="text-lg font-bold text-white tracking-tight hidden xs:block">
                Transport<span className="text-orange-400">Ticket</span>
              </span>
            </div>
            
            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center space-x-6">
              <a href="#" className="text-sm font-bold text-white hover:text-orange-400 transition-colors">Accueil</a>
              <a href="#" className="text-sm font-bold text-white hover:text-orange-400 transition-colors">Compagnies</a>
              <a href="#" className="text-sm font-bold text-white hover:text-orange-400 transition-colors">Destinations</a>
            </div>

            {/* Boutons Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              <button onClick={() => navigate('/login-company')} className="text-sm font-bold text-white hover:text-orange-400 transition-colors px-3 py-2">
                Connexion
              </button>
              <button onClick={() => navigate('/register-company')} className="bg-white text-slate-900 hover:bg-green-500 hover:text-white text-sm font-bold px-4 py-2 rounded-full transition-all shadow-lg">
                Partenaires
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section avec fond changeant - COMME DANS LES AUTRES PAGES */}
      <div className="relative h-[500px] xs:h-[550px] sm:h-[600px] md:h-[650px] lg:h-[700px] flex items-center justify-center overflow-hidden pt-16">
        
        {/* Carrousel d'images de fond - EXACTEMENT COMME LES AUTRES PAGES */}
        <div className="fixed inset-0 z-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentBackground ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          ))}
          {/* Overlay pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Indicateurs de slides */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBackground(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentBackground ? 'bg-orange-500 scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-3 text-center mt-8">
          <div className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-orange-300 text-sm font-bold uppercase tracking-widest mb-6 shadow-lg">
            🇨🇮 COMPARAISON DE TRAJETS
          </div>
          
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-tight drop-shadow-2xl px-2">
            {departure} <span className="text-orange-400">→</span> {arrival}
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl text-gray-200 font-bold max-w-3xl mx-auto drop-shadow-lg mb-6 px-4">
            Comparez les meilleures options pour votre voyage
          </p>
          
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 max-w-2xl mx-auto m-4">
            <p className="text-white font-bold text-sm sm:text-base">
              🚨 <span className="text-orange-300">ATTENTION :</span> Service de conciergerie indépendant
            </p>
            <p className="text-white/90 text-xs sm:text-sm mt-1">
              Nous ne sommes PAS une compagnie de transport
            </p>
          </div>
        </div>
      </div>

      {/* Section de comparaison */}
      <div className="relative -mt-20 xs:-mt-24 sm:-mt-28 md:-mt-32 lg:-mt-36 z-20 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-4 lg:p-6 border-2 border-orange-200">
          <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
            
            {/* Filtres */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Titre Section */}
                <div className="md:col-span-1">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Filtrer les résultats</h2>
                  <p className="text-slate-600 text-sm">
                    Affinez votre recherche pour trouver le trajet idéal
                  </p>
                </div>

                {/* Selecteur Type */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-sky-600 z-10">Classe</label>
                  <select 
                    value={filters.busType}
                    onChange={(e) => setFilters(prev => ({...prev, busType: e.target.value}))}
                    className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all cursor-pointer hover:bg-sky-50/50"
                  >
                    <option value="all">Tous les types</option>
                    <option value="economy">Économique</option>
                    <option value="comfort">Confort</option>
                    <option value="vip">VIP</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                {/* Selecteur Prix */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-sky-600 z-10">Budget</label>
                  <select 
                    value={filters.priceRange}
                    onChange={(e) => setFilters(prev => ({...prev, priceRange: e.target.value}))}
                    className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all cursor-pointer hover:bg-sky-50/50"
                  >
                    <option value="all">Tous les prix</option>
                    <option value="5000-7000">5 000 - 7 000 FCFA</option>
                    <option value="7000-9000">7 000 - 9 000 FCFA</option>
                    <option value="9000-12000">9 000 - 12 000 FCFA</option>
                  </select>
                </div>

                {/* Selecteur Tri */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-sky-600 z-10">Trier par</label>
                  <select 
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({...prev, sortBy: e.target.value}))}
                    className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all cursor-pointer hover:bg-sky-50/50"
                  >
                    <option value="price">Prix (croissant)</option>
                    <option value="rating">Meilleures notes</option>
                    <option value="departure">Départ tôt</option>
                  </select>
                </div>
              </div>
            </div>

            {/* LISTE DES RÉSULTATS */}
            <div className="space-y-6">
              {filteredRoutes.map((route) => (
                <div 
                  key={route._id} 
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    
                    {/* GAUCHE : Informations */}
                    <div className="flex-1 p-6 lg:p-8">
                      <div className="flex items-start gap-6">
                        {/* Logo */}
                        <div className="hidden sm:flex h-20 w-20 rounded-2xl bg-sky-50 text-sky-600 items-center justify-center text-3xl border-2 border-sky-100 shadow-sm group-hover:scale-105 transition-transform">
                          {route.companyLogo}
                        </div>
                        
                        <div className="flex-1">
                          {/* En-tête Carte */}
                          <div className="flex flex-wrap justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="sm:hidden text-2xl">{route.companyLogo}</span>
                                <h3 className="text-2xl font-bold text-slate-800">{route.companyName}</h3>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex text-yellow-400 text-sm">
                                  {"★".repeat(Math.floor(route.rating))}
                                  <span className="text-slate-200">{"★".repeat(5 - Math.floor(route.rating))}</span>
                                </div>
                                <span className="text-sm font-medium text-slate-600">{route.rating}</span>
                                <span className="text-xs text-slate-400">• {route.reviewCount} avis</span>
                              </div>
                            </div>
                            
                            {/* Badge Type */}
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                              route.busType === 'vip' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                              'bg-sky-50 border-sky-200 text-sky-700'
                            }`}>
                              {getBusTypeLabel(route.busType)}
                            </span>
                          </div>

                          {/* Grille Horaires */}
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
                            {(route.departureStations || []).map((station, index) => (
                              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                                  <span className="font-semibold text-slate-700 text-sm">{station.name}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {(station.departureTimes || []).map((time, tIndex) => (
                                    <span key={tIndex} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm">
                                      {time}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-500">
                              <span>⏱️ Durée: {route.estimatedDuration}</span>
                            </div>
                          </div>

                          {/* Équipements */}
                          <div className="flex flex-wrap gap-3">
                            {(route.amenities || []).map((amenity, index) => (
                              <span key={index} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white border border-slate-100 px-2 py-1 rounded-md">
                                {getAmenityIcon(amenity)} {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DROITE : Prix & Action */}
                    <div className="lg:w-80 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-100 p-6 lg:p-8 flex flex-col justify-center items-center text-center relative">
                      
                      <div className="mb-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Prix par personne</p>
                        <div className="flex items-baseline justify-center gap-1 text-sky-600">
                          <span className="text-3xl font-extrabold tracking-tight">
                            {(route.priceRange?.min || 0).toLocaleString()}
                          </span>
                          <span className="text-sm font-bold text-slate-500">FCFA</span>
                        </div>
                        {(route.priceRange?.max > route.priceRange?.min) && (
                          <p className="text-xs text-slate-400 mt-1">Max: {(route.priceRange?.max).toLocaleString()} FCFA</p>
                        )}
                      </div>

                      <div className="w-full space-y-3">
                        {route.canBookOnline ? (
                          <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-yellow-200 transition-all transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2">
                            <span>🎟️</span> Réserver en ligne
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleDirectCall(route)}
                            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-sky-200 transition-all transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2"
                          >
                            <span>📞</span> {route.contactPhone}
                          </button>
                        )}
                        
                        <button 
                          onClick={handleViewDetails}
                          className="w-full bg-white border-2 border-slate-200 hover:border-sky-400 text-slate-600 hover:text-sky-600 font-bold py-3 px-6 rounded-xl transition-colors text-sm"
                        >
                          Voir détails complets
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}

              {filteredRoutes.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                  <div className="text-6xl mb-6 opacity-50">🚌</div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Aucun résultat trouvé</h3>
                  <p className="text-slate-500 mb-6">Essayez de modifier vos filtres pour voir plus de compagnies.</p>
                  <button 
                    onClick={() => setFilters({ busType: 'all', priceRange: 'all', sortBy: 'price' })}
                    className="text-sky-600 font-bold hover:underline"
                  >
                    Réinitialiser tous les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Responsive */}
      <footer className="bg-slate-100 border-t-4 border-orange-500 py-8 sm:py-12 lg:py-16 mt-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center">
            <p className="font-black text-slate-900 text-lg sm:text-xl lg:text-2xl mb-3 lg:mb-4">TransportTicket.ci</p>
            <div className="flex justify-center gap-2 lg:gap-3 mb-4 lg:mb-6">
              <div className="h-1.5 w-8 lg:w-12 bg-orange-500 rounded-full"></div>
              <div className="h-1.5 w-8 lg:w-12 bg-gray-400 rounded-full"></div>
              <div className="h-1.5 w-8 lg:w-12 bg-green-600 rounded-full"></div>
            </div>
            
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-6 lg:mt-8 font-bold">
              © 2025 TransportTicket.ci - Service de conciergerie indépendant
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RouteComparison;