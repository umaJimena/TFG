import { api } from "./client";

export { api };
export { saveToken, loadToken, clearToken } from "./storage";
export { register, login, verifyEmail, fetchMe, resendCode } from "./auth";
export { updateMe, setRole } from "./users";
export {
  fetchMyTrips,
  searchTrips,
  fetchTrip,
  createTrip,
  reserveTrip,
  cancelReservation,
  cancelTrip,
} from "./trips";
export { fetchMyThreads, fetchThread, sendMessage } from "./threads";

export const checkHealth = async () => {
  const { data } = await api.get("/api/health");
  return data;
};
