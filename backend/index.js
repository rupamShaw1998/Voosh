const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const app = express();
app.use(express.json());

mongoose.connect("mongodb+srv://rupamShaw1998:rupam@cluster0.5rqasic.mongodb.net/Voosh?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Order schema
const orderSchema = new mongoose.Schema({
  userId: String,
  subTotal: Number,
  phoneNumber: String,
});
const Order = mongoose.model("Order", orderSchema);

// Register a new user
app.post("/add-user", async (req, res) => {
  const { name, phone, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    phone,
    password: hashedPassword,
  });

  await user.save();
  res.status(201).json({ message: "User registered successfully" });
});

// Login user
app.post("/login-user", async (req, res) => {
  const { phone, password, login_by } = req.body;

  let user;
  if (login_by === "google") {
    const client = new OAuth2Client("YOUR_GOOGLE_CLIENT_ID");
    const ticket = await client.verifyIdToken({
      idToken: password,
      audience: "YOUR_GOOGLE_CLIENT_ID",
    });
    const payload = ticket.getPayload();
    const email = payload.email;

    user = await User.findOne({ phone: email });
  } else {
    user = await User.findOne({ phone });
  }

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, "your-secret-key", {
    expiresIn: "1h",
  });

  res.status(200).json({ token });
});

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  jwt.verify(token, "your-secret-key", (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decodedToken.userId;
    next();
  });
};

// Add a new order
app.post("/add-order", authenticate, async (req, res) => {
  const { userId, subTotal, phoneNumber } = req.body;

  const order = new Order({
    userId,
    subTotal,
    phoneNumber,
  });

  await order.save();
  res.status(201).json({ message: "Order added successfully" });
});

// Get order details for a user
app.get("/get-order", authenticate, async (req, res) => {
  const { userId } = req.query;

  const orders = await Order.find({ userId });
  res.status(200).json({ orders });
});

// Start the server
app.listen(5000, () => {
  console.log("Server started on port 3000");
});
