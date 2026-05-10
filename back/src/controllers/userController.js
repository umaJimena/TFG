const User = require("../models/User");

const ALLOWED_FIELDS = [
  "name",
  "surname",
  "birthDate",
  "gender",
  "dni",
  "car",
  "preferences",
  "avatarColor",
];

const updateMe = async (req, res) => {
  try {
    const updates = {};
    for (const key of ALLOWED_FIELDS) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json({ user: user.toAuthJSON() });
  } catch (err) {
    console.error("[updateMe]", err);
    return res.status(400).json({ message: err.message || "Error del servidor" });
  }
};

const setRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["passenger", "driver"].includes(role)) {
      return res
        .status(400)
        .json({ message: "role debe ser 'passenger' o 'driver'" });
    }
    const user = await User.findById(req.userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    if (user.role) {
      return res.status(409).json({
        message: "El rol ya esta establecido y no se puede cambiar",
      });
    }
    user.role = role;
    await user.save();
    return res.json({ user: user.toAuthJSON() });
  } catch (err) {
    console.error("[setRole]", err);
    return res
      .status(500)
      .json({ message: err.message || "Error del servidor" });
  }
};

module.exports = { updateMe, setRole };
