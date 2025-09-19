// routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérifier si email existe déjà
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email déjà utilisé" });

    // Hasher le mot de passe
    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed, role: "director" });
    await user.save();

    // Générer token JWT
    const secret = process.env.JWT_SECRET || "replace_with_a_real_secret";
    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: "7d" });

    return res.status(201).json({ token });
  } catch (err) {
    console.error("Erreur signup:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }
    return res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

export default router;
