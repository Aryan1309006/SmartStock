const authService = require("../services/authService");
const asyncHandler = require("../middleware/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  res.cookie("token", result.token, authService.getCookieOptions());
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  res.cookie("token", result.token, authService.getCookieOptions());
  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

const getme = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.userId);
  return res.status(200).json({
    success: true,
    user,
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", authService.getCookieOptions());
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

module.exports = { register, login, getme, logout };
