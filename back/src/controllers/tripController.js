const Trip = require("../models/Trip");
const User = require("../models/User");
const Thread = require("../models/Thread");

const DRIVER_FIELDS = "name surname avatarColor rating tripsCount car role";
const PASSENGER_FIELDS = "name surname avatarColor";

const createTrip = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    if (user.role !== "driver") {
      return res.status(403).json({
        message: "Solo los conductores pueden publicar trayectos",
      });
    }
    if (!user.car || !user.car.seats) {
      return res.status(400).json({
        message: "Completa los datos de tu coche en el perfil",
      });
    }

    const {
      from,
      to,
      departTime,
      arriveTime,
      returnTime,
      days,
      seatsTotal,
      perDay,
      distanceKm,
      durationMin,
    } = req.body;

    if (!from || !to || !departTime || !days?.length || !seatsTotal || perDay == null) {
      return res.status(400).json({
        message: "Faltan campos obligatorios (from, to, departTime, days, seatsTotal, perDay)",
      });
    }
    if (seatsTotal > user.car.seats) {
      return res.status(400).json({
        message: `Tu coche solo tiene ${user.car.seats} plazas disponibles`,
      });
    }

    const trip = await Trip.create({
      driver: req.userId,
      from,
      to,
      departTime,
      arriveTime,
      returnTime,
      days,
      seatsTotal,
      perDay,
      distanceKm,
      durationMin,
    });

    await Thread.create({
      trip: trip._id,
      members: [trip.driver],
      messages: [
        {
          text: `Trayecto publicado · ${from} → ${to}`,
          system: true,
        },
      ],
    });

    const populated = await Trip.findById(trip._id)
      .populate("driver", DRIVER_FIELDS)
      .populate("passengers", PASSENGER_FIELDS);

    return res.status(201).json({ trip: populated });
  } catch (err) {
    console.error("[createTrip]", err);
    return res.status(400).json({ message: err.message || "Error del servidor" });
  }
};

const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      status: "active",
      $or: [{ driver: req.userId }, { passengers: req.userId }],
    })
      .populate("driver", DRIVER_FIELDS)
      .populate("passengers", PASSENGER_FIELDS)
      .sort("-createdAt");
    return res.json({ trips });
  } catch (err) {
    console.error("[getMyTrips]", err);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const searchTrips = async (req, res) => {
  try {
    const { from, to, days } = req.query;
    const filter = {
      status: "active",
      driver: { $ne: req.userId },
      passengers: { $ne: req.userId },
    };
    if (from) filter.from = new RegExp(escapeRegex(from), "i");
    if (to) filter.to = new RegExp(escapeRegex(to), "i");
    if (days) {
      const arr = String(days).split(",").map((d) => d.trim()).filter(Boolean);
      if (arr.length) filter.days = { $in: arr };
    }

    const trips = await Trip.find(filter)
      .populate("driver", DRIVER_FIELDS)
      .populate("passengers", PASSENGER_FIELDS)
      .sort("-createdAt")
      .limit(50);

    const available = trips.filter(
      (t) => (t.passengers?.length || 0) < t.seatsTotal
    );
    return res.json({ trips: available });
  } catch (err) {
    console.error("[searchTrips]", err);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("driver", DRIVER_FIELDS)
      .populate("passengers", PASSENGER_FIELDS);
    if (!trip) return res.status(404).json({ message: "Trayecto no encontrado" });

    const thread = await Thread.findOne({ trip: trip._id }).select("_id");
    const out = trip.toObject();
    out.threadId = thread?._id || null;
    return res.json({ trip: out });
  } catch (err) {
    console.error("[getTrip]", err);
    return res.status(400).json({ message: err.message || "Error del servidor" });
  }
};

const reserveTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trayecto no encontrado" });
    if (trip.status !== "active") {
      return res.status(400).json({ message: "Trayecto no disponible" });
    }
    if (trip.driver.toString() === req.userId) {
      return res.status(400).json({
        message: "No puedes reservar tu propio trayecto",
      });
    }
    if (trip.passengers.some((p) => p.toString() === req.userId)) {
      return res.status(409).json({ message: "Ya estas en este trayecto" });
    }
    if (trip.passengers.length >= trip.seatsTotal) {
      return res.status(409).json({ message: "Trayecto completo" });
    }
    trip.passengers.push(req.userId);
    await trip.save();

    const thread = await Thread.findOne({ trip: trip._id });
    if (thread && !thread.members.some((m) => String(m) === String(req.userId))) {
      thread.members.push(req.userId);
      thread.messages.push({
        text: "Se ha unido al trayecto",
        from: req.userId,
        system: true,
      });
      await thread.save();
    }

    const populated = await Trip.findById(trip._id)
      .populate("driver", DRIVER_FIELDS)
      .populate("passengers", PASSENGER_FIELDS);
    return res.json({ trip: populated });
  } catch (err) {
    console.error("[reserveTrip]", err);
    return res.status(400).json({ message: err.message || "Error del servidor" });
  }
};

const cancelReservation = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trayecto no encontrado" });
    const wasMember = trip.passengers.some(
      (p) => p.toString() === req.userId
    );
    trip.passengers = trip.passengers.filter(
      (p) => p.toString() !== req.userId
    );
    await trip.save();

    if (wasMember) {
      const thread = await Thread.findOne({ trip: trip._id });
      if (thread) {
        thread.members = thread.members.filter(
          (m) => String(m) !== String(req.userId)
        );
        thread.messages.push({
          text: "Ha dejado el trayecto",
          from: req.userId,
          system: true,
        });
        await thread.save();
      }
    }

    const populated = await Trip.findById(trip._id)
      .populate("driver", DRIVER_FIELDS)
      .populate("passengers", PASSENGER_FIELDS);
    return res.json({ trip: populated });
  } catch (err) {
    console.error("[cancelReservation]", err);
    return res.status(400).json({ message: err.message || "Error del servidor" });
  }
};

const cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trayecto no encontrado" });
    if (trip.driver.toString() !== req.userId) {
      return res.status(403).json({
        message: "Solo el conductor puede cancelar el trayecto",
      });
    }
    trip.status = "cancelled";
    await trip.save();
    return res.json({ trip });
  } catch (err) {
    console.error("[cancelTrip]", err);
    return res.status(400).json({ message: err.message || "Error del servidor" });
  }
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = {
  createTrip,
  getMyTrips,
  searchTrips,
  getTrip,
  reserveTrip,
  cancelReservation,
  cancelTrip,
};
