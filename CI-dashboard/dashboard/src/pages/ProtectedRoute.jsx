import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("userRole");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
