const { registration, login } = require("../models/admin");
const express = require("express");
const router = express.Router();

//admins table
router.post("/admin/register", registration);
router.post("/admin/login", login);

module.exports = router;
