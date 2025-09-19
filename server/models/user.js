// models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "director" }, // ou "admin", "teacher", etc.
  },
  { timestamps: true }
);

// index unique sur email (assure l'unicité au niveau Mongo)
userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
