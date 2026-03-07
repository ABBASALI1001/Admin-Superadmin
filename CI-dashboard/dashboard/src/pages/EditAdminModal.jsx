import React, { useState, useEffect } from "react";
import { X, User, Mail, Lock, AlertCircle } from "lucide-react";

function EditAdminModal({ onClose }) {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (selectedAdmin) {
      const admin = admins.find((a) => a._id === selectedAdmin);
      if (admin) {
        setEmail(admin.email);
        setPassword("");
        setConfirmPassword("");
      }
    }
  }, [selectedAdmin, admins]);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admins`);
      if (!response.ok) throw new Error("Failed to fetch admins");
      const data = await response.json();
      setAdmins(data);
    } catch (err) {
      setError("Failed to load admins");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAdmin) {
      setError("Please select an admin to edit");
      return;
    }

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password && password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updateData = { email };
      if (password) updateData.password = password;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admins/${selectedAdmin}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update admin");
      }

      // Success
      onClose();
    } catch (err) {
      setError(err.message || "Error updating admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <User size={24} /> Edit Administrator
          </h2>
          <X className="action-icon" onClick={onClose} />
        </div>

        {error && (
          <div
            className="warning-box"
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Admin to Edit</label>
            <select
              value={selectedAdmin}
              onChange={(e) => setSelectedAdmin(e.target.value)}
              required
              disabled={fetchLoading || loading}
            >
              <option value="">-- Select Admin --</option>
              {admins.map((admin) => (
                <option key={admin._id} value={admin._id}>
                  {admin.email}
                </option>
              ))}
            </select>
            {fetchLoading && <small>Loading admins...</small>}
          </div>

          {selectedAdmin && (
            <>
              <div className="form-group">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Mail size={16} /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Lock size={16} /> New Password (optional)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  disabled={loading}
                />
                <small>Minimum 6 characters</small>
              </div>

              {password && (
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                </div>
              )}
            </>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-warning"
              disabled={!selectedAdmin || loading}
            >
              {loading ? "Updating..." : "Update Admin"}
            </button>
          </div>
        </form>

        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "rgba(100, 116, 139, 0.1)",
            borderRadius: "8px",
            fontSize: "0.85rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <AlertCircle size={16} color="#f59e0b" />
            <strong>Note:</strong>
          </div>
          <p style={{ margin: 0, color: "#64748b" }}>
            • Email changes will affect login immediately
            <br />
            • Password changes require re-login
            <br />• Admins have full access to scheduling system
          </p>
        </div>
      </div>
    </div>
  );
}

export default EditAdminModal;
