const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Item = require("../src/models/item");
const { suggestRecipes } = require("../src/services/recipeService");
const { createItem, consumeItem, restoreItem } = require("../src/services/inventoryService");
const AppError = require("../src/utils/appError");

describe("Inventory and Recipe Service Validation and Rules", () => {
  const fakeUserId = new mongoose.Types.ObjectId().toString();

  it("createItem: throws on missing required fields", async () => {
    await assert.rejects(
      async () => {
        await createItem(fakeUserId, { name: "Milk" }); // missing category, dates, price
      },
      (err) => err instanceof AppError && err.statusCode === 400 && err.message.includes("Incomplete"),
    );
  });

  it("createItem: throws on invalid category", async () => {
    await assert.rejects(
      async () => {
        await createItem(fakeUserId, {
          name: "Carrot",
          category: "NonExistentCategory",
          purchaseDate: "2026-10-20",
          expiryDate: "2026-11-20",
          price: 10,
        });
      },
      (err) => err instanceof AppError && err.statusCode === 400 && err.message.includes("Invalid category"),
    );
  });

  it("suggestRecipes: throws on invalid servings", async () => {
    await assert.rejects(
      async () => {
        await suggestRecipes(fakeUserId, { servings: -1 });
      },
      (err) => err instanceof AppError && err.statusCode === 400 && err.message.includes("servings"),
    );
  });

  it("suggestRecipes: throws on non-array avoid parameter", async () => {
    await assert.rejects(
      async () => {
        await suggestRecipes(fakeUserId, { avoid: "nuts" });
      },
      (err) => err instanceof AppError && err.statusCode === 400 && err.message.includes("avoid"),
    );
  });

  it("suggestRecipes: when GROQ_API_KEY is not configured or empty, throws 503 AppError", async () => {
    const originalKey = process.env.GROQ_API_KEY;
    try {
      delete process.env.GROQ_API_KEY;

      // Mock Item.find to return an eligible food item
      const originalFind = Item.find;
      Item.find = () => ({
        sort: () => ({
          lean: async () => [
            {
              name: "Rice",
              category: "Pantry",
              quantity: 1,
              status: "active",
              expiryDate: "2026-11-20",
            },
          ],
        }),
      });

      await assert.rejects(
        async () => {
          await suggestRecipes(fakeUserId, { preferences: "quick", servings: 2 });
        },
        (err) => err instanceof AppError && err.statusCode === 503 && err.message.includes("GROQ_API_KEY"),
      );

      Item.find = originalFind;
    } finally {
      process.env.GROQ_API_KEY = originalKey;
    }
  });

  it("suggestRecipes: returns friendly message and empty recipes when user has no eligible food items", async () => {
    const originalFind = Item.find;
    // Mock Item.find to return only expired or non-food items
    Item.find = () => ({
      sort: () => ({
        lean: async () => [
          // Expired food item
          {
            name: "Milk",
            category: "Dairy",
            quantity: 1,
            status: "expired",
            expiryDate: "2026-10-10",
          },
        ],
      }),
    });

    try {
      const result = await suggestRecipes(fakeUserId, { preferences: "healthy", servings: 2 });
      assert.deepEqual(result.recipes, []);
      assert.ok(result.message.includes("Add available food items"));
    } finally {
      Item.find = originalFind;
    }
  });

  it("suggestRecipes: strictly excludes consumed items and items past expiry from AI input", async () => {
    const originalFind = Item.find;
    Item.find = () => ({
      sort: () => ({
        lean: async () => [
          // Consumed item - MUST BE EXCLUDED
          {
            name: "Steak",
            category: "Other",
            quantity: 1,
            status: "consumed",
            consumedAt: new Date("2026-10-20"),
            expiryDate: "2026-10-25",
          },
          // Past expiry date - MUST BE EXCLUDED
          {
            name: "Old Yogurt",
            category: "Dairy",
            quantity: 1,
            status: "active",
            expiryDate: "2026-10-10",
          },
        ],
      }),
    });

    try {
      const result = await suggestRecipes(fakeUserId, { preferences: "healthy", servings: 2 });
      assert.deepEqual(result.recipes, [], "No recipes generated when only consumed/expired items exist");
      assert.ok(result.message);
    } finally {
      Item.find = originalFind;
    }
  });
});
