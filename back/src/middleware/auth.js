const { verifyToken } = require("../utils/jwt");

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }
  try {
    const payload = verifyToken(header.slice(7));
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalido o expirado" });
  }
};

module.exports = { requireAuth };
