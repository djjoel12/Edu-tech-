// routes/companyRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Company from "../models/Company.js";

const router = express.Router();

// === UPLOAD LOGO CONFIG ===
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({ storage });

// === REGISTER COMPANY ===
router.post("/register", upload.single("logo"), async (req, res) => {
  try {
    const {
      companyName,
      companyType,
      address,
      city,
      country,
      phone,
      email,
      password,
      ceoName,
      yearFounded,
      transportLicense,
    } = req.body;

    // Vérifier si la compagnie existe déjà
    const existingCompany = await Company.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingCompany) {
      return res.status(400).json({
        message: "Une compagnie avec cet email ou téléphone existe déjà"
      });
    }

    const companyData = {
      companyName,
      companyType,
      address,
      city,
      country,
      phone,
      email,
      password,
      ceoName,
      yearFounded,
      transportLicense,
      logo: req.file ? `/uploads/${req.file.filename}` : null,
    };

    const company = new Company(companyData);
    await company.save();

    // Retourner les infos sans le mot de passe
    const companyResponse = {
      id: company._id,
      companyName: company.companyName,
      email: company.email,
      phone: company.phone,
      city: company.city,
      logo: company.logo,
      companyType: company.companyType,
      isVerified: company.isVerified
    };

    res.status(201).json({ 
      message: "Compagnie créée avec succès", 
      company: companyResponse 
    });
  } catch (err) {
    console.error("Error saving company:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Téléphone ou Email déjà utilisé"
      });
    }

    res.status(500).json({ message: "Erreur interne serveur" });
  }
});

// === LOGIN COMPANY ===
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Vérifier si l'email existe
    const company = await Company.findOne({ email }).select('+password');
    if (!company) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    // 2) Vérifier le mot de passe
    const isPasswordCorrect = await company.correctPassword(password, company.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    // 3) Si tout est bon, envoyer la réponse
    const companyResponse = {
      id: company._id,
      companyName: company.companyName,
      email: company.email,
      phone: company.phone,
      city: company.city,
      logo: company.logo,
      companyType: company.companyType,
      isVerified: company.isVerified
    };

    res.json({
      message: "Connexion réussie",
      company: companyResponse
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Erreur interne serveur" });
  }
});

// === GET COMPANY PROFILE ===
router.get("/profile/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Compagnie non trouvée" });
    }

    const companyResponse = {
      id: company._id,
      companyName: company.companyName,
      email: company.email,
      phone: company.phone,
      city: company.city,
      address: company.address,
      logo: company.logo,
      companyType: company.companyType,
      ceoName: company.ceoName,
      yearFounded: company.yearFounded,
      transportLicense: company.transportLicense,
      isVerified: company.isVerified
    };

    res.json({ company: companyResponse });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Erreur interne serveur" });
  }
});

export default router;