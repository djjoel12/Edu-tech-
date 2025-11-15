import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: true,
      trim: true,
    },
    schoolType: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Ajoutez unique pour éviter les doublons d'email
    },
    director: {
      type: String,
      required: true,
      trim: true,
    },
    creationYear: {
      type: Number,
    },
    accreditationNumber: {
      type: String,
      trim: true,
    },
    logo: {
      type: String, // Champ pour stocker le chemin du logo
      trim: true,
    },
  },
  { timestamps: true }
);

const School = mongoose.model("School", schoolSchema);

export default School;                                              