import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ✅ Buyer Register
export const registerBuyer = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ name, email, password, role: "buyer" });
    const token = createToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error("❌ Buyer register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ✅ Buyer Login
export const loginBuyer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "buyer" });
    if (!user) return res.status(404).json({ message: "Buyer not found" });

    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = createToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error("❌ Buyer login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// ✅ Seller Register
export const registerSeller = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ name, email, password, role: "seller" });
    const token = createToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error("❌ Seller register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ✅ Seller Login
export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "seller" });
    if (!user) return res.status(404).json({ message: "Seller not found" });

    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = createToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error("❌ Seller login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
