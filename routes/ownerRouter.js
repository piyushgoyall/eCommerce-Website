const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model")

router.get("/", function (req, res) {
  res.send("Hello There!!");
});

router.get("/create", (req, res) => {
  res.send("Working!!");
});
module.exports = router;
