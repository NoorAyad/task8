const { registration, login } = require("../models/user");
const express = require("express");
const router = express.Router();

//users table
router.post("/user/register", registration);
router.post("/user/login", login);

module.exports = router;
