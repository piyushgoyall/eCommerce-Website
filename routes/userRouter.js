const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const productModel = require("../models/product-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const {registeredUser} = require("../controllers/authController")

router.get("/", function (req, res) {
  res.send("Hello There!!");
});

router.post("/register", registeredUser);

module.exports = router;
