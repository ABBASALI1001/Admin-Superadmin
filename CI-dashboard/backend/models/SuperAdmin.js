const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema({
  email: String,
  password: String,
});

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
