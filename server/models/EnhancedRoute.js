// server/models/EnhancedRoute.js
import mongoose from "mongoose";

const enhancedRouteSchema = new mongoose.Schema({
  // Identité de la route
  routeKey: { // ex: "abidjan-bouake"
    type: String,
    required: true,
    index: true
  },
  departureCity: {
    type: String,
    required: true
  },
  arrivalCity: {
    type: String,
    required: true
  },
  
  // Compagnie
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  
  // Détails du trajet
  departureStations: [{
    name: String,
    departureTimes: [String] // ["06:30", "08:00", "10:00"]
  }],
  
  // Prix et durée
  priceRange: {
    min: Number,
    max: Number
  },
  estimatedDuration: String, // "5-6 heures"
  
  // Type de service
  busType: {
    type: String,
    enum: ["economy", "comfort", "vip", "premium"],
    default: "economy"
  },
  
  // Équipements
  amenities: [{
    type: String,
    enum: ["wifi", "ac", "snack", "toilet", "charging", "entertainment", "blanket"]
  }],
  
  // Contact direct
  contactPhone: String,
  whatsappNumber: String,
  
  // Statut et réservation
  canBookOnline: {
    type: Boolean,
    default: false
  },
  bookingUrl: String,
  
  // Statistiques (futur)
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
}, {
  timestamps: true
});

export default mongoose.model('EnhancedRoute', enhancedRouteSchema);