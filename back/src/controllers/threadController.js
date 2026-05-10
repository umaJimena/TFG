const Thread = require("../models/Thread");

const MEMBER_FIELDS = "name surname avatarColor";
const TRIP_FIELDS = "from to status departTime returnTime days";

const getMyThreads = async (req, res) => {
  try {
    const threads = await Thread.find({ members: req.userId })
      .populate({ path: "trip", select: TRIP_FIELDS })
      .populate("members", MEMBER_FIELDS)
      .sort("-updatedAt")
      .lean();

    const enriched = threads
      .filter((t) => t.trip && t.trip.status === "active")
      .map((t) => {
        const last = t.messages?.[t.messages.length - 1];
        return {
          _id: t._id,
          trip: t.trip,
          members: t.members,
          messageCount: t.messages?.length || 0,
          lastMessage: last
            ? {
                text: last.text,
                from: last.from,
                createdAt: last.createdAt,
                system: last.system,
              }
            : null,
          updatedAt: t.updatedAt,
        };
      });

    return res.json({ threads: enriched });
  } catch (err) {
    console.error("[getMyThreads]", err);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const getThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id)
      .populate("trip", TRIP_FIELDS)
      .populate("members", MEMBER_FIELDS)
      .populate("messages.from", MEMBER_FIELDS);
    if (!thread)
      return res.status(404).json({ message: "Conversacion no encontrada" });
    if (!thread.members.some((m) => String(m._id) === String(req.userId))) {
      return res
        .status(403)
        .json({ message: "No formas parte de esta conversacion" });
    }
    return res.json({ thread });
  } catch (err) {
    console.error("[getThread]", err);
    return res.status(400).json({ message: err.message || "Error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "El mensaje esta vacio" });
    }
    const thread = await Thread.findById(req.params.id);
    if (!thread)
      return res.status(404).json({ message: "Conversacion no encontrada" });
    if (!thread.members.some((m) => String(m) === String(req.userId))) {
      return res.status(403).json({ message: "No formas parte de esta conversacion" });
    }
    thread.messages.push({ from: req.userId, text: text.trim() });
    await thread.save();

    const populated = await Thread.findById(thread._id).populate(
      "messages.from",
      MEMBER_FIELDS
    );
    const message = populated.messages[populated.messages.length - 1];
    return res.status(201).json({ message });
  } catch (err) {
    console.error("[sendMessage]", err);
    return res.status(400).json({ message: err.message || "Error" });
  }
};

module.exports = { getMyThreads, getThread, sendMessage };
