import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";
import * as usersApi from "../api/users";
import { clearToken, loadToken, saveToken } from "../api/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await loadToken();
        if (!token) return;
        const { user } = await authApi.fetchMe();
        setUser(user);
      } catch (err) {
        console.warn("[auth] no se pudo restaurar sesion:", err?.message);
        await clearToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const register = useCallback(async (data) => {
    const res = await authApi.register(data);
    await saveToken(res.token);
    setUser(res.user);
    return res;
  }, []);

  const login = useCallback(async (data) => {
    const res = await authApi.login(data);
    await saveToken(res.token);
    setUser(res.user);
    return res;
  }, []);

  const verifyEmail = useCallback(async (code) => {
    const { user } = await authApi.verifyEmail(code);
    setUser(user);
    return user;
  }, []);

  const updateMe = useCallback(async (updates) => {
    const { user } = await usersApi.updateMe(updates);
    setUser(user);
    return user;
  }, []);

  const setRole = useCallback(async (role) => {
    const { user } = await usersApi.setRole(role);
    setUser(user);
    return user;
  }, []);

  const refresh = useCallback(async () => {
    const { user } = await authApi.fetchMe();
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    await clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, verifyEmail, updateMe, setRole, refresh, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
