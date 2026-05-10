const TONES = ["mustard", "leaf", "coral"];

const initials = (u) => {
  const n = (u?.name?.[0] || "").toUpperCase();
  const s = (u?.surname?.[0] || "").toUpperCase();
  return (n + s) || "?";
};

const fullName = (u) =>
  `${u?.name || ""} ${u?.surname || ""}`.trim() || "Sin nombre";

const carLabel = (car) => {
  if (!car) return "";
  const parts = [car.make, car.color].filter(Boolean);
  return parts.join(" · ");
};

export const adaptTrip = (apiTrip, currentUserId, index = 0) => {
  const driver = apiTrip.driver || {};
  const isMyTrip = String(driver._id) === String(currentUserId);
  const passengers = (apiTrip.passengers || []).map((p) => ({
    id: p._id,
    avatar: initials(p),
    color: p.avatarColor || "#E9B949",
  }));

  return {
    id: apiTrip._id,
    tone: TONES[index % TONES.length],
    role: isMyTrip ? "driver" : "passenger",
    driver: {
      id: driver._id,
      avatar: initials(driver),
      color: driver.avatarColor || "#E9B949",
      name: fullName(driver),
      rating: driver.rating ?? 5.0,
      trips: driver.tripsCount ?? 0,
      car: carLabel(driver.car),
    },
    from: apiTrip.from,
    to: apiTrip.to,
    depart: apiTrip.departTime || "",
    arrive: apiTrip.arriveTime || "",
    returnTime: apiTrip.returnTime || "",
    days: apiTrip.days || [],
    seatsTaken: passengers.length,
    seatsTotal: apiTrip.seatsTotal,
    passengers,
    monthly: apiTrip.monthlyEstimate || 0,
    perDay: apiTrip.perDay || 0,
    nextDate: "Proximo trayecto",
    distanceKm: apiTrip.distanceKm || 0,
    durationMin: apiTrip.durationMin || 0,
  };
};
