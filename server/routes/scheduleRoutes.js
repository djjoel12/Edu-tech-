// server/routes/scheduleRoutes.js
import express from "express";
import Schedule from "../models/Schedule.js";

const router = express.Router();

// GET tous les horaires d'une compagnie
router.get("/", async (req, res) => {
  try {
    const { companyId, routeId } = req.query;
    const query = { companyId };
    
    if (routeId) {
      query.routeId = routeId;
    }
    
    const schedules = await Schedule.find(query)
      .populate("routeId")
      .populate("vehicleId");
    
    res.json(schedules);
  } catch (err) {
    console.error("Error fetching schedules:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST nouvel horaire
router.post("/", async (req, res) => {
  try {
    const scheduleData = req.body;
    
    // Vérifier les conflits d'horaire
    const conflictingSchedule = await Schedule.findOne({
      routeId: scheduleData.routeId,
      departureTime: scheduleData.departureTime,
      daysOfWeek: { $in: scheduleData.daysOfWeek }
    });
    
    if (conflictingSchedule) {
      return res.status(400).json({
        message: "Un horaire existe déjà pour cette route à cette heure"
      });
    }

    const schedule = new Schedule(scheduleData);
    await schedule.save();
    
    // Populer les références pour la réponse
    await schedule.populate("routeId vehicleId");

    res.status(201).json({
      message: "Horaire créé avec succès",
      schedule
    });
  } catch (err) {
    console.error("Error creating schedule:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;