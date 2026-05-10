const mongoose = require("mongoose");
const { Schema } = mongoose;

const tripSchema = new Schema(
  {
    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    passengers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },

    departTime: { type: String, required: true },
    arriveTime: { type: String, trim: true },
    returnTime: { type: String, trim: true },

    days: {
      type: [String],
      enum: ["L", "M", "X", "J", "V", "S", "D"],
      required: true,
      validate: [
        (arr) => Array.isArray(arr) && arr.length > 0,
        "Debes seleccionar al menos un dia",
      ],
    },

    seatsTotal: { type: Number, required: true, min: 1, max: 8 },
    perDay: { type: Number, required: true, min: 0 },

    distanceKm: { type: Number, min: 0 },
    durationMin: { type: Number, min: 0 },

    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tripSchema.virtual("seatsTaken").get(function () {
  return this.passengers ? this.passengers.length : 0;
});

tripSchema.virtual("seatsAvailable").get(function () {
  const total = this.seatsTotal || 0;
  const taken = this.passengers ? this.passengers.length : 0;
  return Math.max(0, total - taken);
});

tripSchema.virtual("monthlyEstimate").get(function () {
  const daysPerWeek = this.days?.length || 5;
  const daysPerMonth = Math.round(daysPerWeek * 4.33);
  return Number(((this.perDay || 0) * daysPerMonth).toFixed(2));
});

module.exports = mongoose.model("Trip", tripSchema);
