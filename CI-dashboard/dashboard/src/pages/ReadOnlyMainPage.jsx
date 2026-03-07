import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  Briefcase,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Lock,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEARS = [2024, 2025, 2026, 2027, 2028];

function ReadOnlyMainpage() {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [searchQuery, setSearchQuery] = useState("");

  // --- API Calls (READ ONLY) ---

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_URL}/roles`);
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_URL}/employees`);
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchAssignments = async () => {
    try {
      // FIXED: Added +1 to match Mainpage.jsx
      const monthKey = `${selectedYear}-${selectedMonth + 1}`;
      const res = await fetch(`${API_URL}/assignments/${monthKey}`);
      const assignments = await res.json();

      const daysInMonth = new Date(
        selectedYear,
        selectedMonth + 1,
        0,
      ).getDate();
      const newGrid = [];

      for (let d = 1; d <= daysInMonth; d++) {
        const dateCells = {};
        const acCells = {};
        assignments
          .filter((a) => a.day === d)
          .forEach((a) => {
            if (a.type === "DATE")
              dateCells[a.employeeId] = { role: a.role, status: a.status };
            else if (a.type === "AC")
              acCells[a.employeeId] = { value: a.value };
          });
        newGrid.push({ type: "DATE", date: d, cells: dateCells });
        newGrid.push({ type: "AC", label: "AC", cells: acCells });
      }
      setScheduleData(newGrid);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [selectedMonth, selectedYear]);

  const filteredEmployees = employees.filter((emp) =>
    (emp.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div className="modern-table-container">
        <header className="dashboard-header">
          <div className="logo-section">
            <h1>
              Centennial <span>Infotech</span>
            </h1>
          </div>

          <div
            className="month-selector"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--bg-secondary)",
              padding: "0.4rem 1rem",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
            }}
          >
            <button
              onClick={() =>
                setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1))
              }
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontWeight: "bold",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {MONTHS.map((m, i) => (
                <option
                  key={m}
                  value={i}
                  style={{ background: "var(--bg-secondary)" }}
                >
                  {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontWeight: "bold",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {YEARS.map((y) => (
                <option
                  key={y}
                  value={y}
                  style={{ background: "var(--bg-secondary)" }}
                >
                  {y}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1))
              }
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div
            className="header-actions"
            style={{ display: "flex", gap: "1rem", alignItems: "center" }}
          >
            <div className="search-bar" style={{ position: "relative" }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-secondary)",
                }}
              />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: "0.6rem 1rem 0.6rem 2.5rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "rgba(15, 23, 42, 0.5)",
                  color: "white",
                  width: "180px",
                }}
              />
            </div>

            {/* Disabled buttons (UI only, no actions) */}
            <button className="btn btn-secondary" disabled>
              <Briefcase size={18} /> Add Role
            </button>
            <button className="btn btn-primary" disabled>
              <Plus size={18} /> Add Staff
            </button>
            {/* --- LOGOUT BUTTON --- */}
            <button
              className="btn btn-logout"
              onClick={() => {
                localStorage.removeItem("role");
                window.location.href = "/login";
              }}
              title="Logout"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0",
                marginLeft: "0.5rem",
              }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div style={{ overflow: "auto", height: "calc(100vh - 65px)" }}>
          <main
            className="main-grid"
            style={{
              gridTemplateColumns: `100px repeat(${filteredEmployees.length}, 220px)`,
            }}
          >
            <div className="grid-header date-col">
              <Calendar size={18} color="var(--accent-blue)" />
              <span>Date</span>
            </div>
            {filteredEmployees.map((emp) => (
              <div
                key={emp._id || emp.id}
                className="grid-header employee-name"
              >
                <Users size={18} color="#94a3b8" />
                <span style={{ fontSize: "0.9rem", fontWeight: "700" }}>
                  {emp.name || "Unknown"}
                </span>
                {emp.totalCount > 0 && (
                  <span className="employee-badge">{emp.totalCount}</span>
                )}
              </div>
            ))}

            {scheduleData.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <div
                  className={`grid-cell date-label ${
                    row.type === "AC" ? "ac-row" : ""
                  }`}
                >
                  {row.type === "DATE" ? row.date : row.label}
                </div>
                {filteredEmployees.map((emp) => {
                  const cellData = row.cells[emp._id];
                  const cellClass = cellData ? `cell-${cellData.status}` : "";

                  // NEW: Show lock icon for GREEN status roles
                  const isActiveGreen = cellData && cellData.status === "green";

                  return (
                    <div
                      key={emp._id}
                      className={`grid-cell ${row.type === "AC" ? "ac-row" : ""} ${cellClass}`}
                      style={{
                        position: "relative",
                        borderLeft: isActiveGreen ? "4px solid #10b981" : "",
                      }}
                      title={
                        isActiveGreen
                          ? "Active Role - Cannot be reassigned until status changes to RED"
                          : ""
                      }
                    >
                      {/* LOCK ICON for Active GREEN Roles */}
                      {isActiveGreen && row.type === "DATE" && (
                        <div
                          style={{
                            position: "absolute",
                            top: "5px",
                            left: "5px",
                            color: "#10b981",
                            background: "rgba(16, 185, 129, 0.1)",
                            borderRadius: "50%",
                            padding: "2px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 5,
                          }}
                        >
                          <Lock size={12} />
                        </div>
                      )}

                      {cellData ? (
                        <>
                          {cellData.role && (
                            <span
                              className="role-text"
                              style={{
                                color: isActiveGreen ? "#10b981" : "inherit",
                                fontWeight: isActiveGreen ? "600" : "normal",
                              }}
                            >
                              {cellData.role}
                            </span>
                          )}
                          {cellData.value !== undefined && (
                            <span className="value-text">{cellData.value}</span>
                          )}
                        </>
                      ) : (
                        <span className="empty-cell">-</span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </main>
        </div>
      </div>
    </>
  );
}

export default ReadOnlyMainpage;
