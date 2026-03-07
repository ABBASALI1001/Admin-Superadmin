const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: String,
  totalCount: Number,
});

module.exports = mongoose.model("Employee", employeeSchema);
