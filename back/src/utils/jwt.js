const jwt = require("jsonwebtoken");

const TOKEN_EXPIRY = "7d";

const signToken = (userId) =>
  jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { signToken, verifyToken };
