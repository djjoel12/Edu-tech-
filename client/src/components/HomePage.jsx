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
  const [currentBackground, setCurrentBackground] = useState(0);

  // Images de fond pour le carrousel
  const backgroundImages = [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.1&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.1&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.1&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.1&auto=format&fit=crop&w=2000&q=80'
  ];

  const cities = [
    "Abidjan", "Bouaké", "Daloa", "Korhogo", "San-Pédro", "Yamoussoukro",
    "Divo", "Gagnoa", "Abengourou", "Man", "Anyama", "Bingerville"
  ];

  // Effet pour le carrousel d'images de fond
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
    
    navigate(`/comparison/${encodeURIComponent(searchData.departureCity)}/${encodeURIComponent(searchData.arrivalCity)}`);
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

  const truncateText = (text, maxLength = 20) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden">
      
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

      {/* Hero Section avec fond changeant */}
      <div className="relative h-[500px] xs:h-[550px] sm:h-[600px] md:h-[650px] lg:h-[700px] flex items-center justify-center overflow-hidden pt-16">
        
        {/* Carrousel d'images de fond */}
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
          {/* Overlay amélioré pour une meilleure lisibilité */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        {/* Indicateurs de slides */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentBackground ? 'bg-orange-500 scale-125' : 'bg-white/50'
              }`}
              onClick={() => setCurrentBackground(index)}
            />
          ))}
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
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl text-white font-bold max-w-3xl mx-auto drop-shadow-lg mb-6 px-4 leading-relaxed">
            Service de conciergerie indépendant pour réserver vos billets de bus en Côte d'Ivoire
          </p>
          
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 max-w-2xl mx-auto m-4">
            <p className="text-white font-bold text-sm sm:text-base drop-shadow-md">
              🚨 <span className="text-orange-300">ATTENTION :</span> Nous ne sommes PAS une compagnie de transport
            </p>
            <p className="text-white/90 text-xs sm:text-sm mt-1 drop-shadow-md">
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
                  <p className="text-xs sm:text-sm lg:text-sm font-normal mt-1 lg:mt-2 leading-relaxed">
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
                {(searchData.departureCity || searchData.arrivalCity) && (
                  <button onClick={resetSearch} className="bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600 p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-colors font-bold text-sm shadow-lg flex items-center justify-center">
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section d'accueil Responsive */}
      {!hasSearched && (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-20">
          <div className="text-center py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white to-blue-50 rounded-2xl sm:rounded-3xl lg:rounded-3xl border-4 border-orange-200 shadow-2xl mx-2 lg:mx-4">
            <div className="text-6xl sm:text-7xl lg:text-8xl mb-6 lg:mb-8">🚍</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 lg:mb-6 px-4 lg:px-8 leading-tight">
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
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 lg:mt-2 leading-relaxed">Sélectionnez départ et arrivée</p>
              </div>
              <div className="text-center p-4 lg:p-6 bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-green-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-green-100 rounded-xl lg:rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl mb-3 lg:mb-4 mx-auto">🔍</div>
                <p className="text-sm sm:text-base lg:text-lg font-black text-gray-800">RECHERCHEZ LES TRAJETS</p>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 lg:mt-2 leading-relaxed">Trouvez les meilleures options</p>
              </div>
              <div className="text-center p-4 lg:p-6 bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-blue-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-blue-100 rounded-xl lg:rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl mb-3 lg:mb-4 mx-auto">🎫</div>
                <p className="text-sm sm:text-base lg:text-lg font-black text-gray-800">RÉSERVEZ FACILEMENT</p>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 lg:mt-2 leading-relaxed">Service de réservation simple</p>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-12 p-4 lg:p-5 bg-red-50 border-2 border-red-300 rounded-xl lg:rounded-2xl max-w-2xl lg:max-w-3xl mx-auto mx-4 lg:mx-8">
              <p className="text-sm sm:text-base lg:text-lg font-black text-red-800">
                🚨 RAPPEL IMPORTANT : SERVICE INDÉPENDANT
              </p>
              <p className="text-red-700 text-xs sm:text-sm lg:text-base mt-1 lg:mt-2 leading-relaxed">
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
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-red-800 mt-1 lg:mt-2 leading-tight">
                  AVERTISSEMENT JURIDIQUE
                </h3>
              </div>
              
              <div className="text-left space-y-3 lg:space-y-4 text-sm lg:text-base text-gray-800 leading-relaxed">
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
            
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-6 lg:mt-8 font-bold leading-relaxed">
              © 2025 TransportTicket.ci - Service de conciergerie indépendant
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 

export default HomePage;