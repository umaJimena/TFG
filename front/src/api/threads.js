import { api } from "./client";

export const fetchMyThreads = async () => {
  const res = await api.get("/api/threads");
  return res.data;
};

export const fetchThread = async (id) => {
  const res = await api.get(`/api/threads/${id}`);
  return res.data;
};

export const sendMessage = async (id, text) => {
  const res = await api.post(`/api/threads/${id}/messages`, { text });
  return res.data;
};
