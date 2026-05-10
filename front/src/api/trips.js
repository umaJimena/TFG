import { api } from "./client";

export const fetchMyTrips = async () => {
  const res = await api.get("/api/trips/mine");
  return res.data;
};

export const searchTrips = async (params) => {
  const res = await api.get("/api/trips/search", { params });
  return res.data;
};

export const fetchTrip = async (id) => {
  const res = await api.get(`/api/trips/${id}`);
  return res.data;
};

export const createTrip = async (data) => {
  const res = await api.post("/api/trips", data);
  return res.data;
};

export const reserveTrip = async (id) => {
  const res = await api.post(`/api/trips/${id}/reserve`);
  return res.data;
};

export const cancelReservation = async (id) => {
  const res = await api.delete(`/api/trips/${id}/reserve`);
  return res.data;
};

export const cancelTrip = async (id) => {
  const res = await api.delete(`/api/trips/${id}`);
  return res.data;
};
