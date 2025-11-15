import express from 'express';
const router = express.Router();

// Route de test
router.post("/signup", (req, res) => {
  console.log("Requête reçue:", req.body);
  res.json({ message: "Route signup OK ✅" });
});

// Exportez le router
export default router;