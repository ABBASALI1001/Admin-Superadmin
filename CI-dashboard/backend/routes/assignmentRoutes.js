const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");

router.get("/:monthYear", assignmentController.getAssignments);
router.post("/", assignmentController.saveAssignment);
router.delete("/", assignmentController.deleteAssignment);

module.exports = router;