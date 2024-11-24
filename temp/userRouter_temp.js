const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const productModel = require("../models/product-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "anonymous_abysmal";

router.get("/", function (req, res) {
  res.send("Hello There!!");
});

// Signup a new user
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/create", async (req, res) => {
  let { fullname, email, password, contact } = req.body;

  // Check if the user already exists
  let existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Generate tokens for email and contact
  // const emailToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });
  // const contactToken = jwt.sign({ contact }, JWT_SECRET, { expiresIn: "1d" });

  // Create a new user
  let newUser = await userModel.create({
    fullname,
    email,
    password: hashedPassword,
    contact,
    isadmin: false, // Default to non-admin user
  });

  // res.cookie("email_token", emailToken, { httpOnly: true, secure: false }); // Cookie for email

  // res.status(201).send({ message: "User created successfully", user: newUser });
  res.status(201).render("login");
});

// Login
router.get("/login", (req, res) => {
  res.render("login");
});

// Login POST route
// Login POST route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the database
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).send("User not found");
  }

  // Compare the password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send("Invalid password");
  }

  // Generate a new JWT token for the session
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

  // Set session cookie
  res.cookie("auth_token", token, { httpOnly: true, secure: false }); // Set secure: true in production

  // Redirect to the /users/home page after successful login
  res.redirect("/users/home");
});

// isAuthenticated Middleware
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.redirect("/users/login"); // Redirect to login page if not authenticated
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); // Allow the user to proceed to the next route
  } catch (err) {
    return res.redirect("/users/login"); // Redirect to login if the token is invalid or expired
  }
};

// GET route for /users/home (protected)
router.get("/home", isAuthenticated, async (req, res) => {
  try {
    const products = await productModel.find();
    if (products.length === 0) {
      return res.render("home", {
        message: "No products available yet.",
        products: [],
      });
    }
    res.render("home", { products }); // Pass the fetched products to the template
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Logout route (now on /users/logout)
router.get("/users/logout", (req, res) => {
  res.clearCookie("auth_token"); // Clear auth_token cookie
  res.redirect("/login"); // Redirect to login page
});



module.exports = router;
