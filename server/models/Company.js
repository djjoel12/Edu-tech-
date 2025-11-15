// models/Company.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyType: {
      type: String,
      trim: true,
      default: "transport",
    },
    country: {
      type: String,
      default: "Côte d'Ivoire",
    },
    city: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    ceoName: {
      type: String,
      required: true,
      trim: true,
    },
    yearFounded: Number,
    transportLicense: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password avant sauvegarde
companySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode pour vérifier le password
companySchema.methods.correctPassword = async function (candidatePassword, companyPassword) {
  return await bcrypt.compare(candidatePassword, companyPassword);
};

const Company = mongoose.model("Company", companySchema);
export default Company;