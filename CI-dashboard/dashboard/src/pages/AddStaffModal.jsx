import React, { useState } from "react";
import { X, UserPlus, User } from "lucide-react";

function AddStaffModal({ onClose }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Employee name is required");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/employees`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            totalCount: 0,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      // Success
      setSuccess(true);
      setName("");

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Error adding employee");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setSuccess(false);
    setName("");
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
            <UserPlus size={24} /> Add New Staff
          </h2>
          <X className="action-icon" onClick={onClose} />
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <User size={32} color="white" />
            </div>
            <h3 style={{ color: "#10b981", marginBottom: "0.5rem" }}>
              Success!
            </h3>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
              Staff member has been added to the system.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddAnother}
              >
                Add Another
              </button>
            </div>
          </div>
        ) : (
          <>
            {error && <div className="warning-box">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Employee Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name (e.g., Alex Johnson)"
                  required
                  disabled={loading}
                  autoFocus
                />
                <small>This name will appear in the schedule grid</small>
              </div>

              <div
                style={{
                  margin: "1.5rem 0",
                  padding: "1rem",
                  background: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "8px",
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
                  <User size={16} color="#3b82f6" />
                  <strong style={{ color: "#3b82f6" }}>
                    What happens next:
                  </strong>
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "1.5rem",
                    color: "#64748b",
                    fontSize: "0.9rem",
                  }}
                >
                  <li>New column added to schedule grid</li>
                  <li>Employee appears in left sidebar</li>
                  <li>Can be assigned roles immediately</li>
                  <li>Will be included in search results</li>
                </ul>
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
                  {loading ? "Adding..." : "Add Staff Member"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default AddStaffModal;
