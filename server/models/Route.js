// server/models/Route.js
import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    departureCity: {
      type: String,
      required: true,
      trim: true
    },
    arrivalCity: {
      type: String,
      required: true,
      trim: true
    },
    departureStation: {
      type: String,
      required: true,
      trim: true
    },
    arrivalStation: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number, // prix en FCFA
      required: true
    },
    routeType: {
      type: String,
      enum: ["standard", "vip"],
      default: "standard"
    },
    departureTime: {
      type: String, // Format "HH:MM"
      required: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    // Champs conservés pour compatibilité mais avec valeurs par défaut
    distance: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    },
    features: {
      wifi: { type: Boolean, default: false },
      airConditioning: { type: Boolean, default: false },
      snack: { type: Boolean, default: false },
      toilet: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

const Route = mongoose.model("Route", routeSchema);

export default Route;