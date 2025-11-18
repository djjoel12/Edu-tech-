// server/models/Schedule.js
import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    departureTime: {
      type: String, // Format "HH:MM"
      required: true
    },
    arrivalTime: {
      type: String, // Format "HH:MM"
      required: true
    },
    daysOfWeek: [{
      type: String,
      enum: ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"],
      required: true
    }],
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle"
    },
    availableSeats: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active"
    }
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;