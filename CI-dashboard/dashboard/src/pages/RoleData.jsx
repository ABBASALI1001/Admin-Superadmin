import React, { useState } from "react";
import { Edit2, Lock, Copy } from "lucide-react";

function RoleData({
  scheduleData,
  filteredEmployees,
  openEditCell,
  openAcModal,
  restrictedRoles = [],
  currentUserId,
}) {
  const [copiedCell, setCopiedCell] = useState(null);

  const handleCopy = (e, rowIndex, empId, role) => {
    e.stopPropagation();
    navigator.clipboard.writeText(role);
    setCopiedCell(`${rowIndex}-${empId}`);
    setTimeout(() => setCopiedCell(null), 1500);
  };

  return (
    <>
      {scheduleData.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          <div
            className={`grid-cell date-label ${row.type === "AC" ? "ac-row" : ""}`}
          >
            {row.type === "DATE" ? row.date : row.label}
          </div>

          {filteredEmployees.map((emp) => {
            const cellData = row.cells[emp._id];
            const cellClass = cellData ? `cell-${cellData.status}` : "";
            const isRestricted =
              cellData?.role && restrictedRoles.includes(cellData.role);
            const isGreen = cellData?.status === "green";
            const isRed = cellData?.status === "red";
            const isBlue = cellData?.status === "blue";
            const cellKey = `${rowIndex}-${emp._id}`;
            const showCopied = copiedCell === cellKey;

            // For DATE cells - show role with edit overlay
            if (row.type === "DATE") {
              return (
                <div
                  key={emp._id}
                  className={`grid-cell ${cellClass}`}
                  onClick={() => openEditCell(rowIndex, emp._id)}
                  style={{ position: "relative", cursor: "pointer" }}
                  title={isRestricted ? "Blocked / Restricted" : ""}
                >
                  {cellData ? (
                    <>
                      {cellData.role && <span>{cellData.role}</span>}
                      {cellData.value !== undefined && (
                        <span>{cellData.value}</span>
                      )}
                    </>
                  ) : (
                    <span className="empty-cell">-</span>
                  )}

                  {isGreen && isRestricted && (
                    <Lock
                      size={12}
                      style={{ position: "absolute", top: "5px", right: "5px" }}
                    />
                  )}

                  {/* RED cells - ALWAYS show copy for everyone */}
                  {isRed && cellData?.role && (
                    <div
                      style={{
                        position: "absolute",
                        top: "3px",
                        left: "3px",
                        zIndex: 20,
                        cursor: "pointer",
                        backgroundColor: "rgba(255,255,255,0.7)",
                        borderRadius: "3px",
                        padding: "1px 3px",
                      }}
                      onClick={(e) =>
                        handleCopy(e, rowIndex, emp._id, cellData.role)
                      }
                    >
                      <Copy size={14} color="#000" />
                    </div>
                  )}

                  {/* GREEN cells - ALWAYS show copy for everyone */}
                  {isGreen && cellData?.role && (
                    <div
                      style={{
                        position: "absolute",
                        top: "3px",
                        left: "3px",
                        zIndex: 20,
                        cursor: "pointer",
                        backgroundColor: "rgba(255,255,255,0.7)",
                        borderRadius: "3px",
                        padding: "1px 3px",
                      }}
                      onClick={(e) =>
                        handleCopy(e, rowIndex, emp._id, cellData.role)
                      }
                    >
                      <Copy size={14} color="#000" />
                    </div>
                  )}

                  {/* BLUE cells - NO COPY OPTION AT ALL - COMPLETELY REMOVED */}
                  {/* Nothing renders for blue cells */}

                  {showCopied && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        fontSize: "10px",
                        padding: "2px 4px",
                        borderRadius: "3px",
                        pointerEvents: "none",
                        zIndex: 30,
                      }}
                    >
                      Copied!
                    </div>
                  )}

                  <div className="cell-edit-overlay">
                    <Edit2 size={16} />
                  </div>
                </div>
              );
            }
            // For AC cells - show number in cell
            else if (row.type === "AC") {
              return (
                <div
                  key={emp._id}
                  className={`grid-cell ${cellClass} ac-row`}
                  onClick={() => openAcModal(rowIndex, emp._id)}
                  style={{
                    position: "relative",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Click to edit AC value"
                >
                  {cellData?.value ? (
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: isGreen
                          ? "#10b981"
                          : isRed
                            ? "#ef4444"
                            : isBlue
                              ? "#3b82f6"
                              : "#059669",
                      }}
                    >
                      {cellData.value}
                    </span>
                  ) : (
                    <span className="empty-cell" style={{ color: "#9ca3af" }}>
                      -
                    </span>
                  )}

                  <div className="cell-edit-overlay">
                    <Edit2 size={16} />
                  </div>
                </div>
              );
            }

            return null;
          })}
        </React.Fragment>
      ))}
    </>
  );
}

export default RoleData;
