const Assignment = require("../models/Assignment");
const Employee = require("../models/Employee");

// GET assignments for a month
exports.getAssignments = async (req, res) => {
  try {
    const { monthYear } = req.params;
    const assignments = await Assignment.find({ monthYear });
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching assignments" });
  }
};

// SAVE or UPDATE assignment
exports.saveAssignment = async (req, res) => {
  const { monthYear, day, type, employeeId, role, status, value, date } = req.body;

  try {
    // Parse date parts from input
    const inputDate = new Date(date);
    const year = inputDate.getUTCFullYear();
    const month = inputDate.getUTCMonth();
    const dayOfMonth = inputDate.getUTCDate();

    // Create date in UTC to avoid timezone shifts
    const newDate = new Date(Date.UTC(year, month, dayOfMonth, 0, 0, 0, 0));

    // ===== DATE TYPE LOGIC =====
    if (type === "DATE" && role) {

      // Calculate date range properly using UTC (8-day rule)
      const endDate = new Date(newDate);
      endDate.setUTCHours(23, 59, 59, 999);

      const startDate = new Date(newDate);
      startDate.setUTCDate(startDate.getUTCDate() - 7);
      startDate.setUTCHours(0, 0, 0, 0);

      // Check if this is an update to an existing cell
      const existingToday = await Assignment.findOne({
        monthYear,
        day,
        type: "DATE",
        employeeId,
      });

      // ============================================
      // STEP 1: CHECK SAME DAY - OTHER EMPLOYEES
      // ============================================

      const sameDayDifferentPerson = await Assignment.findOne({
        monthYear,
        day,
        type: "DATE",
        role,
        employeeId: { $ne: employeeId }
      });

      if (sameDayDifferentPerson) {
        const emp = await Employee.findById(sameDayDifferentPerson.employeeId);
        const name = emp ? emp.name : "another staff";

        // RULE 1: BLUE is FREE - allow anyone to take BLUE on same day
        if (status === "blue") {
          console.log(`BLUE is FREE - anyone can take it anytime`);
        }
        // RULE 2: For GREEN or RED - block if someone already has it on same day
        else {
          return res.status(400).json({
            message: `Already assigned to ${name} this week`
          });
        }
      }

      // ============================================
      // STEP 2: CHECK SAME EMPLOYEE - 8-DAY RULE (GREEN & RED)
      // ============================================

      // BLUE is FREE - skip all checks for BLUE
      if (status !== "blue") {

        // Check if SAME PERSON has GREEN or RED in last 8 days (ANY color - GREEN or RED)
        const recentAnyColorSelf = await Assignment.findOne({
          role,
          type: "DATE",
          employeeId,
          status: { $in: ["green", "red"] }, // Check for GREEN or RED
          date: { $gte: startDate, $lte: endDate },
          _id: { $ne: existingToday?._id }
        }).sort({ date: -1 });

        if (recentAnyColorSelf) {
          const diffDays = Math.floor(
            (endDate - new Date(recentAnyColorSelf.date)) /
            (1000 * 60 * 60 * 24)
          );
          const daysLeft = 8 - diffDays;

          const emp = await Employee.findById(employeeId);
          const name = emp ? emp.name : "this user";

          return res.status(400).json({
            message: `Already assigned to ${name} this week`
          });
        }

        // ============================================
        // STEP 3: CHECK DIFFERENT EMPLOYEE - 8-DAY RULE (GREEN & RED)
        // ============================================

        // Check if ANY OTHER EMPLOYEE has GREEN or RED in last 8 days
        const recentAnyColorOther = await Assignment.findOne({
          role,
          type: "DATE",
          status: { $in: ["green", "red"] }, // Check for GREEN or RED
          date: { $gte: startDate, $lte: endDate },
          employeeId: { $ne: employeeId },
          _id: { $ne: existingToday?._id }
        });

        if (recentAnyColorOther) {
          const diffDays = Math.floor(
            (endDate - new Date(recentAnyColorOther.date)) /
            (1000 * 60 * 60 * 24)
          );
          const daysLeft = 8 - diffDays;

          const emp = await Employee.findById(recentAnyColorOther.employeeId);
          const name = emp ? emp.name : "another staff";

          return res.status(400).json({
            message: `Already assigned to ${name} this week`
          });
        }
      }

      // ============================================
      // STEP 4: SAVE THE ASSIGNMENT
      // ============================================

      const updateData = {
        role,
        status,
        value,
        date: newDate,
        monthYear,
        day,
        type,
        employeeId,
        restricted: false,
      };

      const updated = await Assignment.findOneAndUpdate(
        { monthYear, day, type, employeeId },
        updateData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return res.json(updated);
    }

    // ===== AC TYPE OR NO ROLE =====
    const updated = await Assignment.findOneAndUpdate(
      { monthYear, day, type, employeeId },
      {
        role,
        status,
        value,
        date: newDate,
        monthYear,
        day,
        type,
        employeeId,
        restricted: false
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json(updated);

  } catch (err) {
    console.error("Save assignment error:", err);
    res.status(500).json({ message: "Error saving assignment" });
  }
};

// DELETE assignment
exports.deleteAssignment = async (req, res) => {
  const { monthYear, day, type, employeeId } = req.body;
  try {
    await Assignment.findOneAndDelete({ monthYear, day, type, employeeId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Error deleting assignment" });
  }
};
