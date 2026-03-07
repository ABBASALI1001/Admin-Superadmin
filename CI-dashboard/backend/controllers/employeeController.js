const Employee = require("../models/Employee");

exports.getEmployees = async (req, res) => {
  res.json(await Employee.find());
};

exports.addEmployee = async (req, res) => {
  const newEmp = new Employee(req.body);
  await newEmp.save();
  res.json(newEmp);
};

exports.deleteEmployee = async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
