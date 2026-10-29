const analyticsService = require("../services/analyticsService");
const asyncHandler = require("../middleware/asyncHandler");

const monthlyOverview = asyncHandler(async (req, res) => {
  const result = await analyticsService.getMonthlyOverview(req.user.userId);
  return res.status(200).json({
    success: true,
    data: result,
  });
});

const consumptionOverview = asyncHandler(async (req, res) => {
  const result = await analyticsService.getConsumptionOverview(req.user.userId);
  return res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  monthlyOverview,
  consumptionOverview,
};
