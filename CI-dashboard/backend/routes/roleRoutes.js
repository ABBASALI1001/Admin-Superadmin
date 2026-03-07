const express = require("express");
const router = express.Router();
const {
  getRoles,
  addRole,
  deleteRole,
} = require("../controllers/roleController");

router.get("/", getRoles);
router.post("/", addRole);
router.delete("/:id", deleteRole);

module.exports = router;