import { api } from "./client";

export const register = async (data) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};

export const login = async (data) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

export const verifyEmail = async (code) => {
  const res = await api.post("/api/auth/verify-email", { code });
  return res.data;
};

export const fetchMe = async () => {
  const res = await api.get("/api/auth/me");
  return res.data;
};

export const resendCode = async () => {
  const res = await api.post("/api/auth/resend-code");
  return res.data;
};
