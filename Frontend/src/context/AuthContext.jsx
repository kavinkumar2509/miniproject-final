import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("sih_auth_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Failed to parse saved auth user:", e);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("sih_auth_token") || null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      // 1. Attempt API authentication with backend
      try {
        const res = await loginUser({ username, password });
        if (res?.data?.success && res.data.user) {
          const authUser = res.data.user;
          const authToken = res.data.token;
          setUser(authUser);
          setToken(authToken);
          localStorage.setItem("sih_auth_user", JSON.stringify(authUser));
          localStorage.setItem("sih_auth_token", authToken);
          setLoading(false);
          return { success: true, user: authUser };
        }
      } catch (apiErr) {
        console.warn("API login attempt failed, checking client fallback:", apiErr);
      }

      // 2. Client-side fallback authentication (guarantees offline & demo functionality)
      const cleanUser = username.trim().toLowerCase();
      const DEMO_ACCOUNTS = {
        admin: {
          pass: "admin123",
          name: "System Administrator",
          role: "District Healthcare Admin",
          department: "Directorate of Public Health",
          badge: "Full Clearance"
        },
        officer: {
          pass: "health2026",
          name: "Dr. Kavin Kumar",
          role: "Chief Epidemiological Officer",
          department: "Epidemic Surveillance Division",
          badge: "Level 4 Clearance"
        },
        kavin: {
          pass: "kavin123",
          name: "Kavin Kumar",
          role: "Field Health Surveillance Lead",
          department: "Community Health Taskforce",
          badge: "Field Operations"
        },
        hcw: {
          pass: "hcw2026",
          name: "Community Health Worker",
          role: "Field Healthcare Responder",
          department: "Rural Health Outpost",
          badge: "Field Officer"
        }
      };

      const matched = DEMO_ACCOUNTS[cleanUser];
      if (matched && matched.pass === password) {
        const authUser = {
          id: `usr-${cleanUser}`,
          username: cleanUser,
          name: matched.name,
          role: matched.role,
          department: matched.department,
          badge: matched.badge,
          loginTime: new Date().toISOString()
        };
        const authToken = `sih-demo-token-${cleanUser}-${Date.now()}`;
        setUser(authUser);
        setToken(authToken);
        localStorage.setItem("sih_auth_user", JSON.stringify(authUser));
        localStorage.setItem("sih_auth_token", authToken);
        setLoading(false);
        return { success: true, user: authUser };
      } else if (!matched && password.length >= 4) {
        // Accept custom credentials with password >= 4 chars
        const authUser = {
          id: `usr-${cleanUser}`,
          username: cleanUser,
          name: username.charAt(0).toUpperCase() + username.slice(1),
          role: "Epidemiological Officer",
          department: "District Surveillance Unit",
          badge: "Active Session",
          loginTime: new Date().toISOString()
        };
        const authToken = `sih-demo-token-${cleanUser}-${Date.now()}`;
        setUser(authUser);
        setToken(authToken);
        localStorage.setItem("sih_auth_user", JSON.stringify(authUser));
        localStorage.setItem("sih_auth_token", authToken);
        setLoading(false);
        return { success: true, user: authUser };
      }

      setLoading(false);
      return {
        success: false,
        error: "Invalid credentials. Use demo account: officer / health2026"
      };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message || "Authentication error" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("sih_auth_user");
    localStorage.removeItem("sih_auth_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
