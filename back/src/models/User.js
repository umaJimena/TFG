const mongoose = require("mongoose");
const { Schema } = mongoose;

const carSchema = new Schema(
  {
    plate: { type: String, trim: true },
    make: { type: String, trim: true },
    color: { type: String, trim: true },
    seats: { type: Number, min: 1, max: 8 },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email no valido"],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    emailVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String, select: false },

    role: {
      type: String,
      enum: ["passenger", "driver"],
    },

    name: { type: String, trim: true },
    surname: { type: String, trim: true },
    birthDate: { type: Date },
    gender: { type: String, enum: ["female", "male"] },
    dni: { type: String, trim: true },

    car: { type: carSchema },

    preferences: { type: String, trim: true, default: "" },

    avatarColor: { type: String, default: "#E9B949" },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    tripsCount: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.toAuthJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.emailVerificationCode;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
