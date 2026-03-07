import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ReadOnlyMainpage from "./pages/ReadOnlyMainPage";
import ProtectedRoute from "./pages/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Routes based on role */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="superadmin">
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/read"
        element={
          <ProtectedRoute allowedRole="admin">
            <ReadOnlyMainpage />
          </ProtectedRoute>
        }
      />
      {/* Default */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
