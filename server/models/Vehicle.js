// server/models/Vehicle.js
import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    plateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    brand: {
      type: String,
      required: true,
      trim: true
    },
    model: {
      type: String,
      required: true,
      trim: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    vehicleType: {
      type: String,
      enum: ["bus", "minicar", "van", "other"],
      default: "bus"
    },
    year: {
      type: Number,
      min: 1990,
      max: 2024
    },
    color: {
      type: String,
      trim: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    status: {
      type: String,
      enum: ["active", "maintenance", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;