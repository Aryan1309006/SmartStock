const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user");
const AppError = require("../utils/appError");

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT_SECRET is not configured on the server", 500);
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
});

const register = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new AppError("Incomplete credential", 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const trimmedName = String(name).trim();

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters long", 400);
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: trimmedName,
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

const getUserById = async (userId) => {
  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  const user = await User.findById(userId).select("-password").lean();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

module.exports = {
  register,
  login,
  getUserById,
  generateToken,
  getCookieOptions,
};
