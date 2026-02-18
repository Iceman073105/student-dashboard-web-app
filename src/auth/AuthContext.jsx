import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const USERS_KEY = "sd_users_v1";
const SESSION_KEY = "sd_session_v1";

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) ?? null;
  } catch {
    return null;
  }
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSession());

  const signup = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { ok: false, message: "Email and password are required." };
    }
    if (password.length < 6) {
      return { ok: false, message: "Password must be at least 6 characters." };
    }

    const users = loadUsers();
    const exists = users.some((u) => u.email === cleanEmail);
    if (exists) return { ok: false, message: "That email is already registered." };

    const newUser = {
      id: crypto.randomUUID(),
      email: cleanEmail,
      // MVP ONLY: plaintext password. We’ll note this in documentation.
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const session = { id: newUser.id, email: newUser.email };
    saveSession(session);
    setUser(session);

    return { ok: true };
  };

  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { ok: false, message: "Email and password are required." };
    }

    const users = loadUsers();
    const found = users.find((u) => u.email === cleanEmail && u.password === password);
    if (!found) return { ok: false, message: "Invalid email or password." };

    const session = { id: found.id, email: found.email };
    saveSession(session);
    setUser(session);

    return { ok: true };
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const value = useMemo(() => ({ user, signup, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
