import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchData, setSearchData] = useState({
    departureCity: '',
    arrivalCity: ''
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cities = [
    "Abidjan", "Bouaké", "Daloa", "Korhogo", "San-Pédro", "Yamoussoukro",
    "Divo", "Gagnoa", "Abengourou", "Man", "Anyama", "Bingerville"
  ];

  // Données de démonstration
  const mockRoutes = [
    { 
      _id: 1, 
      name: "Express Classique", 
      departureCity: "Abidjan", 
      arrivalCity: "Bouaké", 
      departureStation: "Gare Adjamé", 
      arrivalStation: "Gare Commerce", 
      departureTime: "07:30", 
      arrivalTime: "12:30",
      duration: "5h00",
      price: 6500, 
      routeType: "standard", 
      status: "active",
      seats: 12,
      companyId: { 
        companyName: "UTB Transport"
      }
    },
    { 
      _id: 2, 
      name: "Prestige VIP", 
      departureCity: "Abidjan", 
      arrivalCity: "Yamoussoukro", 
      departureStation: "Gare Nord", 
      arrivalStation: "Gare Principale", 
      departureTime: "09:00", 
      arrivalTime: "12:00",
      duration: "3h00",
      price: 12000, 
      routeType: "vip", 
      status: "active",
      seats: 4,
      companyId: { 
        companyName: "STC Voyages"
      }
    },
    { 
      _id: 3, 
      name: "Confort Plus", 
      departureCity: "San-Pédro", 
      arrivalCity: "Abidjan", 
      departureStation: "Gare Routière", 
      arrivalStation: "Treichville", 
      departureTime: "14:00", 
      arrivalTime: "19:30",
      duration: "5h30",
      price: 8000, 
      routeType: "standard", 
      status: "active",
      seats: 20,
      companyId: { 
        companyName: "AHT Bus"
      }
    },
  ];

  const loadRoutes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/routes');
      if (!response.ok) throw new Error('API Error');
      const routesData = await response.json();
      
      const activeRoutes = routesData
        .filter(route => route.status === "active")
        .map(route => ({
          ...route,
          companyName: route.companyId?.companyName || "Compagnie"
        }));
      
      setAllRoutes(activeRoutes);
    } catch (error) {
      console.warn("Mode démo activé");
      setAllRoutes(mockRoutes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadRoutes(); 
  }, []);

  const searchRoutes = () => {
    if (!searchData.departureCity || !searchData.arrivalCity) {
      setError("❌ Veuillez sélectionner les villes de départ et d'arrivée");
      return;
    }
    if (searchData.departureCity === searchData.arrivalCity) {
      setError("❌ Les villes de départ et d'arrivée doivent être différentes");
      return;
    }
    
    setError('');
    setLoading(true);
    setHasSearched(true);
    
    setTimeout(() => {
      try {
        const filteredRoutes = allRoutes.filter(route => 
          route.departureCity === searchData.departureCity && 
          route.arrivalCity === searchData.arrivalCity
        );
        
        if (filteredRoutes.length === 0) {
          setError(`❌ Aucun trajet trouvé de ${searchData.departureCity} à ${searchData.arrivalCity}`);
          setRoutes([]);
        } else {
          setRoutes(filteredRoutes);
        }
      } catch (error) {
        setError("❌ Erreur lors de la recherche");
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  };

  const resetSearch = () => {
    setSearchData({ departureCity: '', arrivalCity: '' });
    setError('');
    setRoutes([]);
    setHasSearched(false);
  };

  const getCompanyInitial = (route) => {
    return route.companyId?.companyName?.charAt(0) || route.name.charAt(0);
  };

  const getCompanyName = (route) => {
    return route.companyId?.companyName || "Compagnie";
  };

  // Fonction pour calculer le prix total avec frais de service
  const calculateTotalPrice = (basePrice) => {
    const serviceFee = 1000;
    return basePrice + serviceFee;
  };

  // Fonction pour formater le texte long sur mobile
  const truncateText = (text, maxLength = 20) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden">
      
      {/* Bandeau tricolore - Toujours visible */}
      <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-green-600 fixed top-0 z-[100] shadow-lg"></div>

      {/* Navigation Responsive */}
      <nav className="fixed top-2 w-full z-[99] bg-black/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => {navigate('/'); setIsMenuOpen(false);}}>
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

            {/* Menu Burger Mobile & Tablet */}
            <div className="lg:hidden flex items-center space-x-2">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2 rounded-lg bg-white/10"
              >
                {isMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile & Tablet Slide-in */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10 shadow-2xl">
            <div className="flex flex-col p-4 space-y-4">
              <a href="#" className="text-white font-bold py-3 border-b border-white/10" onClick={() => setIsMenuOpen(false)}>Accueil</a>
              <a href="#" className="text-white font-bold py-3 border-b border-white/10" onClick={() => setIsMenuOpen(false)}>Compagnies</a>
              <a href="#" className="text-white font-bold py-3 border-b border-white/10" onClick={() => setIsMenuOpen(false)}>Destinations</a>
              <button onClick={() => {navigate('/login-company'); setIsMenuOpen(false);}} className="text-white font-bold py-3 border-b border-white/10 text-left">
                Connexion
              </button>
              <button onClick={() => {navigate('/register-company'); setIsMenuOpen(false);}} className="bg-white text-slate-900 font-bold py-3 rounded-lg text-center">
                Partenaires
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Responsive */}
      <div className="relative h-[500px] xs:h-[550px] sm:h-[600px] md:h-[650px] lg:h-[700px] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" 
            alt="Bus sur route ivoirienne" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/80 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-3 text-center mt-8">
          <div className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-orange-300 text-sm font-bold uppercase tracking-widest mb-6 shadow-lg">
            🇨🇮 SERVICE INDÉPENDANT
          </div>
          
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-tight drop-shadow-2xl px-2">
            Voyagez en <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-green-400">
              toute sérénité
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl text-gray-200 font-bold max-w-3xl mx-auto drop-shadow-lg mb-6 px-4">
            Service de conciergerie indépendant pour réserver vos billets de bus en Côte d'Ivoire
          </p>
          
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 max-w-2xl mx-auto m-4">
            <p className="text-white font-bold text-sm sm:text-base">
              🚨 <span className="text-orange-300">ATTENTION :</span> Nous ne sommes PAS une compagnie de transport
            </p>
            <p className="text-white/90 text-xs sm:text-sm mt-1">
              Nous sommes un <span className="text-green-300 font-bold">service indépendant</span> qui vous aide à trouver et réserver vos billets
            </p>
          </div>
        </div>
      </div>

      {/* Moteur de Recherche - Ultra Responsive */}
      <div className="relative -mt-20 xs:-mt-24 sm:-mt-28 md:-mt-32 lg:-mt-36 z-20 max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-4 lg:p-6 border-2 border-orange-200">
          <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
            
            {/* Disclaimer Responsive */}
            <div className="mb-4 sm:mb-6 lg:mb-8 p-3 sm:p-4 lg:p-5 bg-red-50 border-2 border-red-400 rounded-lg sm:rounded-xl lg:rounded-2xl text-red-800 text-sm sm:text-base lg:text-base font-bold shadow-lg">
              <div className="flex items-start gap-2 lg:gap-3">
                <span className="text-lg sm:text-xl lg:text-xl flex-shrink-0 mt-0.5">⚠️</span>
                <div>
                  <p className="text-base sm:text-lg lg:text-lg">IMPORTANT : SERVICE INDÉPENDANT</p>
                  <p className="text-xs sm:text-sm lg:text-sm font-normal mt-1 lg:mt-2">
                    TransportTicket.ci est un <span className="font-bold">service de conciergerie indépendant</span> et 
                    n'est <span className="font-bold">PAS affilié</span> aux compagnies de transport. 
                    Les horaires et prix sont <span className="font-bold">indicatifs</span>.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-red-100 border-l-4 border-red-500 rounded-lg text-red-700 text-sm font-bold shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-lg">❌</span>
                  <span className="text-xs sm:text-sm lg:text-sm">{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-4 xl:gap-6 items-end">
              
              {/* Départ */}
              <div className="lg:col-span-5 xl:col-span-4">
                <label className="block text-sm lg:text-base font-bold text-gray-700 uppercase tracking-wider mb-2">
                  <span className="text-orange-500">📍</span> DÉPART
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-orange-500 text-lg lg:text-xl">🚀</span>
                  </div>
                  <select
                    name="departureCity"
                    value={searchData.departureCity}
                    onChange={handleSearchChange}
                    className="block w-full pl-10 pr-6 py-3 lg:py-4 bg-gray-50 border-2 border-gray-300 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl lg:rounded-2xl text-gray-900 font-bold text-sm lg:text-base transition-all cursor-pointer hover:bg-gray-100 appearance-none"
                  >
                    <option value="">Choisissez la ville</option>
                    {cities.map(city => <option key={city} value={city}>{truncateText(city, window.innerWidth < 1024 ? 15 : 20)}</option>)}
                  </select>
                </div>
              </div>

              {/* Arrivée */}
              <div className="lg:col-span-5 xl:col-span-4">
                <label className="block text-sm lg:text-base font-bold text-gray-700 uppercase tracking-wider mb-2">
                  <span className="text-green-600">📍</span> ARRIVÉE
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-green-600 text-lg lg:text-xl">🏁</span>
                  </div>
                  <select
                    name="arrivalCity"
                    value={searchData.arrivalCity}
                    onChange={handleSearchChange}
                    className="block w-full pl-10 pr-6 py-3 lg:py-4 bg-gray-50 border-2 border-gray-300 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl lg:rounded-2xl text-gray-900 font-bold text-sm lg:text-base transition-all cursor-pointer hover:bg-gray-100 appearance-none"
                  >
                    <option value="">Choisissez la ville</option>
                    {cities.map(city => <option key={city} value={city}>{truncateText(city, window.innerWidth < 1024 ? 15 : 20)}</option>)}
                  </select>
                </div>
              </div>

              {/* Boutons Responsive */}
              <div className="lg:col-span-2 xl:col-span-4 flex gap-2 sm:gap-3 lg:gap-4">
                <button
                  onClick={searchRoutes}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 lg:py-4 px-4 rounded-xl lg:rounded-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 text-sm lg:text-base min-w-0"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-1 lg:gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden xs:inline">Recherche...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1 lg:gap-2">
                      <span className="text-base lg:text-lg">🔍</span>
                      <span className="hidden xs:inline">CHERCHER</span>
                    </div>
                  )}
                </button>
                {(searchData.departureCity || hasSearched) && (
                  <button onClick={resetSearch} className="bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600 p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-colors font-bold text-sm shadow-lg flex items-center justify-center">
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Résultats - Responsive */}
      {hasSearched && (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-20">
          
          <div className="mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 text-center">
              🚍 TRAJETS DISPONIBLES
            </h2>
            <div className="h-1.5 w-24 lg:w-32 bg-green-500 mt-3 lg:mt-4 rounded-full mx-auto"></div>
            
            {/* Disclaimer Responsive */}
            <div className="mt-6 lg:mt-8 p-4 lg:p-5 bg-yellow-100 border-2 border-yellow-400 rounded-lg lg:rounded-xl text-yellow-800 text-sm lg:text-base shadow-lg max-w-4xl mx-auto">
              <div className="flex items-start gap-2 lg:gap-3">
                <span className="text-lg lg:text-xl flex-shrink-0 mt-0.5">ℹ️</span>
                <div>
                  <p className="font-bold text-base lg:text-lg">INFORMATION IMPORTANTE</p>
                  <p className="text-xs lg:text-sm mt-1 lg:mt-2">
                    Les horaires affichés sont <span className="font-bold">indicatifs</span>. 
                    La confirmation définitive sera fournie par notre service concierge avant paiement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:gap-6 lg:gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white h-40 sm:h-48 lg:h-56 rounded-xl lg:rounded-2xl shadow-lg animate-pulse bg-gray-200 border-2 border-gray-300"></div>
              ))}
            </div>
          ) : routes.length === 0 ? (
            <div className="text-center py-12 lg:py-16 bg-white rounded-2xl lg:rounded-3xl border-4 border-dashed border-gray-400 shadow-2xl mx-2 lg:mx-4">
              <div className="text-6xl lg:text-7xl mb-4 lg:mb-6">😔</div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-3 lg:mb-4">AUCUN TRAJET TROUVÉ</h3>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 px-4 lg:px-8">
                Désolé, nous n'avons trouvé aucun trajet de <span className="font-bold text-orange-600">{truncateText(searchData.departureCity, window.innerWidth < 1024 ? 12 : 15)}</span> à <span className="font-bold text-green-600">{truncateText(searchData.arrivalCity, window.innerWidth < 1024 ? 12 : 15)}</span>
              </p>
              <button 
                onClick={resetSearch}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 lg:py-4 px-6 lg:px-8 rounded-xl lg:rounded-2xl text-base lg:text-lg shadow-2xl transition-all transform hover:scale-105"
              >
                🔄 NOUVELLE RECHERCHE
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 lg:gap-8">
              {routes.map((route) => (
                <div key={route._id} className="group bg-white rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  
                  {/* Indicateur latéral */}
                  <div className={`absolute left-0 top-0 bottom-0 w-2 ${route.routeType === 'vip' ? 'bg-gradient-to-b from-purple-600 to-purple-800' : 'bg-gradient-to-b from-orange-500 to-orange-700'}`}></div>

                  <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 pl-3 lg:pl-4">
                    
                    {/* En-tête Responsive */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-1 min-w-0">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-xl lg:rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-black shadow-lg flex-shrink-0">
                          {getCompanyInitial(route)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 truncate">{truncateText(getCompanyName(route), window.innerWidth < 1024 ? 20 : 25)}</h3>
                          <p className="text-sm sm:text-base lg:text-lg text-gray-600 truncate">{route.name}</p>
                          <div className="flex items-center gap-2 mt-2 lg:mt-3">
                            <span className="text-xs lg:text-sm text-gray-500 bg-gray-100 px-2 lg:px-3 py-1 rounded font-bold border border-gray-300">
                              🛡️ INDÉPENDANT
                            </span>
                          </div>
                        </div>
                      </div>
                      {route.routeType === 'vip' && (
                        <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 lg:px-3 py-1 lg:py-2 rounded-full text-xs lg:text-sm font-black uppercase tracking-wide shadow-lg flex-shrink-0 ml-2">
                          ⭐ VIP
                        </span>
                      )}
                    </div>

                    {/* Horaires Responsive */}
                    <div className="bg-gray-100 rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-5 border-2 border-gray-300">
                      <div className="flex items-center justify-between">
                        <div className="text-center flex-1">
                          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">{route.departureTime}</div>
                          <div className="text-xs sm:text-sm lg:text-base font-bold text-gray-700 uppercase mt-1 lg:mt-2">{truncateText(route.departureCity, window.innerWidth < 1024 ? 10 : 15)}</div>
                          <div className="text-xs lg:text-sm text-gray-500 mt-1 lg:mt-2 bg-yellow-100 px-1 lg:px-2 py-0.5 lg:py-1 rounded font-bold">
                            🕐 Indicatif
                          </div>
                        </div>
                        
                        <div className="flex-1 px-2 sm:px-4 lg:px-6 flex flex-col items-center">
                          <div className="text-xs lg:text-sm font-black text-gray-600 mb-2 lg:mb-3 bg-white px-2 lg:px-3 py-1 rounded-full border">
                            ⏱️ {route.duration}
                          </div>
                          <div className="w-full h-1 lg:h-1.5 bg-gray-400 relative flex items-center">
                            <div className="h-3 w-3 lg:h-4 lg:w-4 bg-orange-500 rounded-full absolute left-0 -ml-1.5 lg:-ml-2 border border-white shadow"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white px-1 py-0.5 lg:px-2 lg:py-1 rounded-full border shadow-sm">
                                <span className="text-[10px] lg:text-xs font-black text-gray-600">🚌</span>
                              </div>
                            </div>
                            <div className="h-3 w-3 lg:h-4 lg:w-4 bg-green-600 rounded-full absolute right-0 -mr-1.5 lg:-mr-2 border border-white shadow"></div>
                          </div>
                        </div>

                        <div className="text-center flex-1">
                          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">{route.arrivalTime}</div>
                          <div className="text-xs sm:text-sm lg:text-base font-bold text-gray-700 uppercase mt-1 lg:mt-2">{truncateText(route.arrivalCity, window.innerWidth < 1024 ? 10 : 15)}</div>
                          <div className="text-xs lg:text-sm text-gray-500 mt-1 lg:mt-2 bg-yellow-100 px-1 lg:px-2 py-0.5 lg:py-1 rounded font-bold">
                            🕐 Estimé
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Prix et Bouton Responsive */}
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-6 border-t-2 border-gray-200 pt-4 lg:pt-6">
                      <div className="text-left min-w-0 flex-1">
                        <span className="text-xs lg:text-sm font-black text-gray-500 uppercase block">PRIX ESTIMÉ</span>
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-orange-600 tracking-tight mt-1 lg:mt-2">
                          {route.price?.toLocaleString()} <span className="text-sm lg:text-base text-gray-600 font-bold">FCFA</span>
                        </div>
                        <div className="text-xs lg:text-sm text-green-600 font-black mt-2 lg:mt-3 bg-green-50 px-2 lg:px-3 py-1 lg:py-1.5 rounded border border-green-200">
                          ➕ 1 000 FCFA frais
                        </div>
                        <div className="text-sm lg:text-base font-black text-slate-900 mt-2 lg:mt-3 bg-blue-50 px-2 lg:px-3 py-1.5 lg:py-2 rounded border border-blue-300">
                          💰 TOTAL: {calculateTotalPrice(route.price).toLocaleString()} FCFA
                        </div>
                      </div>
                      
                      <button className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-green-600 hover:to-green-700 text-white font-black py-3 lg:py-4 px-4 sm:px-6 lg:px-8 rounded-xl lg:rounded-2xl transition-all shadow-xl hover:shadow-green-500/30 text-sm lg:text-base transform hover:scale-105 flex items-center justify-center gap-2 lg:gap-3 flex-shrink-0">
                        <span className="hidden xs:inline">🎫</span>
                        <span>RÉSERVER</span>
                        <span className="text-sm lg:text-base">➡️</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Section d'accueil Responsive */}
      {!hasSearched && (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-20">
          <div className="text-center py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white to-blue-50 rounded-2xl sm:rounded-3xl lg:rounded-3xl border-4 border-orange-200 shadow-2xl mx-2 lg:mx-4">
            <div className="text-6xl sm:text-7xl lg:text-8xl mb-6 lg:mb-8">🚍</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 lg:mb-6 px-4 lg:px-8">
              TROUVEZ VOTRE <span className="text-orange-600">PROCHAIN VOYAGE</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl lg:max-w-4xl mx-auto mb-8 lg:mb-12 leading-relaxed px-4 lg:px-8">
              Service de <span className="font-bold text-green-600">conciergerie indépendant</span> pour vos réservations de bus 
              partout en <span className="font-bold text-orange-600">Côte d'Ivoire</span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl lg:max-w-5xl mx-auto px-4 lg:px-8">
              <div className="text-center p-4 lg:p-6 bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-orange-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-orange-100 rounded-xl lg:rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl mb-3 lg:mb-4 mx-auto">📍</div>
                <p className="text-sm sm:text-base lg:text-lg font-black text-gray-800">CHOISISSEZ VOS VILLES</p>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 lg:mt-2">Sélectionnez départ et arrivée</p>
              </div>
              <div className="text-center p-4 lg:p-6 bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-green-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-green-100 rounded-xl lg:rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl mb-3 lg:mb-4 mx-auto">🔍</div>
                <p className="text-sm sm:text-base lg:text-lg font-black text-gray-800">RECHERCHEZ LES TRAJETS</p>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 lg:mt-2">Trouvez les meilleures options</p>
              </div>
              <div className="text-center p-4 lg:p-6 bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-blue-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-blue-100 rounded-xl lg:rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl mb-3 lg:mb-4 mx-auto">🎫</div>
                <p className="text-sm sm:text-base lg:text-lg font-black text-gray-800">RÉSERVEZ FACILEMENT</p>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 lg:mt-2">Service de réservation simple</p>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-12 p-4 lg:p-5 bg-red-50 border-2 border-red-300 rounded-xl lg:rounded-2xl max-w-2xl lg:max-w-3xl mx-auto mx-4 lg:mx-8">
              <p className="text-sm sm:text-base lg:text-lg font-black text-red-800">
                🚨 RAPPEL IMPORTANT : SERVICE INDÉPENDANT
              </p>
              <p className="text-red-700 text-xs sm:text-sm lg:text-base mt-1 lg:mt-2">
                Nous ne sommes PAS une compagnie de transport. Nous vous aidons à réserver vos billets.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* Footer Responsive */}
      <footer className="bg-slate-100 border-t-4 border-orange-500 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center">
            <p className="font-black text-slate-900 text-lg sm:text-xl lg:text-2xl mb-3 lg:mb-4">TransportTicket.ci</p>
            <div className="flex justify-center gap-2 lg:gap-3 mb-4 lg:mb-6">
              <div className="h-1.5 w-8 lg:w-12 bg-orange-500 rounded-full"></div>
              <div className="h-1.5 w-8 lg:w-12 bg-gray-400 rounded-full"></div>
              <div className="h-1.5 w-8 lg:w-12 bg-green-600 rounded-full"></div>
            </div>
            
            {/* DISCLAIMER JURIDIQUE Responsive */}
            <div className="max-w-5xl mx-auto mt-6 lg:mt-8 p-4 sm:p-6 lg:p-8 bg-white border-4 border-red-400 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl mx-2 lg:mx-4">
              <div className="text-center mb-4 lg:mb-6">
                <span className="text-2xl sm:text-3xl lg:text-4xl">⚠️</span>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-red-800 mt-1 lg:mt-2">
                  AVERTISSEMENT JURIDIQUE
                </h3>
              </div>
              
              <div className="text-left space-y-3 lg:space-y-4 text-sm lg:text-base text-gray-800">
                <p className="font-bold text-red-700 text-sm lg:text-base">
                  🚨 TransportTicket.ci est un SERVICE DE CONCIERGERIE INDÉPENDANT
                </p>
                
                <p className="text-xs sm:text-sm lg:text-base">
                  <span className="font-bold">Nous ne sommes PAS :</span> affiliés, partenaires, représentants officiels ou agents 
                  de quelque compagnie de transport que ce soit.
                </p>
                
                <p className="text-xs sm:text-sm lg:text-base">
                  <span className="font-bold">Nous sommes :</span> un service indépendant qui vous aide à trouver et réserver 
                  vos billets de bus plus facilement.
                </p>
                
                <p className="text-xs sm:text-sm lg:text-base">
                  <span className="font-bold">Les informations affichées :</span> horaires, prix et disponibilités sont 
                  <span className="font-bold text-orange-600"> INDICATIFS</span> et sujets à confirmation.
                </p>
                
                <p className="font-bold text-green-700 text-xs sm:text-sm lg:text-base">
                  ✅ Tous les droits de marque et propriété intellectuelle appartiennent à leurs propriétaires respectifs.
                </p>
              </div>
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

export default HomePage;