const mongoose = require("mongoose");
const Item = require("../models/item");
const { startOfToday, getDaysRemaining, parseLocalDate } = require("../utils/dateUtils");
const { calculateInventoryMetrics } = require("../utils/inventoryCalculations");

const getDashboardSummary = async (userId) => {
  const today = startOfToday();
  const items = await Item.find({ userId }).lean();

  const metrics = calculateInventoryMetrics(items, today);

  return {
    totalItems: metrics.totalItems,
    freshItems: metrics.freshItems,
    consumedItems: metrics.consumedItems,
    expiringItems: metrics.expiringItems,
    expiredItems: metrics.expiredItems,
    inventoryValue: metrics.inventoryValue,
  };
};

const getExpiringSoon = async (userId) => {
  const today = startOfToday();
  const items = await Item.find({
    userId,
    status: { $ne: "consumed" },
    consumedAt: null,
  }).lean();

  const expiringItems = items
    .map((item) => ({
      ...item,
      daysRemaining: getDaysRemaining(item.expiryDate, today),
    }))
    .filter((item) => item.status !== "expired" && item.daysRemaining >= 0 && item.daysRemaining <= 7)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  return expiringItems;
};

const getRecentlyConsumed = async (userId) => {
  const today = startOfToday();
  const allItems = await Item.find({ userId }).lean();

  const historyItems = allItems
    .filter((item) => {
      if (item.status === "consumed" || Boolean(item.consumedAt)) return true;
      if (item.status === "expired") return true;
      return getDaysRemaining(item.expiryDate, today) < 0;
    })
    .sort((a, b) => {
      const dateA = new Date(a.consumedAt || a.expiryDate || 0);
      const dateB = new Date(b.consumedAt || b.expiryDate || 0);
      return dateB.getTime() - dateA.getTime();
    });

  return historyItems;
};

const getCategoryDistribution = async (userId) => {
  const userObjectId = typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

  const categoryCount = await Item.aggregate([
    {
      $match: {
        userId: userObjectId,
        status: { $ne: "consumed" },
        consumedAt: null,
      },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalQuantity: { $sum: "$quantity" },
      },
    },
    { $sort: { count: -1, _id: 1 } },
    {
      $project: {
        _id: 0,
        name: "$_id",
        count: 1,
        totalQuantity: 1,
      },
    },
  ]);

  return categoryCount;
};

module.exports = {
  getDashboardSummary,
  getExpiringSoon,
  getRecentlyConsumed,
  getCategoryDistribution,
};
