const Role = require("../models/Role");

exports.getRoles = async (req, res) => {
  res.json(await Role.find());
};

exports.addRole = async (req, res) => {
  const newRole = new Role(req.body);
  await newRole.save();
  res.json(newRole);
};

exports.deleteRole = async (req, res) => {
  await Role.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};