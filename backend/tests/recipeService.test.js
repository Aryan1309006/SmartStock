const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const {
  extractAndParseJson,
  validateRecipePayload,
} = require("../src/services/recipeService");
const AppError = require("../src/utils/appError");

describe("Recipe Service - Response Parsing, Schema Validation & Error Resilience", () => {
  it("extractAndParseJson: handles raw clean JSON", () => {
    const raw = JSON.stringify({
      recipes: [
        {
          name: "Pasta Primavera",
          ingredients: ["Pasta", "Olive Oil", "Garlic"],
          steps: ["Boil pasta", "Sauté garlic in oil", "Toss together"],
          prepTime: 20,
          servings: 2,
          usesInventory: true,
          inventoryItemsUsed: ["Pasta", "Garlic"],
          missingIngredients: [],
        },
      ],
    });

    const parsed = extractAndParseJson(raw);
    assert.ok(parsed.recipes);
    assert.equal(parsed.recipes.length, 1);
    assert.equal(parsed.recipes[0].name, "Pasta Primavera");
  });

  it("extractAndParseJson: handles markdown code blocks with json identifier", () => {
    const rawWithFences = "```json\n" + JSON.stringify({
      recipes: [
        {
          name: "Stir Fry",
          ingredients: ["Tofu", "Broccoli", "Soy Sauce"],
          steps: ["Chop tofu", "Stir fry in pan"],
          prepTime: 15,
          servings: 2,
        },
      ],
    }) + "\n```";

    const parsed = extractAndParseJson(rawWithFences);
    assert.ok(parsed.recipes);
    assert.equal(parsed.recipes[0].name, "Stir Fry");
  });

  it("extractAndParseJson: throws AppError(502) on malformed output", () => {
    assert.throws(
      () => extractAndParseJson("Here is a recipe: not valid json"),
      (err) => err instanceof AppError && err.statusCode === 502,
    );
  });

  it("extractAndParseJson: throws AppError(502) on empty response", () => {
    assert.throws(
      () => extractAndParseJson(""),
      (err) => err instanceof AppError && err.statusCode === 502,
    );
  });

  it("validateRecipePayload: sanitizes missing fields, string-wrapped steps, and invalid numbers", () => {
    const messyPayload = {
      recipes: [
        {
          name: "   Quick Soup   ",
          ingredients: "Carrots, Onion", // string instead of array
          steps: "Chop veggies and boil",  // string instead of array
          prepTime: "25 minutes",          // string with text
          servings: "invalid",             // non-numeric
          usesInventory: "yes",            // non-boolean
        },
        {
          // Completely missing name and optional fields
          ingredients: ["Rice", "Water"],
          steps: ["Cook in pot"],
        },
      ],
    };

    const validated = validateRecipePayload(messyPayload, 3);
    assert.equal(validated.recipes.length, 2);

    const recipe1 = validated.recipes[0];
    assert.equal(recipe1.name, "Quick Soup");
    assert.deepEqual(recipe1.ingredients, ["Carrots, Onion"]);
    assert.deepEqual(recipe1.steps, ["Chop veggies and boil"]);
    assert.equal(recipe1.prepTime, 25);
    assert.equal(recipe1.servings, 3, "Falls back to defaultServings when non-numeric");
    assert.equal(typeof recipe1.usesInventory, "boolean");

    const recipe2 = validated.recipes[1];
    assert.equal(recipe2.name, "Recipe 2", "Provides sensible default name");
    assert.equal(recipe2.prepTime, 20, "Provides sensible default prepTime");
    assert.deepEqual(recipe2.missingIngredients, []);
    assert.deepEqual(recipe2.inventoryItemsUsed, []);
  });

  it("validateRecipePayload: safely handles empty recipe list", () => {
    const validated = validateRecipePayload({ recipes: [] });
    assert.deepEqual(validated, { recipes: [] });
  });

  it("validateRecipePayload: throws on null or non-object payload", () => {
    assert.throws(
      () => validateRecipePayload(null),
      (err) => err instanceof AppError && err.statusCode === 502,
    );
  });
});
