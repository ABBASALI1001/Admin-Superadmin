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

      // Calculate date range properly using UTC
      const endDate = new Date(newDate);
      endDate.setUTCHours(23, 59, 59, 999);

      const startDate = new Date(newDate);
      // CHANGED: from -6 to -7 for 8-day rule
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

        // RULE 1: If existing person has RED, allow ANYONE to take ANY COLOR
        if (sameDayDifferentPerson.status === "red") {
          console.log(`RED holder allows anyone to take any color on same day`);
        }
        // RULE 2: If existing person has GREEN
        else if (sameDayDifferentPerson.status === "green") {
          // GREEN allows RED on same day
          if (status === "red") {
            console.log(`GREEN holder allows RED to be assigned on same day`);
          }
          // GREEN blocks BLUE and GREEN with color message
          else {
            return res.status(400).json({
              message: `Cannot assign already assigned to ${name} with green`
            });
          }
        }
        // RULE 3: If existing person has BLUE
        else if (sameDayDifferentPerson.status === "blue") {
          // BLUE only allows RED, blocks everything else
          if (status === "red") {
            // RED is allowed even when BLUE exists
            console.log(`BLUE holder allows RED to be assigned`);
          } else {
            // Any other color (GREEN or BLUE) is blocked with color message
            return res.status(400).json({
              message: `Cannot assign already assigned to ${name} with blue`
            });
          }
        }
      }

      // ============================================
      // STEP 2: CHECK SAME EMPLOYEE - LAST 7 DAYS (ANY COLOR)
      // ============================================

      const recentAnyColor = await Assignment.findOne({
        role,
        type: "DATE",
        employeeId,
        date: { $gte: startDate, $lte: endDate },
        _id: { $ne: existingToday?._id }
      }).sort({ date: -1 });

      if (recentAnyColor) {
        const diffDays = Math.floor(
          (endDate - new Date(recentAnyColor.date)) /
          (1000 * 60 * 60 * 24)
        );
        // CHANGED: daysLeft calculation uses 8 now (7+1)
        const daysLeft = 8 - diffDays;

        const emp = await Employee.findById(employeeId);
        const name = emp ? emp.name : "this user";
        const color = recentAnyColor.status;

        return res.status(400).json({
          message: `Already assigned with ${color} to ${name} wait ${daysLeft} days`
        });
      }

      // ============================================
      // STEP 3: CHECK SAME EMPLOYEE - SPECIFIC COLOR RULES
      // ============================================

      // Check RED → RED
      if (status === "red") {
        const recentRedSelf = await Assignment.findOne({
          role,
          type: "DATE",
          employeeId,
          status: "red",
          date: { $gte: startDate, $lte: endDate },
          _id: { $ne: existingToday?._id }
        }).sort({ date: -1 });

        if (recentRedSelf) {
          const diffDays = Math.floor(
            (endDate - new Date(recentRedSelf.date)) /
            (1000 * 60 * 60 * 24)
          );
          // CHANGED: daysLeft calculation uses 8
          const daysLeft = 8 - diffDays;

          const emp = await Employee.findById(employeeId);
          const name = emp ? emp.name : "this user";

          return res.status(400).json({
            message: `Already assigned with red to ${name} wait ${daysLeft} days`
          });
        }
      }

      // Check BLUE after having RED
      if (status === "blue") {
        const recentRedSelf = await Assignment.findOne({
          role,
          type: "DATE",
          employeeId,
          status: "red",
          date: { $gte: startDate, $lte: endDate },
          _id: { $ne: existingToday?._id }
        }).sort({ date: -1 });

        if (recentRedSelf) {
          const diffDays = Math.floor(
            (endDate - new Date(recentRedSelf.date)) /
            (1000 * 60 * 60 * 24)
          );
          // CHANGED: daysLeft calculation uses 8
          const daysLeft = 8 - diffDays;

          const emp = await Employee.findById(employeeId);
          const name = emp ? emp.name : "this user";

          return res.status(400).json({
            message: `Already assigned with red to ${name} wait ${daysLeft} days`
          });
        }
      }

      // ============================================
      // STEP 4: CHECK ALL EMPLOYEES - LAST 7 DAYS (GLOBAL)
      // ============================================

      // For GREEN - check if ANYONE had GREEN in last 7 days
      if (status === "green") {
        const recentGreenAnyone = await Assignment.findOne({
          role,
          type: "DATE",
          status: "green",
          date: { $gte: startDate, $lte: endDate },
          employeeId: { $ne: employeeId },
          _id: { $ne: existingToday?._id }
        });

        if (recentGreenAnyone) {
          const diffDays = Math.floor(
            (endDate - new Date(recentGreenAnyone.date)) /
            (1000 * 60 * 60 * 24)
          );
          // CHANGED: daysLeft calculation uses 8
          const daysLeft = 8 - diffDays;

          const emp = await Employee.findById(recentGreenAnyone.employeeId);
          const name = emp ? emp.name : "another staff";

          return res.status(400).json({
            message: `Cannot assign already assigned to ${name} wait ${daysLeft} days`
          });
        }
      }

      // For BLUE - check if ANYONE had BLUE in last 7 days
      if (status === "blue") {
        const recentBlueAnyone = await Assignment.findOne({
          role,
          type: "DATE",
          status: "blue",
          date: { $gte: startDate, $lte: endDate },
          employeeId: { $ne: employeeId },
          _id: { $ne: existingToday?._id }
        });

        if (recentBlueAnyone) {
          const diffDays = Math.floor(
            (endDate - new Date(recentBlueAnyone.date)) /
            (1000 * 60 * 60 * 24)
          );
          // CHANGED: daysLeft calculation uses 8
          const daysLeft = 8 - diffDays;

          const emp = await Employee.findById(recentBlueAnyone.employeeId);
          const name = emp ? emp.name : "another staff";

          return res.status(400).json({
            message: `Cannot assign already assigned to ${name} wait ${daysLeft} days`
          });
        }
      }

      // ============================================
      // NEW STEP: CHECK IF GREEN EXISTS WHEN TRYING BLUE (7-DAY RULE)
      // ============================================
      // This prevents BLUE assignments if someone had GREEN in last 7 days

      if (status === "blue") {
        const recentGreenAnyone = await Assignment.findOne({
          role,
          type: "DATE",
          status: "green",
          date: { $gte: startDate, $lte: endDate },
          employeeId: { $ne: employeeId },
          _id: { $ne: existingToday?._id }
        });

        if (recentGreenAnyone) {
          const diffDays = Math.floor(
            (endDate - new Date(recentGreenAnyone.date)) /
            (1000 * 60 * 60 * 24)
          );
          // CHANGED: daysLeft calculation uses 8
          const daysLeft = 8 - diffDays;

          const emp = await Employee.findById(recentGreenAnyone.employeeId);
          const name = emp ? emp.name : "another staff";

          return res.status(400).json({
            message: `Cannot assign already assigned to ${name} with green`
          });
        }
      }

      // ============================================
      // NEW STEP: CHECK IF BLUE EXISTS WHEN TRYING GREEN OR BLUE (7-DAY RULE)
      // ============================================
      // This prevents GREEN or BLUE assignments if someone had BLUE in last 7 days
      // RED is still allowed

      if (status === "green" || status === "blue") {
        const recentBlueAnyone = await Assignment.findOne({
          role,
          type: "DATE",
          status: "blue",  // Look for BLUE assignments
          date: { $gte: startDate, $lte: endDate },
          employeeId: { $ne: employeeId },
          _id: { $ne: existingToday?._id }
        });

        if (recentBlueAnyone) {
          const diffDays = Math.floor(
            (endDate - new Date(recentBlueAnyone.date)) /
            (1000 * 60 * 60 * 24)
          );
          // CHANGED: daysLeft calculation uses 8
          const daysLeft = 8 - diffDays;

          const emp = await Employee.findById(recentBlueAnyone.employeeId);
          const name = emp ? emp.name : "another staff";

          return res.status(400).json({
            message: `Cannot assign already assigned to ${name} as blue`
          });
        }
      }

      // ============================================
      // STEP 5: SAVE THE ASSIGNMENT
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