import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/auth/login`, form);

      // Destructure response data
      const { role, token, user } = res.data;

      // ✅ Store ALL required data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userRole", role);
      localStorage.setItem("isLoggedIn", "true");

      // ✅ Verify data was stored correctly
      console.log("✅ Login successful! Stored:", {
        token: localStorage.getItem("token"),
        user: localStorage.getItem("user"),
        role: localStorage.getItem("userRole"),
      });

      // Redirect based on role
      if (role === "superadmin") {
        navigate("/dashboard");
      } else if (role === "admin") {
        navigate("/read");
      } else {
        setError("Unauthorized user. Please contact admin.");
        localStorage.clear();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Bubble background */}
      <div className="bubble-layer">
        <span className="bubble b1" />
        <span className="bubble b2" />
        <span className="bubble b3" />
        <span className="bubble b4" />
        <span className="bubble b5" />
        <span className="bubble b6" />
        <span className="bubble b7" />
        <span className="bubble b8" />
        <span className="bubble b9" />
        <span className="bubble b10" />
      </div>

      <div className="auth-background" />

      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue</p>
        </div>

        {/* ✅ Show error message if any */}
        {error && (
          <div className="error-message" style={{
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            padding: "10px 15px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "14px",
            textAlign: "center",
            border: "1px solid #fecaca"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              name="email"
              type="email"
              placeholder=" "
              onChange={handleChange}
              required
              autoComplete="username"
              disabled={loading}
            />
            <label>Email Address</label>
          </div>

          <div className="input-group">
            <input
              name="password"
              type="password"
              placeholder=" "
              onChange={handleChange}
              required
              autoComplete="current-password"
              disabled={loading}
            />
            <label>Password</label>
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <div style={{ fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
            <p style={{ margin: "4px 0" }}>
              <strong>Super Admin:</strong> superadmin@company.com / super1234
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Admin:</strong> admin@company.com / admin1234
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
