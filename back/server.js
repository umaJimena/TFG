require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const healthRouter = require("./src/routes/health");
const authRouter = require("./src/routes/auth");
const usersRouter = require("./src/routes/users");
const tripsRouter = require("./src/routes/trips");
const threadsRouter = require("./src/routes/threads");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/trips", tripsRouter);
app.use("/api/threads", threadsRouter);

app.get("/", (req, res) => {
  res.send("Servidor Conect_Car funcionando. Prueba GET /api/health");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
