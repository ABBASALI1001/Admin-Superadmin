// models/Assignment.js
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  monthYear: String,
  day: Number,
  type: String,
  employeeId: String,
  role: String,
  status: String,
  value: String,
  date: Date,
  restricted: {  // MUST HAVE THIS FIELD
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Assignment", assignmentSchema);