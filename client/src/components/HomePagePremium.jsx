import React from "react";

const HomePage = () => {
  return (
    <div className="bg-blue-950 text-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Image de fond */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://source.unsplash.com/1600x900/?african-students,education,classroom')",
          }}
        >
          {/* Overlay élégant */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/80 to-transparent"></div>
        </div>

        {/* Contenu Hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between">
          {/* Texte */}
          <div className="max-w-xl md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Réinventons <br />
              <span className="text-blue-400">l’éducation africaine</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Une plateforme scolaire intelligente qui connecte les{" "}
              <span className="text-white font-semibold">directions</span>, les{" "}
              <span className="text-white font-semibold">enseignants</span> et
              les <span className="text-white font-semibold">parents</span> pour
              une gestion fluide et moderne.
            </p>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-center md:justify-start">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:-translate-y-1">
                Commencer l’essai gratuit
              </button>
              <button className="bg-transparent border border-blue-400 hover:bg-blue-400 hover:text-white text-blue-400 font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:-translate-y-1">
                Découvrir la démo
              </button>
            </div>
          </div>

          {/* Mockup Hero */}
          <div className="relative mt-12 md:mt-0 md:w-1/2 flex justify-center">
            <div className="relative w-72 h-128 bg-gray-900 rounded-3xl shadow-2xl border-4 border-gray-700 overflow-hidden transform hover:scale-105 transition duration-500">
              <img
                src="https://source.unsplash.com/400x800/?mobile-app,students"
                alt="App Mockup"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="bg-gray-900 py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              Une plateforme, <span className="text-blue-400">3 univers</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Chaque acteur du système éducatif dispose d’un espace pensé pour
              simplifier son quotidien.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mt-16">
            {/* Portail Parents */}
            <div className="text-center">
              <div className="relative w-52 h-96 mx-auto bg-gray-800 rounded-3xl shadow-xl border border-gray-700 overflow-hidden transform hover:scale-105 transition">
                <img
                  src="https://source.unsplash.com/200x400/?school,parent,communication"
                  alt="Portail Parents"
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mt-6">Portail Parents</h3>
              <p className="text-gray-400 mt-2">
                Suivi des notes, paiements, présence et communication directe
                avec l’école.
              </p>
            </div>

            {/* Portail Enseignants */}
            <div className="text-center">
              <div className="relative w-80 mx-auto bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden transform hover:scale-105 transition">
                <img
                  src="https://source.unsplash.com/400x300/?teacher,lms"
                  alt="Portail Enseignants"
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mt-6">Portail Enseignants</h3>
              <p className="text-gray-400 mt-2">
                Gestion des cours, saisie des notes, suivi de la classe et
                communication simplifiée.
              </p>
            </div>

            {/* Tableau de bord Direction */}
            <div className="text-center">
              <div className="relative w-full max-w-sm mx-auto bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden transform hover:scale-105 transition">
                <img
                  src="https://source.unsplash.com/600x400/?analytics,school"
                  alt="Tableau de bord"
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mt-6">Tableau de Bord</h3>
              <p className="text-gray-400 mt-2">
                Une vision claire sur les élèves, les enseignants et la santé
                globale de l’établissement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
