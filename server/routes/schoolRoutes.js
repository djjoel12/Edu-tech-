import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import School from "../models/school.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// Route POST avec logo optionnel
router.post("/register", upload.single("logo"), async (req, res) => {
  try {
    const {
      schoolName,
      schoolType,
      address,
      postalCode,
      city,
      phone,
      email,
      director,
      creationYear,
      accreditationNumber,
    } = req.body;

    const schoolData = {
      schoolName,
      schoolType,
      address,
      postalCode,
      city,
      phone,
      email,
      director,
      creationYear,
      accreditationNumber,
      logo: req.file ? req.file.path : null,
    };

    const school = new School(schoolData);
    await school.save();
    res.status(201).json({ message: "École créée", school });
  } catch (err) {
    console.error("Error saving school:", err);
    // gestion de duplication email
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

export default router;
