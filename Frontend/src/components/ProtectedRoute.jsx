import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = true }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (adminOnly && !isAuthenticated) {
    // Redirect to login page and preserve requested destination
    return <Navigate to="/login" state={{ from: location, message: "Administrative authorization required." }} replace />;
  }

  return children;
}
