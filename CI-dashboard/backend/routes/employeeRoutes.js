const express = require("express");
const router = express.Router();
const {
  getEmployees,
  addEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

router.get("/", getEmployees);
router.post("/", addEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;
