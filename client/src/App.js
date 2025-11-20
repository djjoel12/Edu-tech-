import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./components/HomePage";
import CompanyRegisterForm from "./components/CompanyRegisterForm";
import CompanyLogin from "./components/CompanyLogin";
import RouteComparison from './components/RouteComparison';
import CompanyDashboard from './components/CompanyDashboard';
import RoutePage from "./components/RoutePage"; // ← IMPORT AJOUTÉ

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation bar */}
        <nav className="p-4 bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-green-500 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">TransportTicket</span>
            </Link>
            <div className="space-x-6">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Accueil
              </Link>
              <Link 
                to="/find-ticket" 
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Trouver un Ticket
              </Link>
              <Link 
                to="/login-company" 
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Connexion
              </Link>
              <Link 
                to="/register-company" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Inscrire ma Compagnie
              </Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register-company" element={<CompanyRegisterForm />} />
          <Route path="/login-company" element={<CompanyLogin />} />
          {/* ROUTE SEO CRITIQUE AJOUTÉE */}
          <Route path="/trajet/:departure/:arrival" element={<RoutePage />} />
          <Route path="/comparison/:departure/:arrival" element={<RouteComparison />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/find-ticket" element={
            <div className="container mx-auto p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Recherche de tickets - Bientôt disponible
              </h2>
              <p className="text-gray-600">
                Cette fonctionnalité sera bientôt implémentée.
              </p>
            </div>
          } />
          {/* Route de fallback pour les pages non trouvées */}
          <Route path="*" element={
            <div className="container mx-auto p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Page non trouvée
              </h2>
              <p className="text-gray-600 mb-4">
                La page que vous recherchez n'existe pas.
              </p>
              <Link 
                to="/" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Retour à l'accueil
              </Link>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;