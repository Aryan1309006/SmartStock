const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { calculateInventoryMetrics } = require("../src/utils/inventoryCalculations");

describe("Critical Inventory Rule - calculateInventoryMetrics", () => {
  const referenceDate = new Date("2026-10-23T00:00:00");

  it("Case 1: Empty inventory returns total = 0, consumed = 0", () => {
    const result = calculateInventoryMetrics([], referenceDate);
    assert.equal(result.totalItems, 0);
    assert.equal(result.consumedItems, 0);
    assert.equal(result.freshItems, 0);
    assert.equal(result.expiringItems, 0);
    assert.equal(result.expiredItems, 0);
    assert.equal(result.inventoryValue, 0);
  });

  it("Case 2: Five active items and two consumed items returns total = 5, consumed = 2", () => {
    const items = [
      // 5 active unconsumed items
      { name: "Apples", status: "active", expiryDate: "2026-11-15", price: 10, quantity: 2 },
      { name: "Rice", status: "active", expiryDate: "2026-12-01", price: 50, quantity: 1 },
      { name: "Milk", status: "active", expiryDate: "2026-10-26", price: 30, quantity: 1 }, // expiring
      { name: "Yogurt", status: "active", expiryDate: "2026-10-25", price: 20, quantity: 1 }, // expiring
      { name: "Bread", status: "active", expiryDate: "2026-11-05", price: 15, quantity: 1 },
      // 2 consumed items
      { name: "Cereal", status: "consumed", consumedAt: new Date("2026-10-20"), expiryDate: "2026-11-01", price: 40, quantity: 1 },
      { name: "Juice", status: "consumed", consumedAt: new Date("2026-10-22"), expiryDate: "2026-10-24", price: 25, quantity: 1 },
    ];

    const result = calculateInventoryMetrics(items, referenceDate);
    assert.equal(result.totalItems, 5, "Total items must be exactly 5, excluding consumed");
    assert.equal(result.consumedItems, 2, "Consumed items must be exactly 2");
    assert.equal(result.freshItems, 3);
    assert.equal(result.expiringItems, 2);
    assert.equal(result.expiredItems, 0);
  });

  it("Case 3: All items consumed returns total = 0", () => {
    const items = [
      { name: "Eggs", status: "consumed", consumedAt: new Date(), expiryDate: "2026-10-30" },
      { name: "Butter", status: "consumed", consumedAt: new Date(), expiryDate: "2026-11-10" },
      { name: "Cheese", status: "consumed", consumedAt: new Date(), expiryDate: "2026-10-28" },
    ];

    const result = calculateInventoryMetrics(items, referenceDate);
    assert.equal(result.totalItems, 0, "When all items are consumed, totalItems must be 0");
    assert.equal(result.consumedItems, 3);
    assert.equal(result.freshItems, 0);
    assert.equal(result.expiringItems, 0);
    assert.equal(result.expiredItems, 0);
    assert.equal(result.inventoryValue, 0);
  });

  it("Case 4: Mixed fresh, expiring, expired, and consumed inventory - consumed records do not contribute to active total or breakdowns", () => {
    const items = [
      // Fresh (> 7 days from 2026-10-23 => after 2026-10-30)
      { name: "Pasta", status: "active", expiryDate: "2026-11-15", price: 10, quantity: 1 },
      { name: "Oats", status: "active", expiryDate: "2026-11-20", price: 20, quantity: 2 }, // value 40
      // Expiring (0 to 7 days => 2026-10-23 to 2026-10-30)
      { name: "Berries", status: "active", expiryDate: "2026-10-25", price: 15, quantity: 1 },
      // Expired (< 0 days or status expired)
      { name: "Old Bread", status: "active", expiryDate: "2026-10-20", price: 5, quantity: 1 }, // days < 0
      { name: "Expired Sauce", status: "expired", expiryDate: "2026-10-15", price: 8, quantity: 1 },
      // Consumed
      { name: "Consumed Meat", status: "consumed", consumedAt: new Date("2026-10-21"), expiryDate: "2026-10-22", price: 50, quantity: 1 },
      { name: "Consumed Fish", status: "consumed", consumedAt: new Date("2026-10-22"), expiryDate: "2026-10-25", price: 60, quantity: 1 },
    ];

    const result = calculateInventoryMetrics(items, referenceDate);

    // Total active records must equal fresh + expiring + expired
    assert.equal(result.freshItems, 2);
    assert.equal(result.expiringItems, 1);
    assert.equal(result.expiredItems, 2);
    assert.equal(result.totalItems, 5, "Total items must be exactly 2+1+2 = 5");
    assert.equal(result.consumedItems, 2);
    // Value: Pasta (10) + Oats (40) + Berries (15) = 65 (expired and consumed excluded)
    assert.equal(result.inventoryValue, 65);
  });

  it("Case 5: Changing an item from active to consumed updates the totals correctly", () => {
    const items = [
      { id: "1", name: "Milk", status: "active", expiryDate: "2026-10-28", price: 30, quantity: 1 },
      { id: "2", name: "Bread", status: "active", expiryDate: "2026-10-29", price: 20, quantity: 1 },
    ];

    const initial = calculateInventoryMetrics(items, referenceDate);
    assert.equal(initial.totalItems, 2);
    assert.equal(initial.consumedItems, 0);

    // Transition item 1 to consumed
    const updatedItems = items.map((it) =>
      it.id === "1" ? { ...it, status: "consumed", consumedAt: new Date("2026-10-23") } : it,
    );

    const updated = calculateInventoryMetrics(updatedItems, referenceDate);
    assert.equal(updated.totalItems, 1, "Total items must decrease from 2 to 1");
    assert.equal(updated.consumedItems, 1, "Consumed items must increase from 0 to 1");
  });

  it("Case 6: Changing a consumed item back to active updates the totals correctly", () => {
    const items = [
      { id: "1", name: "Milk", status: "consumed", consumedAt: new Date("2026-10-23"), expiryDate: "2026-10-28", price: 30, quantity: 1 },
      { id: "2", name: "Bread", status: "active", expiryDate: "2026-10-29", price: 20, quantity: 1 },
    ];

    const initial = calculateInventoryMetrics(items, referenceDate);
    assert.equal(initial.totalItems, 1);
    assert.equal(initial.consumedItems, 1);

    // Transition item 1 back to active (restore)
    const restoredItems = items.map((it) =>
      it.id === "1" ? { ...it, status: "active", consumedAt: null } : it,
    );

    const restored = calculateInventoryMetrics(restoredItems, referenceDate);
    assert.equal(restored.totalItems, 2, "Total items must increase from 1 to 2");
    assert.equal(restored.consumedItems, 0, "Consumed items must decrease from 1 to 0");
  });

  it("Case 7: Pagination and filtering do not affect backend authoritative metrics", () => {
    // 10 items in total
    const fullInventory = Array.from({ length: 10 }, (_, i) => ({
      name: `Item ${i + 1}`,
      status: i < 8 ? "active" : "consumed",
      consumedAt: i >= 8 ? new Date() : null,
      expiryDate: "2026-11-20",
      price: 10,
      quantity: 1,
    }));

    // Authoritative backend metrics run on full inventory
    const backendMetrics = calculateInventoryMetrics(fullInventory, referenceDate);
    assert.equal(backendMetrics.totalItems, 8);
    assert.equal(backendMetrics.consumedItems, 2);

    // If client pages items (e.g. page 1 of 5 items)
    const page1 = fullInventory.slice(0, 5);
    // Page 1 has 5 items, but authoritative totalItems remains 8
    assert.equal(page1.length, 5);
    assert.equal(backendMetrics.totalItems, 8);
  });

  it("Case 8: Distinguishes between record count and quantity sum without mixing definitions", () => {
    const items = [
      { name: "Apples", status: "active", quantity: 5, price: 10, expiryDate: "2026-11-15" },
      { name: "Bananas", status: "active", quantity: 10, price: 5, expiryDate: "2026-11-15" },
      { name: "Consumed Oranges", status: "consumed", consumedAt: new Date(), quantity: 4, price: 8, expiryDate: "2026-10-20" },
    ];

    const metrics = calculateInventoryMetrics(items, referenceDate);
    assert.equal(metrics.totalItems, 2, "Record count is 2 active products");
    assert.equal(metrics.activeRecordCount, 2);
    assert.equal(metrics.totalActiveQuantity, 15, "Sum of active quantities is 5 + 10 = 15");
    assert.equal(metrics.consumedItems, 1, "Consumed record count is 1");
    assert.equal(metrics.totalConsumedQuantity, 4, "Consumed quantity sum is 4");
  });
});
