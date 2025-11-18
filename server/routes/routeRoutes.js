// server/routes/routeRoutes.js
import express from "express";
import Route from "../models/Route.js";

const router = express.Router();

// GET toutes les routes avec les infos de la compagnie
router.get("/", async (req, res) => {
  try {
    console.log("📡 Requête GET /api/routes reçue");
    
    // Récupérer tous les trajets avec les infos de la compagnie
    const routes = await Route.find({})
      .populate("companyId", "companyName logo email phone") // Peupler seulement les champs nécessaires
      .exec();
    
    console.log(`✅ ${routes.length} trajets trouvés avec infos compagnie`);
    
    res.json(routes);
  } catch (err) {
    console.error("❌ Error fetching routes:", err);
    res.status(500).json({ message: "Erreur serveur: " + err.message });
  }
});

// ... le reste de votre code reste inchangé

// GET routes par compagnie
router.get("/company/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;
    const routes = await Route.find({ companyId });
    res.json(routes);
  } catch (err) {
    console.error("Error fetching company routes:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST nouvelle route
router.post("/", async (req, res) => {
  try {
    const routeData = req.body;
    
    console.log("📨 Données reçues:", routeData);

    // Vérifier si une route similaire existe déjà
    const existingRoute = await Route.findOne({
      companyId: routeData.companyId,
      departureCity: routeData.departureCity,
      arrivalCity: routeData.arrivalCity,
      departureTime: routeData.departureTime,
      routeType: routeData.routeType
    });
    
    if (existingRoute) {
      return res.status(400).json({
        message: "Une route similaire existe déjà pour cette heure et type"
      });
    }

    // Configurer automatiquement les features selon le type
    if (routeData.routeType === 'vip') {
      routeData.features = {
        wifi: true,
        airConditioning: true,
        snack: true,
        toilet: true
      };
    }

    const route = new Route(routeData);
    await route.save();

    console.log("✅ Nouveau trajet créé:", route);

    res.status(201).json({
      message: "Route créée avec succès",
      route
    });
  } catch (err) {
    console.error("❌ Error creating route:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT modifier une route
router.put("/:id", async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!route) {
      return res.status(404).json({ message: "Route non trouvée" });
    }

    res.json({
      message: "Route modifiée avec succès",
      route
    });
  } catch (err) {
    console.error("Error updating route:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE une route
router.delete("/:id", async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    
    if (!route) {
      return res.status(404).json({ message: "Route non trouvée" });
    }

    res.json({ message: "Route supprimée avec succès" });
  } catch (err) {
    console.error("Error deleting route:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;