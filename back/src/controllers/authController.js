const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email y password son obligatorios" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "La contrasena debe tener al menos 6 caracteres" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "El email ya esta registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationCode = generateCode();

    const user = await User.create({
      email,
      passwordHash,
      emailVerificationCode: verificationCode,
    });

    console.log(
      `[MOCK EMAIL] Codigo de verificacion para ${email}: ${verificationCode}`
    );

    const token = signToken(user._id);

    return res.status(201).json({
      user: user.toAuthJSON(),
      token,
      verificationCode,
    });
  } catch (err) {
    console.error("[register]", err);
    return res
      .status(500)
      .json({ message: err.message || "Error del servidor" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email y password son obligatorios" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordHash"
    );
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = signToken(user._id);
    return res.json({ user: user.toAuthJSON(), token });
  } catch (err) {
    console.error("[login]", err);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json({ user: user.toAuthJSON() });
  } catch (err) {
    console.error("[me]", err);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.userId).select(
      "+emailVerificationCode"
    );
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    if (user.emailVerified) {
      return res.json({
        user: user.toAuthJSON(),
        message: "Email ya verificado",
      });
    }
    if (!code || code !== user.emailVerificationCode) {
      return res.status(400).json({ message: "Codigo incorrecto" });
    }
    user.emailVerified = true;
    user.emailVerificationCode = undefined;
    await user.save();
    return res.json({ user: user.toAuthJSON() });
  } catch (err) {
    console.error("[verifyEmail]", err);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const resendVerificationCode = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    if (user.emailVerified) {
      return res.status(400).json({ message: "Email ya verificado" });
    }
    const verificationCode = generateCode();
    user.emailVerificationCode = verificationCode;
    await user.save();
    console.log(
      `[MOCK EMAIL] Codigo (reenviado) para ${user.email}: ${verificationCode}`
    );
    return res.json({ verificationCode });
  } catch (err) {
    console.error("[resendVerificationCode]", err);
    return res
      .status(500)
      .json({ message: err.message || "Error del servidor" });
  }
};

module.exports = { register, login, me, verifyEmail, resendVerificationCode };
