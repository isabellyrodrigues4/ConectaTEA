// src/contexts/AuthContext.jsx
import React, { createContext, useEffect, useState, useContext } from "react";
import api from "../api/axios"; // importa o axios já configurado

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // sempre que token mudar → sincroniza com axios
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // sempre que user mudar → salvar no localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Função de signup
  const signup = async ({ name, email, password }) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await api.post("/auth/signup", { name, email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      return { ok: true };
    } catch (err) {
      const message = err.response?.data?.message || "Erro ao cadastrar";
      setAuthError(message);
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Função de login
  const login = async ({ email, password }) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      return { ok: true };
    } catch (err) {
      const message = err.response?.data?.message || "Erro ao entrar";
      setAuthError(message);
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, authError, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
