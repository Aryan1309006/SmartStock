const Item = require("../models/item");
const {
  startOfToday,
  getMonthKey,
  getCurrentMonthKey,
  getDateKey,
  parseLocalDate,
} = require("../utils/dateUtils");

const getMonthlyOverview = async (userId) => {
  const items = await Item.find({ userId }).lean();
  const currentMonth = getCurrentMonthKey();
  const today = startOfToday();

  const monthlyItems = items.filter(
    (item) => getMonthKey(item.purchaseDate) === currentMonth,
  );

  const added = monthlyItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  // Consumed this month
  const consumed = items
    .filter(
      (item) =>
        (item.status === "consumed" || Boolean(item.consumedAt)) &&
        getMonthKey(item.consumedAt) === currentMonth,
    )
    .reduce((total, item) => total + Number(item.quantity || 0), 0);

  // Expired items must NOT include consumed items
  const expired = monthlyItems.filter((item) => {
    const isConsumed = item.status === "consumed" || Boolean(item.consumedAt);
    if (isConsumed) return false;

    const expiryDate = parseLocalDate(item.expiryDate);
    return item.status === "expired" || (expiryDate && expiryDate < today);
  }).length;

  const value = monthlyItems
    .filter((item) => item.status !== "consumed" && !item.consumedAt)
    .reduce(
      (total, item) =>
        total + Number(item.quantity || 0) * Number(item.price || 0),
      0,
    );

  const monthlyData = {};

  items.forEach((item) => {
    const addedMonth = getMonthKey(item.purchaseDate);
    const quantity = Number(item.quantity || 0);

    if (addedMonth) {
      monthlyData[addedMonth] ??= {
        month: addedMonth,
        added: 0,
        consumed: 0,
      };
      monthlyData[addedMonth].added += quantity;
    }

    const isConsumed = item.status === "consumed" || Boolean(item.consumedAt);
    const consumedMonth = isConsumed ? getMonthKey(item.consumedAt) : null;

    if (consumedMonth) {
      monthlyData[consumedMonth] ??= {
        month: consumedMonth,
        added: 0,
        consumed: 0,
      };
      monthlyData[consumedMonth].consumed += quantity;
    }
  });

  const chartData = Object.values(monthlyData).sort((a, b) =>
    a.month.localeCompare(b.month),
  );

  return {
    summary: {
      added,
      consumed,
      expired,
      value: Number(value.toFixed(2)),
    },
    chartData,
  };
};

const getConsumptionOverview = async (userId) => {
  const items = await Item.find({ userId }).lean();
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

    const isConsumed = item.status === "consumed" || Boolean(item.consumedAt);
    const consumedDate = isConsumed ? getDateKey(item.consumedAt) : null;

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

  return { chartData };
};

module.exports = {
  getMonthlyOverview,
  getConsumptionOverview,
};
