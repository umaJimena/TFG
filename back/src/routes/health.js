const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: "desconectado",
    1: "conectado",
    2: "conectando",
    3: "desconectando",
  };
  res.json({
    status: "ok",
    message: "Servidor Conect_Car funcionando",
    db: dbStates[dbState] || "desconocido",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
