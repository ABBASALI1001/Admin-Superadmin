import React, { useState, useEffect } from "react";
import { X, Trash2, Save, AlertTriangle } from "lucide-react";
import Navbar from "./Navbar";
import DateAndEmployee from "./DateAndEmployee";
import RoleData from "./RoleData";
import AddRoleModal from "./AddRoleModal";
import ViewAdminsModal from "./ViewAdminModal";
import EditAdminModal from "./EditAdminModal";
import AddStaffModal from "./AddStaffModal";

const API_URL = import.meta.env.VITE_API_URL;

function Mainpage() {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAcModalOpen, setIsAcModalOpen] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [editingAcCell, setEditingAcCell] = useState(null);
  const [error, setError] = useState("");
  const [restrictedRoles, setRestrictedRoles] = useState([]);
  const [warningMessage, setWarningMessage] = useState("");

  // NEW: State for modal error message (appears inside modal)
  const [modalError, setModalError] = useState("");

  // State for current logged-in user
  const [currentUser, setCurrentUser] = useState(null);

  // Button states
  const [searchQuery, setSearchQuery] = useState("");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isViewAdminsModalOpen, setIsViewAdminsModalOpen] = useState(false);
  const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthNames = [
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

  // Fetch current user from localStorage on component mount
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  // --- Fetch Employees ---
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch(`${API_URL}/employees`);
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchEmployees();
  }, []);

  // --- Fetch Roles ---
  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch(`${API_URL}/roles`);
        const data = await res.json();
        setRoles(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchRoles();
  }, []);

  // --- Fetch Assignments ---
  useEffect(() => {
    async function fetchAssignments() {
      try {
        const monthKey = `${selectedYear}-${selectedMonth + 1}`;
        const res = await fetch(`${API_URL}/assignments/${monthKey}`);
        const assignments = await res.json();

        const daysInMonth = new Date(
          selectedYear,
          selectedMonth + 1,
          0,
        ).getDate();
        const newGrid = [];
        const restricted = [];

        assignments.forEach((a) => {
          if (a.restricted && a.role && !restricted.includes(a.role)) {
            restricted.push(a.role);
          }
        });
        setRestrictedRoles(restricted);

        for (let d = 1; d <= daysInMonth; d++) {
          const dateCells = {};
          const acCells = {};
          assignments
            .filter((a) => a.day === d)
            .forEach((a) => {
              if (a.type === "DATE")
                dateCells[a.employeeId] = {
                  role: a.role,
                  status: a.status,
                  restricted: a.restricted || false,
                };
              else if (a.type === "AC")
                acCells[a.employeeId] = { value: a.value };
            });
          newGrid.push({ type: "DATE", date: d, cells: dateCells });
          newGrid.push({ type: "AC", label: "AC", cells: acCells });
        }
        setScheduleData(newGrid);
      } catch (err) {
        console.error(err);
      }
    }
    fetchAssignments();
  }, [selectedMonth, selectedYear]);

  // Filter employees based on search
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // --- Open Cell Modal (for DATE cells only) ---
  const openEditCell = (rowIndex, empId) => {
    const row = scheduleData[rowIndex];
    const cell = row.cells[empId] || {};
    setEditingCell({
      rowIndex,
      empId,
      role: cell.role || "",
      status: cell.status || "blue",
      value: cell.value || "",
      type: row.type,
    });
    setError("");
    setWarningMessage("");
    setModalError(""); // Clear modal error when opening
    setIsEditModalOpen(true);
  };

  // --- Open AC Modal (for AC cells only) ---
  const openAcModal = (rowIndex, empId) => {
    const row = scheduleData[rowIndex];
    const cell = row.cells[empId] || {};
    setEditingAcCell({
      rowIndex,
      empId,
      value: cell.value || "",
      type: row.type,
    });
    setError("");
    setWarningMessage("");
    setIsAcModalOpen(true);
  };

  // --- Save Cell (for DATE cells) ---
  const handleSaveCell = async () => {
    if (!editingCell) return;
    setError("");
    setWarningMessage("");
    setModalError(""); // Clear previous modal error

    let day;
    if (scheduleData[editingCell.rowIndex].type === "DATE") {
      day = scheduleData[editingCell.rowIndex].date;
    } else {
      day = scheduleData[editingCell.rowIndex - 1]?.date;
    }
    if (!day) return;

    const date = new Date(selectedYear, selectedMonth, day);
    date.setHours(12, 0, 0, 0);
    const monthKey = `${selectedYear}-${selectedMonth + 1}`;

    try {
      const response = await fetch(`${API_URL}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthYear: monthKey,
          day,
          type: editingCell.type,
          employeeId: editingCell.empId,
          role: editingCell.role,
          status: editingCell.status,
          value: editingCell.value,
          date: date.toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message) {
          // Show error inside modal instead of popup
          setModalError(data.message);
        }
        return;
      }

      // refresh assignments
      const res2 = await fetch(`${API_URL}/assignments/${monthKey}`);
      const assignments = await res2.json();

      const daysInMonth = new Date(
        selectedYear,
        selectedMonth + 1,
        0,
      ).getDate();
      const newGrid = [];
      const restricted = [];

      assignments.forEach((a) => {
        if (a.restricted && a.role && !restricted.includes(a.role)) {
          restricted.push(a.role);
        }
      });
      setRestrictedRoles(restricted);

      for (let d = 1; d <= daysInMonth; d++) {
        const dateCells = {};
        const acCells = {};
        assignments
          .filter((a) => a.day === d)
          .forEach((a) => {
            if (a.type === "DATE")
              dateCells[a.employeeId] = {
                role: a.role,
                status: a.status,
                restricted: a.restricted || false,
              };
            else if (a.type === "AC")
              acCells[a.employeeId] = { value: a.value };
          });
        newGrid.push({ type: "DATE", date: d, cells: dateCells });
        newGrid.push({ type: "AC", label: "AC", cells: acCells });
      }
      setScheduleData(newGrid);

      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Save AC Value ---
  const handleSaveAcValue = async () => {
    if (!editingAcCell) return;
    setError("");

    const dateRow = scheduleData[editingAcCell.rowIndex - 1];
    if (!dateRow || dateRow.type !== "DATE") return;

    const day = dateRow.date;
    const monthKey = `${selectedYear}-${selectedMonth + 1}`;
    const date = new Date(selectedYear, selectedMonth, day);
    date.setHours(12, 0, 0, 0);

    try {
      const response = await fetch(`${API_URL}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthYear: monthKey,
          day,
          type: "AC",
          employeeId: editingAcCell.empId,
          value: editingAcCell.value || "0",
          date: date.toISOString(),
        }),
      });

      const data = await response.json();
      if (data.message) setError(data.message);

      const newScheduleData = [...scheduleData];
      const cell =
        newScheduleData[editingAcCell.rowIndex].cells[editingAcCell.empId] ||
        {};
      newScheduleData[editingAcCell.rowIndex].cells[editingAcCell.empId] = {
        ...cell,
        value: editingAcCell.value,
      };
      setScheduleData(newScheduleData);

      setIsAcModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Delete AC Value ---
  const handleDeleteAcValue = async () => {
    if (!editingAcCell) return;
    setError("");

    const dateRow = scheduleData[editingAcCell.rowIndex - 1];
    if (!dateRow || dateRow.type !== "DATE") return;

    const day = dateRow.date;
    const monthKey = `${selectedYear}-${selectedMonth + 1}`;

    try {
      const response = await fetch(`${API_URL}/assignments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthYear: monthKey,
          day,
          type: "AC",
          employeeId: editingAcCell.empId,
        }),
      });

      const data = await response.json();
      if (data.message) setError(data.message);

      const newScheduleData = [...scheduleData];
      delete newScheduleData[editingAcCell.rowIndex].cells[editingAcCell.empId];
      setScheduleData(newScheduleData);

      setIsAcModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Delete Cell (for DATE cells) ---
  const handleDeleteCell = async () => {
    if (!editingCell) return;
    setError("");

    const monthKey = `${selectedYear}-${selectedMonth + 1}`;
    let day;
    if (scheduleData[editingCell.rowIndex].type === "DATE") {
      day = scheduleData[editingCell.rowIndex].date;
    } else {
      day = scheduleData[editingCell.rowIndex - 1]?.date;
    }
    if (!day) return;

    try {
      const response = await fetch(`${API_URL}/assignments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthYear: monthKey,
          day,
          type: editingCell.type,
          employeeId: editingCell.empId,
        }),
      });

      const data = await response.json();
      if (data.message) setError(data.message);

      const res2 = await fetch(`${API_URL}/assignments/${monthKey}`);
      const assignments = await res2.json();

      const daysInMonth = new Date(
        selectedYear,
        selectedMonth + 1,
        0,
      ).getDate();
      const newGrid = [];
      const restricted = [];

      assignments.forEach((a) => {
        if (a.restricted && a.role && !restricted.includes(a.role)) {
          restricted.push(a.role);
        }
      });
      setRestrictedRoles(restricted);

      for (let d = 1; d <= daysInMonth; d++) {
        const dateCells = {};
        const acCells = {};
        assignments
          .filter((a) => a.day === d)
          .forEach((a) => {
            if (a.type === "DATE")
              dateCells[a.employeeId] = {
                role: a.role,
                status: a.status,
                restricted: a.restricted || false,
              };
            else if (a.type === "AC")
              acCells[a.employeeId] = { value: a.value };
          });
        newGrid.push({ type: "DATE", date: d, cells: dateCells });
        newGrid.push({ type: "AC", label: "AC", cells: acCells });
      }
      setScheduleData(newGrid);

      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Delete Employee (Entire Column) ---
  const handleDeleteEmployee = async (employeeId) => {
    try {
      await fetch(`${API_URL}/employees/${employeeId}`, {
        method: "DELETE",
      });

      setEmployees((prev) => prev.filter((emp) => emp._id !== employeeId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="modern-table-container">
      <Navbar
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsRoleModalOpen={setIsRoleModalOpen}
        setIsViewAdminsModalOpen={setIsViewAdminsModalOpen}
        setIsEditAdminModalOpen={setIsEditAdminModalOpen}
        setIsModalOpen={setIsModalOpen}
        formattedDate={`${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`}
        dayName={now.toLocaleDateString("en-US", { weekday: "long" })}
      />

      {error && (
        <div className="error-box">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {warningMessage && (
        <div className="warning-box">
          <AlertTriangle size={18} /> {warningMessage}
        </div>
      )}

      <div style={{ overflow: "auto", height: "calc(100vh - 65px)" }}>
        <main
          className="main-grid"
          style={{
            gridTemplateColumns: `100px repeat(${filteredEmployees.length}, 220px)`,
          }}
        >
          <DateAndEmployee
            filteredEmployees={filteredEmployees}
            openEditCell={openEditCell}
            handleDeleteEmployee={handleDeleteEmployee}
          />
          <RoleData
            scheduleData={scheduleData}
            filteredEmployees={filteredEmployees}
            openEditCell={openEditCell}
            openAcModal={openAcModal}
            restrictedRoles={restrictedRoles}
            currentUserId={currentUser?._id}
          />
        </main>
      </div>

      {/* Edit Cell Modal (for DATE cells) */}
      {isEditModalOpen && editingCell && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <h2>Edit Job Data</h2>
              <X
                className="action-icon"
                onClick={() => setIsEditModalOpen(false)}
              />
            </div>

            {/* NEW: Error message inside modal */}
            {modalError && (
              <div
                style={{
                  backgroundColor: "#fff3cd",
                  border: "1px solid #ffeeba",
                  color: "#856404",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <AlertTriangle
                  size={18}
                  style={{ flexShrink: 0, marginTop: "2px" }}
                />
                <span>{modalError}</span>
              </div>
            )}

            <div className="form-group">
              <label>Role</label>
              <select
                value={editingCell.role}
                onChange={(e) => {
                  setEditingCell({ ...editingCell, role: e.target.value });
                  setModalError(""); // Clear error when user changes selection
                }}
              >
                <option value="">-- None --</option>
                {roles.map((r) => (
                  <option key={r._id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={editingCell.status}
                onChange={(e) => {
                  setEditingCell({ ...editingCell, status: e.target.value });
                  setModalError(""); // Clear error when user changes selection
                }}
              >
                <option value="blue">🔵 Ready</option>
                <option value="red">🔴 Closed</option>
                <option value="green">🟢 Active</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={handleDeleteCell}>
                <Trash2 size={16} /> Delete Data
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveCell}>
                <Save size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AC Value Modal (for AC cells) */}
      {isAcModalOpen && editingAcCell && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <h2>Edit AC Value</h2>
              <X
                className="action-icon"
                onClick={() => setIsAcModalOpen(false)}
              />
            </div>
            <div className="form-group">
              <label>AC Value</label>
              <input
                type="number"
                value={editingAcCell.value || ""}
                onChange={(e) =>
                  setEditingAcCell({ ...editingAcCell, value: e.target.value })
                }
                placeholder="Enter AC value"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: "16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  marginTop: "8px",
                }}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={handleDeleteAcValue}>
                <Trash2 size={16} /> Delete Data
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setIsAcModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveAcValue}>
                <Save size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {isRoleModalOpen && (
        <AddRoleModal onClose={() => setIsRoleModalOpen(false)} />
      )}

      {/* View Admins Modal */}
      {isViewAdminsModalOpen && (
        <ViewAdminsModal onClose={() => setIsViewAdminsModalOpen(false)} />
      )}

      {/* Edit Admin Modal */}
      {isEditAdminModalOpen && (
        <EditAdminModal onClose={() => setIsEditAdminModalOpen(false)} />
      )}

      {/* Add Staff Modal */}
      {isModalOpen && <AddStaffModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default Mainpage;
