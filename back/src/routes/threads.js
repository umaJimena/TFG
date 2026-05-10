const express = require("express");
const {
  getMyThreads,
  getThread,
  sendMessage,
} = require("../controllers/threadController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", getMyThreads);
router.get("/:id", getThread);
router.post("/:id/messages", sendMessage);

module.exports = router;
