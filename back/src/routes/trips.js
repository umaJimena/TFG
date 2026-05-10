const express = require("express");
const {
  createTrip,
  getMyTrips,
  searchTrips,
  getTrip,
  reserveTrip,
  cancelReservation,
  cancelTrip,
} = require("../controllers/tripController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.post("/", createTrip);
router.get("/mine", getMyTrips);
router.get("/search", searchTrips);
router.get("/:id", getTrip);
router.post("/:id/reserve", reserveTrip);
router.delete("/:id/reserve", cancelReservation);
router.delete("/:id", cancelTrip);

module.exports = router;
