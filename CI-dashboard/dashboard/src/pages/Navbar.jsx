import React from "react";
import {
  Briefcase,
  Search,
  Plus,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

function Navbar({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  searchQuery,
  setSearchQuery,
  setIsRoleModalOpen,
  setIsViewAdminsModalOpen,
  setIsEditAdminModalOpen,
  setIsModalOpen,
  formattedDate,
  dayName,
}) {
  return (
    <header className="dashboard-header">
      <div className="logo-section">
        <h1>
          Work Table <span>Record</span>
        </h1>
      </div>

      <div className="date-display">
        <div className="full-date">{formattedDate}</div>
        <div className="day-name">{dayName}</div>
      </div>

      <div
        className="month-selector"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "darkblue",
          padding: "0.4rem 1rem",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
        }}
      >
        <button
          aria-label="Previous month"
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
              style={{ background: "var(--accent-blue)" }}
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
              style={{ background: "var(--accent-blue)" }}
            >
              {y}
            </option>
          ))}
        </select>
        <button
          aria-label="Next month"
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

        <button
          className="btn btn-secondary"
          onClick={() => setIsRoleModalOpen(true)}
        >
          <Briefcase size={18} /> Add Role
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => setIsViewAdminsModalOpen(true)}
        >
          View Admins
        </button>

        <button
          className="btn btn-warning"
          onClick={() => setIsEditAdminModalOpen(true)}
        >
          Edit Admin
        </button>

        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} /> Add Staff
        </button>

        <button
          className="btn btn-logout"
          onClick={() => {
            localStorage.clear();
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
  );
}

export default Navbar;
