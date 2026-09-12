const Item = require("../models/item");

const getMonthKey = (dateValue) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const getCurrentMonthKey = () => getMonthKey(new Date());

const getDateKey = (dateValue) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString().slice(0, 10);
};

const monthlyOverview = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.userId }).lean();
    const currentMonth = getCurrentMonthKey();
    const monthlyItems = items.filter(
      (item) => getMonthKey(item.purchaseDate) === currentMonth,
    );

    const added = monthlyItems.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    );

    const consumed = items
      .filter((item) => getMonthKey(item.consumedAt) === currentMonth)
      .reduce((total, item) => total + Number(item.quantity || 0), 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expired = monthlyItems.filter((item) => {
      const expiryDate = new Date(`${item.expiryDate}T00:00:00`);
      return item.status === "expired" || expiryDate < today;
    }).length;

    const value = monthlyItems.reduce(
      (total, item) =>
        total + Number(item.quantity || 0) * Number(item.price || 0),
      0,
    );

    const monthlyData = {};

    items.forEach((item) => {
      const addedMonth = getMonthKey(item.purchaseDate);

      if (addedMonth) {
        monthlyData[addedMonth] ??= {
          month: addedMonth,
          added: 0,
          consumed: 0,
        };
        monthlyData[addedMonth].added += Number(item.quantity || 0);
      }

      const consumedMonth = getMonthKey(item.consumedAt);

      if (consumedMonth) {
        monthlyData[consumedMonth] ??= {
          month: consumedMonth,
          added: 0,
          consumed: 0,
        };
        monthlyData[consumedMonth].consumed += Number(item.quantity || 0);
      }
    });

    const chartData = Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month),
    );

    res.status(200).json({
      success: true,
      data: {
        summary: { added, consumed, expired, value },
        chartData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const consumptionOverview = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.userId }).lean();
    const dailyData = {};

    items.forEach((item) => {
      const quantity = Number(item.quantity || 0);
      const addedDate = getDateKey(item.purchaseDate);

      if (addedDate) {
        dailyData[addedDate] ??= {
          date: addedDate,
          added: 0,
          consumed: 0,
        };
        dailyData[addedDate].added += quantity;
      }

      const consumedDate =
        item.status === "consumed" ? getDateKey(item.consumedAt) : null;

      if (consumedDate) {
        dailyData[consumedDate] ??= {
          date: consumedDate,
          added: 0,
          consumed: 0,
        };
        dailyData[consumedDate].consumed += quantity;
      }
    });

    const chartData = Object.values(dailyData).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    res.status(200).json({
      success: true,
      data: { chartData },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { monthlyOverview, consumptionOverview };
