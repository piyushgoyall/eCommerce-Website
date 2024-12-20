const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");

router.get("/", function (req, res) {
  res.send("Hello There!!");
});

router.post("/create", async (req, res) => {
  let owners = await ownerModel.find();
  if (owners.length > 0) {
               return res
              .status(503)
              .send("You don't permission to create a new owner");
  }

  let { fullname, email, password } = req.body;
  let createdOwner = await ownerModel.create({
    fullname,
    email,
    password,
  });
  res.status(200).send(createdOwner);
});

module.exports = router;
