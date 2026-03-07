const SuperAdmin = require("../models/SuperAdmin");
const Admin = require("../models/Admin");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check SuperAdmin first
  const superAdmin = await SuperAdmin.findOne({ email, password });
  if (superAdmin) {
    return res.json({ role: "superadmin" });
  }

  // Check Admin (read-only)
  const admin = await Admin.findOne({ email, password });
  if (admin) {
    return res.json({ role: "admin" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
};
