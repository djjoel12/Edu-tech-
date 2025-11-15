import React from "react";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    // Thème principal : Passage à un fond clair et une typographie foncée pour une meilleure lisibilité.
    <div className="bg-gray-50 text-slate-800 font-sans">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Colonne de Texte */}
          <div className="text-center md:text-left">
            <div className="mb-6">
              {/* Badge avec un design plus doux, adapté au thème clair */}
              <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold ring-1 ring-inset ring-orange-200">
                🇨🇮 La Côte d'Ivoire en Mouvement
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-slate-900">
              Votre Trajet, <br />
              {/* Le dégradé est conservé mais ressort différemment sur le fond clair */}
              <span className="text-transparent bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text">
                en un Clic.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              La plateforme N°1 pour réserver vos billets de bus, minicars et VTC à travers tout le pays. Simple, fiable et 100% sécurisé.
            </p>

            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-center md:justify-start">
              {/* Boutons redessinés avec des ombres plus subtiles et des couleurs vives */}
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                Réserver mon Billet
              </button>

              <button 
                onClick={() => navigate('/register-company')}
                className="bg-white hover:bg-green-50 text-gray-700 hover:text-green-700 font-bold py-4 px-10 rounded-lg border border-gray-300 hover:border-green-400 transition-all duration-300 transform hover:-translate-y-1"
              >
                Espace Partenaire
              </button>
            </div>

            {/* Lien de connexion pour les compagnies existantes */}
            <div className="mt-6 text-center md:text-left">
              <p className="text-gray-600 text-sm">
                Déjà partenaire ?{' '}
                <button 
                  onClick={() => navigate('/login-company')}
                  className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-2 transition-colors"
                >
                  Connectez-vous ici
                </button>
              </p>
            </div>

            {/* Statistiques avec une nouvelle typographie et couleurs */}
            <div className="flex flex-wrap gap-x-12 gap-y-4 mt-12 justify-center md:justify-start">
              <div>
                <div className="text-3xl font-bold text-orange-500">50K+</div>
                <div className="text-gray-500 text-sm font-medium">Voyageurs Satisfaits</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500">150+</div>
                <div className="text-gray-500 text-sm font-medium">Destinations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800">24/7</div>
                <div className="text-gray-500 text-sm font-medium">Support Client</div>
              </div>
            </div>
          </div>

          {/* Colonne du Mockup de l'application */}
          <div className="relative flex justify-center">
            {/* Mockup de téléphone plus épuré et moderne, avec une ombre douce */}
            <div className="relative w-80 h-[600px] bg-white rounded-[2.5rem] shadow-2xl ring-1 ring-gray-200">
              {/* Barre supérieure du téléphone (notch) */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-100 rounded-b-lg z-10"></div>

              <div className="absolute inset-2 rounded-[2rem] overflow-hidden">
                <img
                  src="https://source.unsplash.com/400x800/?ivorian,people,mobile-app,travel"
                  alt="Interface de l'application"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section des Fonctionnalités */}
      {/* Fond blanc pour contraster avec la section Hero */}
      <section className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Pensé pour <span className="text-transparent bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text">Tous</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Une solution complète qui facilite la vie des voyageurs, optimise la gestion des compagnies et simplifie le travail des contrôleurs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Design des cartes revu : fond blanc, ombres subtiles, et bordure colorée au survol */}

            {/* Carte Voyageurs */}
            <div className="group text-center bg-white rounded-2xl p-8 border border-gray-200 hover:border-orange-400 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6 transform transition-transform duration-300 group-hover:scale-110">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Pour les Voyageurs</h3>
              <p className="text-gray-600 leading-relaxed">
                Recherchez, comparez et réservez votre trajet en moins de 2 minutes. Recevez votre e-billet avec QR code instantanément.
              </p>
            </div>

            {/* Carte Compagnies */}
            <div className="group text-center bg-white rounded-2xl p-8 border border-gray-200 hover:border-green-400 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6 transform transition-transform duration-300 group-hover:scale-110">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Pour les Compagnies</h3>
              <p className="text-gray-600 leading-relaxed">
                Digitalisez vos ventes, gérez votre flotte et vos départs. Accédez à des statistiques détaillées pour développer votre activité.
              </p>
              <div className="mt-4">
                <button 
                  onClick={() => navigate('/login-company')}
                  className="text-green-600 hover:text-green-700 font-medium text-sm underline underline-offset-2 transition-colors"
                >
                  Accéder à mon espace
                </button>
              </div>
            </div>

            {/* Carte Contrôleurs */}
            <div className="group text-center bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-400 hover:shadow-xl transition-all duration-300">
               <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6 transform transition-transform duration-300 group-hover:scale-110">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Pour les Contrôleurs</h3>
              <p className="text-gray-600 leading-relaxed">
                Validez les billets en un flash avec notre application mobile. Suivez le remplissage des véhicules en temps réel et sans erreur.
              </p>
            </div>
          </div>

          {/* Section d'appel à l'action pour les compagnies */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl p-8 border border-orange-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Vous êtes une compagnie de transport ?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Rejoignez notre plateforme et boostez votre activité avec nos outils de gestion modernes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/register-company')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Créer un compte
                </button>
                <button 
                  onClick={() => navigate('/login-company')}
                  className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-8 rounded-lg border border-gray-300 transition-colors"
                >
                  Se connecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;