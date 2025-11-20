// server/routes/enhancedRouteRoutes.js
import express from "express";
import EnhancedRoute from "../models/EnhancedRoute.js";

const router = express.Router();

// GET routes par ville (pour la comparaison)
router.get("/comparison/:departure/:arrival", async (req, res) => {
  try {
    const { departure, arrival } = req.params;
    const routeKey = `${departure.toLowerCase()}-${arrival.toLowerCase()}`;
    
    const routes = await EnhancedRoute.find({ 
      routeKey,
      status: "active" 
    })
    .populate("companyId", "companyName logo phone email")
    .sort({ "priceRange.min": 1 });
    
    res.json(routes);
  } catch (err) {
    console.error("Error fetching comparison routes:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST nouvelle route enrichie
router.post("/", async (req, res) => {
  try {
    const routeData = req.body;
    
    // Générer la clé de route
    routeData.routeKey = `${routeData.departureCity.toLowerCase()}-${routeData.arrivalCity.toLowerCase()}`;
    
    const route = new EnhancedRoute(routeData);
    await route.save();
    
    res.status(201).json({
      message: "Route enrichie créée avec succès",
      route
    });
  } catch (err) {
    console.error("Error creating enhanced route:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;