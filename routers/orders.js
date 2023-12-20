const { getOrders, addOrders, changeStatus } = require("../models/order");
const { checkAuthAdmin, checkAuthUser } = require("../middleware");
const express = require("express");
const router = express.Router();

//orders table
router.get("/order/view", checkAuthAdmin, getOrders);
router.post("/order/add", checkAuthUser, addOrders);
router.put("/order/changeStatus/:id", checkAuthAdmin, changeStatus);

module.exports = router;
