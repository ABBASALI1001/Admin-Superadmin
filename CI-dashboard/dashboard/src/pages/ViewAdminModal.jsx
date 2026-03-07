import React, { useState, useEffect } from "react";
import { X, User, Mail, Shield } from "lucide-react";

function ViewAdminsModal({ onClose }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admins`);
      if (!response.ok) throw new Error("Failed to fetch admins");
      const data = await response.json();
      setAdmins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "600px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h2
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Shield size={24} /> Administrators
            </h2>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.9rem",
                marginTop: "0.25rem",
              }}
            >
              Users with access to the scheduling system
            </p>
          </div>
          <X className="action-icon" onClick={onClose} />
        </div>

        {error && <div className="warning-box">{error}</div>}

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Loading administrators...
          </div>
        ) : admins.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}
          >
            No administrators found
          </div>
        ) : (
          <div className="admin-list">
            {admins.map((admin, index) => (
              <div key={admin._id || index} className="admin-item">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div className="admin-avatar">
                    <User size={20} />
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Mail size={16} color="#64748b" />
                      <span style={{ fontWeight: "500" }}>{admin.email}</span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        marginTop: "0.25rem",
                      }}
                    >
                      Admin ID: {admin._id?.substring(0, 8) || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions" style={{ marginTop: "2rem" }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#64748b",
              marginTop: "0.5rem",
            }}
          >
            Total: {admins.length} administrator{admins.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewAdminsModal;
