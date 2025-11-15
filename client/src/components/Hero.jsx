import React from 'react';

const HeroSection = () => {
  return (
    <div 
      className="relative bg-cover bg-center h-screen flex items-center justify-center text-center p-6"
      style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?edtech,online-learning')" }}
    >
      {/* Overlay pour assombrir l'image et améliorer la lisibilité */}
      <div className="absolute inset-0 bg-blue-900 opacity-70"></div>
      
      {/* Contenu de la page d'accueil */}
      <div className="relative z-10 text-white max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
          Débloquez votre potentiel avec l'apprentissage personnalisé
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Rejoignez des milliers d'apprenants et d'écoles qui transforment l'éducation grâce à notre plateforme intuitive.
        </p>
        <button className="bg-white text-blue-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition-colors">
          Commencer l'essai gratuit
        </button>
      </div>
    </div>
  );
};

export default HeroSection;