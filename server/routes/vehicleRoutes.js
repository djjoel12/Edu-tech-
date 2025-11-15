// server/routes/vehicleRoutes.js
import express from "express";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();

// GET tous les véhicules d'une compagnie
router.get("/", async (req, res) => {
  try {
    const { companyId } = req.query;
    const vehicles = await Vehicle.find({ companyId });
    res.json(vehicles);
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST nouveau véhicule
router.post("/", async (req, res) => {
  try {
    const vehicleData = req.body;
    
    // Vérifier si l'immatriculation existe déjà
    const existingVehicle = await Vehicle.findOne({ 
      plateNumber: vehicleData.plateNumber 
    });
    
    if (existingVehicle) {
      return res.status(400).json({
        message: "Un véhicule avec cette immatriculation existe déjà"
      });
    }

    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();

    res.status(201).json({
      message: "Véhicule créé avec succès",
      vehicle
    });
  } catch (err) {
    console.error("Error creating vehicle:", err);
    
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Immatriculation déjà utilisée"
      });
    }
    
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;