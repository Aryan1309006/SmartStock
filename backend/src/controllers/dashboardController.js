const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../middleware/asyncHandler");

const dashboard = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getDashboardSummary(req.user.userId);
  return res.status(200).json({
    success: true,
    data: summary,
  });
});

const expiringSoon = asyncHandler(async (req, res) => {
  const expiringItems = await dashboardService.getExpiringSoon(req.user.userId);
  return res.status(200).json({
    success: true,
    data: { expiringSoon: expiringItems },
  });
});

const recentlyConsumed = asyncHandler(async (req, res) => {
  const historyItems = await dashboardService.getRecentlyConsumed(req.user.userId);
  return res.status(200).json({
    success: true,
    data: { recentlyConsumed: historyItems },
  });
});

const categoryCount = asyncHandler(async (req, res) => {
  const categories = await dashboardService.getCategoryDistribution(req.user.userId);
  return res.status(200).json({
    success: true,
    data: { categories },
  });
});

module.exports = {
  dashboard,
  expiringSoon,
  recentlyConsumed,
  categoryCount,
};
