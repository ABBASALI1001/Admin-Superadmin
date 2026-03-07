import React from "react";
import { Calendar, Users, Trash2, Copy } from "lucide-react";

function DateAndEmployee({
  filteredEmployees,
  handleDeleteEmployee,
  handleCopyEmployee,
  copiedEmployee,
}) {
  return (
    <>
      <div className="grid-header date-col">
        <Calendar size={18} color="var(--accent-blue)" />
        <span>Date</span>
      </div>

      {filteredEmployees.map((emp) => (
        <div
          key={emp._id || emp.id}
          className="grid-header employee-name"
          style={{ position: "relative" }}
        >
          <Trash2
            size={14}
            className="action-icon delete"
            style={{ position: "absolute", top: "6px", left: "6px" }}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteEmployee(emp._id);
            }}
          />

          <Copy
            size={14}
            className="action-icon"
            style={{ position: "absolute", top: "6px", right: "6px" }}
            onClick={(e) => handleCopyEmployee(emp.name || "", emp._id, e)}
            title="Copy name"
          />

          <Users size={18} color="#94a3b8" />
          <span style={{ fontSize: "0.9rem", fontWeight: "700" }}>
            {copiedEmployee === emp._id ? "Copied!" : emp.name || "Unknown"}
          </span>
          {emp.totalCount > 0 && (
            <span className="employee-badge">{emp.totalCount}</span>
          )}
        </div>
      ))}
    </>
  );
}

export default DateAndEmployee;
