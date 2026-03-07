const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/", adminController.getAdmins);
router.put("/:id", adminController.updateAdmin);

module.exports = router;
