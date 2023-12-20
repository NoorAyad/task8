const { checkAuthAdmin, checkAuthUser } = require("../middleware");
const {
  Products,
  addProducts,
  updateProducts,
  deleteProducts,
} = require("../models/product");
const express = require("express");
const router = express.Router();

//products table
router.get("/products/view", checkAuthUser, Products);
router.post("/products/add", checkAuthAdmin, addProducts);
router.put("/products/update/:id", checkAuthAdmin, updateProducts);
router.delete("/products/delete/:id", checkAuthAdmin, deleteProducts);

module.exports = router;
