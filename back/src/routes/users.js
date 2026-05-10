const express = require("express");
const { updateMe, setRole } = require("../controllers/userController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.patch("/me", requireAuth, updateMe);
router.post("/me/role", requireAuth, setRole);

module.exports = router;
