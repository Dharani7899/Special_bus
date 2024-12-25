const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const JWT_SECRET = "nvfjhgrnfng94549nfvnfjb()b78575487458fbjrhg?[]nbfbvjh89b";
const mongoUrl = "mongodb://localhost:27017/Students";

app.use(cors());
app.use(express.json());

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

require("./userDetails");
require("./ticketDetails"); // Include the ticket model
const User = mongoose.model("UserInfo");
const Ticket = mongoose.model("Ticket"); // Ticket model

// User registration endpoint
app.post("/register", async (req, res) => {
  const { fname, lname, email, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.json({ status: "error", error: "User exists" });
    }

    await User.create({ fname, lname, email, password: encryptedPassword });
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: "An error occurred" });
  }
});

// User login endpoint
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ status: "error", error: "User not found" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET);
    return res.json({ status: "ok", data: token });
  }

  res.json({ status: "error", error: "Invalid password" });
});

// Ticket booking endpoint
app.post("/book-ticket", async (req, res) => {
  const { studentName, applicationNumber, hostelName, zone, stopping } =
    req.body;

  try {
    await Ticket.create({
      studentName,
      applicationNumber,
      hostelName,
      zone,
      stopping,
    });
    res.json({ status: "ok" });
  } catch (error) {
    res.json({
      status: "error",
      error: "An error occurred while booking the ticket",
    });
  }
});

// Get tickets by zone
app.get("/tickets-by-zone", async (req, res) => {
  const { zone } = req.query;

  try {
    const tickets = await Ticket.find({ zone });
    res.json({ status: "ok", tickets });
  } catch (error) {
    res.json({
      status: "error",
      error: "An error occurred while fetching tickets",
    });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
