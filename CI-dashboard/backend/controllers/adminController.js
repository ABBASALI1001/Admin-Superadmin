const Admin = require("../models/Admin");

// Get all admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admins" });
  }
};

// Update admin
exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  try {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.email = email;
    admin.password = password;
    await admin.save();

    res.json({ message: "Admin updated successfully", admin });
  } catch (err) {
    res.status(500).json({ message: "Error updating admin" });
  }
};
