const Item = require("../models/item");

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const getDaysRemaining = (expiryDate, today = startOfToday()) => {
  const expiry = new Date(`${expiryDate}T00:00:00`);
  return Math.ceil((expiry - today) / MS_PER_DAY);
};

const dashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = startOfToday();
    const items = await Item.find({ userId }).lean();

    const activeItems = items.filter((item) => item.status !== "consumed");
    const daysRemaining = activeItems.map((item) => ({
      item,
      days: getDaysRemaining(item.expiryDate, today),
    }));

    const totalItems = items.length;
    const freshItems = daysRemaining.filter(({ days }) => days > 7).length;
    const consumedItems = items.filter(
      (item) => item.status === "consumed" || item.consumedAt,
    ).length;
    const expiringItems = daysRemaining.filter(
      ({ days }) => days >= 0 && days <= 7,
    ).length;
    const expiredItems = daysRemaining.filter(({ days }) => days < 0).length;

    const inventoryValue = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    res.status(200).json({
      success: true,
      data: {
        totalItems,
        freshItems,
        consumedItems,
        expiringItems,
        expiredItems,
        inventoryValue,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const expiringSoon = async (req, res) => {
  try {
    const today = startOfToday();
    const items = await Item.find({
      userId: req.user.userId,
      status: { $ne: "consumed" },
    }).lean();

    const expiringItems = items
      .map((item) => ({
        ...item,
        daysRemaining: getDaysRemaining(item.expiryDate, today),
      }))
      .filter((item) => item.daysRemaining >= 0 && item.daysRemaining <= 7)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);

    res.status(200).json({
      success: true,
      data: { expiringSoon: expiringItems },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const recentlyConsumed = async (req, res) => {
  try {
    const items = await Item.find({
      userId: req.user.userId,
      consumedAt: { $ne: null },
    })
      .sort({ consumedAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: { recentlyConsumed: items },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const categoryCount = async (req, res) => {
  try {
    const categoryCount = await Item.aggregate([
      {
        $match: {
          userId: req.user.userId,
          status: "active",
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

    res.status(200).json({
      success: true,
      data: { categories: categoryCount },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { dashboard, expiringSoon, recentlyConsumed, categoryCount };
