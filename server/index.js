// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// ===== Import des routes =====
import schoolRoutes from "./routes/schoolRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // ✅ ajout

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

// ===== Middleware =====
app.use(cors({ origin: "*" }));
app.use(express.json());

// ===== Créer automatiquement le dossier uploads s'il n'existe pas =====
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ===== Servir les fichiers statiques (logos) =====
app.use("/uploads", express.static(uploadDir));

// ===== Routes =====
app.get("/", (req, res) => res.send("SaaS École — API OK 🚀"));
app.use("/api", schoolRoutes);
app.use("/api/auth", authRoutes); // ✅ ajout de la route d’authentification

// ===== Démarrage serveur + connexion MongoDB =====
async function start() {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn("⚠️ MONGODB_URI non défini — démarrage sans DB");
    } else {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ MongoDB connecté");
    }

    app.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Erreur au démarrage :", err);
    process.exit(1);
  }
}

start();
