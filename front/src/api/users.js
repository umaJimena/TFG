import { api } from "./client";

export const updateMe = async (updates) => {
  const res = await api.patch("/api/users/me", updates);
  return res.data;
};

export const setRole = async (role) => {
  const res = await api.post("/api/users/me/role", { role });
  return res.data;
};
