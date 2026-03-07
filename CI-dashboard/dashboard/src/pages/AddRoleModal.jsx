import React, { useState } from "react";
import { X } from "lucide-react";

function AddRoleModal({ onClose }) {
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      setError("Role name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roleName.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to add role");
      }

      // Success - close modal
      onClose();
      // Note: Mainpage will refresh roles via its useEffect
    } catch (err) {
      setError(err.message || "Error adding role");
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
            marginBottom: "1rem",
          }}
        >
          <h2>Add New Role</h2>
          <X className="action-icon" onClick={onClose} />
        </div>

        {error && (
          <div className="warning-box" style={{ marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Role Name</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name (e.g., Manager, Developer)"
              required
              disabled={loading}
            />
          </div>
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
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRoleModal;
