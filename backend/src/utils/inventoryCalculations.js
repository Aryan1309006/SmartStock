const { startOfToday, getDaysRemaining } = require("./dateUtils");

/**
 * Authoritative inventory calculation logic for SmartStock.
 *
 * Mandatory Rule:
 * - Total Items must count only inventory that has not been consumed.
 * - Consumed inventory must not contribute to Total Items.
 * - Records vs Quantities:
 *   - totalItems is the count of active inventory records (unconsumed items).
 *   - consumedItems is the count of consumed inventory records.
 *   - freshItems, expiringItems, and expiredItems are calculated on unconsumed items only.
 *   - inventoryValue is the total value of unconsumed non-expired items.
 */
const calculateInventoryMetrics = (items = [], today = startOfToday()) => {
  let freshItems = 0;
  let expiringItems = 0;
  let expiredItems = 0;
  let consumedItems = 0;

  let activeRecordCount = 0;
  let consumedRecordCount = 0;
  let totalActiveQuantity = 0;
  let totalConsumedQuantity = 0;
  let inventoryValue = 0;

  for (const item of items) {
    const isConsumed = item.status === "consumed" || Boolean(item.consumedAt);
    const quantity = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;

    if (isConsumed) {
      consumedItems++;
      consumedRecordCount++;
      totalConsumedQuantity += quantity;
      continue;
    }

    activeRecordCount++;
    totalActiveQuantity += quantity;

    const days = getDaysRemaining(item.expiryDate, today);
    const isExpired = item.status === "expired" || days < 0;

    if (isExpired) {
      expiredItems++;
    } else if (days <= 7) {
      expiringItems++;
      inventoryValue += price * quantity;
    } else {
      freshItems++;
      inventoryValue += price * quantity;
    }
  }

  // totalItems is strictly unconsumed records: fresh + expiring + expired
  const totalItems = freshItems + expiringItems + expiredItems;

  return {
    totalItems,
    freshItems,
    expiringItems,
    expiredItems,
    consumedItems,
    inventoryValue: Number(inventoryValue.toFixed(2)),
    // Explicit quantity breakdowns for callers that need quantities vs record counts
    totalActiveQuantity,
    totalConsumedQuantity,
    activeRecordCount,
    consumedRecordCount,
  };
};

module.exports = { calculateInventoryMetrics };
