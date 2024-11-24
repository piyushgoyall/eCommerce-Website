const userModel = require("../models/user-model");
const productModel = require("../models/product-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

module.exports.registeredUser = async function (req, res) {
  try {
    let { email, password, fullname } = req.body;

    let user = await userModel.findOne({ email: email });
    if (user)
      return res.status(401).send("You Already Have An Account, Please Login");

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            email,
            password,
            fullname,
          });
          let token = generateToken(user);
          res.cookie("token", token);
          res.send("User Created Successfully");
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};
