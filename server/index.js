import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

// ===== Import routes mises à jour =====
import companyRoutes from "./routes/companyRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; 

// ===== Pour __dirname en ES modules =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middlewares =====
app.use(cors({ origin: "*" }));
app.use(express.json());

// ===== Create uploads folder if not exists =====
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ===== Serve static files (logos) =====
app.use("/uploads", express.static(uploadDir));

// ===== SERVIR LE FRONTEND REACT =====
app.use(express.static(path.join(__dirname, '../client/build')));

// ===== Routes API =====
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "ChapTicket API is running" });
});

app.use("/api/companies", companyRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/schedules", scheduleRoutes);
//app.use("/api/auth", authRoutes);

// ===== TOUTES LES AUTRES ROUTES RENVOIENT VERS REACT (CORRIGÉ) =====
app.get('*', (req, res) => {
  // Servir index.html pour le routing React
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// ===== Database + Server start =====
async function start() {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn("⚠️ MONGODB_URI non défini — démarrage sans DB");
    } else {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("✅ MongoDB connecté");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Serveur lancé sur le port ${PORT}`);
      console.log(`🌐 Frontend React servi depuis /client/build`);
    });
  } catch (err) {
    console.error("❌ Erreur au démarrage :", err);
    process.exit(1);
  }
}

start();