// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// ===== Import routes mises à jour =====
import companyRoutes from "./routes/companyRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; 

// ===== Middlewares =====
app.use(cors({ origin: "*" }));
app.use(express.json());

// ===== Create uploads folder if not exists =====
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ===== Serve static files (logos) =====
app.use("/uploads", express.static(uploadDir));

// ===== Routes =====
app.get("/", (req, res) => res.send("🚀 Transport Ticketing API Ready"));
app.use("/api/companies", companyRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/schedules", scheduleRoutes);
//app.use("/api/auth", authRoutes);

// ===== Database + Server start =====
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
      console.log(`🚀 Serveur lancé : http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Erreur au démarrage :", err);
    process.exit(1);
  }
}

start();
