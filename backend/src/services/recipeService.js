const Groq = require("groq-sdk");
const Item = require("../models/item");
const SavedRecipe = require("../models/savedRecipes");
const AppError = require("../utils/appError");
const { startOfToday, parseLocalDate } = require("../utils/dateUtils");

const FOOD_CATEGORIES = ["Pantry", "Dairy", "Other"];
const DEFAULT_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
const REQUEST_TIMEOUT_MS = 25000;

let groqClientInstance = null;

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "" || apiKey === "your_groq_api_key_here") {
    throw new AppError(
      "AI recipe suggestions are currently unavailable: GROQ_API_KEY is not configured.",
      503,
    );
  }

  if (!groqClientInstance) {
    groqClientInstance = new Groq({ apiKey: apiKey.trim() });
  }

  return groqClientInstance;
};

/**
 * Extracts and cleans JSON from a string that may be wrapped in markdown code blocks.
 */
const extractAndParseJson = (text) => {
  if (!text || typeof text !== "string") {
    throw new AppError("AI provider returned an empty response", 502);
  }

  let cleaned = text.trim();

  // Strip markdown code fences if present (e.g. ```json ... ``` or ``` ... ```)
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (parseErr) {
    // Attempt fallback by matching outermost { ... }
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        // Fall through to error
      }
    }
    throw new AppError("AI provider returned malformed JSON output", 502);
  }
};

/**
 * Validates and normalizes the parsed AI recipe response.
 */
const validateRecipePayload = (payload, defaultServings = 2) => {
  if (!payload || typeof payload !== "object") {
    throw new AppError("Invalid recipe data structure returned by AI provider", 502);
  }

  const rawRecipes = Array.isArray(payload.recipes) ? payload.recipes : [];
  if (rawRecipes.length === 0) {
    return { recipes: [] };
  }

  const validatedRecipes = rawRecipes.map((item, index) => {
    const name = typeof item.name === "string" && item.name.trim()
      ? item.name.trim()
      : `Recipe ${index + 1}`;

    const ingredients = Array.isArray(item.ingredients)
      ? item.ingredients.map((ing) => String(ing).trim()).filter(Boolean)
      : typeof item.ingredients === "string"
        ? [item.ingredients.trim()]
        : [];

    const steps = Array.isArray(item.steps)
      ? item.steps.map((st) => String(st).trim()).filter(Boolean)
      : typeof item.steps === "string"
        ? [item.steps.trim()]
        : [];

    const prepTimeNum = parseInt(item.prepTime, 10);
    const prepTime = !isNaN(prepTimeNum) && prepTimeNum > 0 ? prepTimeNum : 20;

    const servingsNum = parseInt(item.servings, 10);
    const servings = !isNaN(servingsNum) && servingsNum > 0 ? servingsNum : defaultServings;

    const usesInventory = typeof item.usesInventory === "boolean" ? item.usesInventory : true;

    const inventoryItemsUsed = Array.isArray(item.inventoryItemsUsed)
      ? item.inventoryItemsUsed.map((i) => String(i).trim()).filter(Boolean)
      : [];

    const missingIngredients = Array.isArray(item.missingIngredients)
      ? item.missingIngredients.map((i) => String(i).trim()).filter(Boolean)
      : [];

    return {
      name,
      ingredients,
      steps,
      prepTime,
      servings,
      usesInventory,
      inventoryItemsUsed,
      missingIngredients,
    };
  });

  return { recipes: validatedRecipes };
};

/**
 * Calls Groq chat completions with bounded retries for transient errors.
 */
const callGroqWithRetry = async (messages, maxRetries = 1) => {
  const client = getGroqClient();
  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;

  let attempt = 0;
  while (attempt <= maxRetries) {
    attempt++;
    try {
      const completionPromise = client.chat.completions.create({
        model,
        messages,
        response_format: { type: "json_object" },
      });

      // Wrap with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new AppError("AI request timed out", 504)), REQUEST_TIMEOUT_MS);
      });

      const response = await Promise.race([completionPromise, timeoutPromise]);
      const content = response.choices?.[0]?.message?.content;
      return extractAndParseJson(content);
    } catch (err) {
      const isRetryable =
        err.status === 429 ||
        err.status === 503 ||
        err.statusCode === 504 ||
        err.code === "ETIMEDOUT" ||
        err.code === "ECONNRESET";

      if (isRetryable && attempt <= maxRetries) {
        // Wait 1 second before retry
        await new Promise((res) => setTimeout(res, 1000));
        continue;
      }

      if (err instanceof AppError) throw err;

      if (err.status === 429) {
        throw new AppError("AI service rate limit exceeded. Please try again shortly.", 429);
      }
      if (err.status === 401 || err.status === 403) {
        throw new AppError("AI service authentication failed. Check GROQ_API_KEY configuration.", 502);
      }

      throw new AppError(err.message || "Unable to create recipe suggestions from AI provider", 502);
    }
  }
};

/**
 * Generates recipe suggestions from available, unconsumed, non-expired inventory items.
 */
const suggestRecipes = async (userId, options = {}) => {
  const { preferences = "", servings = 2, avoid = [], ingredients: manualIngredients = [] } = options;

  if (avoid && !Array.isArray(avoid)) {
    throw new AppError("avoid must be an array", 400);
  }

  const parsedServings = Number(servings);
  if (!Number.isInteger(parsedServings) || parsedServings < 1) {
    throw new AppError("servings must be a positive integer", 400);
  }

  const avoidItems = (avoid || []).map((item) => String(item).toLowerCase().trim()).filter(Boolean);

  // Normalize manual ingredients if provided
  const normalizedManual = (Array.isArray(manualIngredients) ? manualIngredients : [])
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0 && !avoidItems.includes(item.toLowerCase()));

  // Query user inventory: strictly unconsumed and food categories
  const items = await Item.find({
    userId,
    status: { $ne: "consumed" },
    consumedAt: null,
    category: { $in: FOOD_CATEGORIES },
  })
    .sort({ expiryDate: 1 })
    .lean();

  const today = startOfToday();

  // Exclude consumed, avoided, and expired items
  const eligibleInventoryItems = items.filter((item) => {
    // Strictly exclude consumed items
    if (item.status === "consumed" || Boolean(item.consumedAt)) return false;

    const itemName = String(item.name || "").toLowerCase().trim();
    if (avoidItems.includes(itemName)) return false;
    if (item.status === "expired") return false;

    const expiry = parseLocalDate(item.expiryDate);
    if (!expiry) return false;

    return expiry >= today;
  });

  // If no eligible inventory items and no manual ingredients, return safe empty response
  if (eligibleInventoryItems.length === 0 && normalizedManual.length === 0) {
    return {
      recipes: [],
      ingredients: [],
      message: "Add available food items to receive recipe suggestions.",
    };
  }

  const inventorySummary = eligibleInventoryItems.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    expiryDate: item.expiryDate,
  }));

  const recipePromptData = {
    preferences: String(preferences).trim(),
    servings: parsedServings,
    avoid: avoidItems,
    manualIngredients: normalizedManual,
    items: inventorySummary,
  };

  const systemMessage = {
    role: "system",
    content: "You are SmartStock, an AI kitchen assistant that creates recipes using available inventory. Return valid JSON only.",
  };

  const prompt = `
Create 3 recipes using the user's available inventory.

Here is the inventory and user requirements:
${JSON.stringify(recipePromptData, null, 2)}

Rules:
- Prefer ingredients that expire soonest.
- Only use active unconsumed ingredients listed in the user's inventory or manual ingredients.
- Do NOT use expired ingredients.
- Do NOT use ingredients from the avoid list.
- Respect dietary preferences: "${recipePromptData.preferences || "None"}".
- Respect requested servings: ${parsedServings}.
- If additional ingredients are necessary, list them in missingIngredients.
- Return JSON strictly adhering to this structure:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "steps": ["step 1", "step 2"],
      "prepTime": 25,
      "servings": ${parsedServings},
      "usesInventory": true,
      "inventoryItemsUsed": ["ingredient 1"],
      "missingIngredients": ["ingredient 3"]
    }
  ]
}
`;

  const messages = [
    systemMessage,
    { role: "user", content: prompt },
  ];

  const rawResult = await callGroqWithRetry(messages);
  const validated = validateRecipePayload(rawResult, parsedServings);

  return validated;
};

const saveRecipe = async (userId, data) => {
  const {
    name,
    ingredients,
    steps,
    prepTime,
    servings,
    usesInventory,
    inventoryItemsUsed,
    missingIngredients,
  } = data;

  if (!name || !ingredients || !steps) {
    throw new AppError("Incomplete recipe details", 400);
  }

  const recipe = await SavedRecipe.create({
    userId,
    name: String(name).trim(),
    ingredients: Array.isArray(ingredients) ? ingredients : [String(ingredients)],
    steps: Array.isArray(steps) ? steps : [String(steps)],
    prepTime: Number(prepTime) || 20,
    servings: Number(servings) || 2,
    usesInventory: Boolean(usesInventory),
    inventoryItemsUsed: Array.isArray(inventoryItemsUsed) ? inventoryItemsUsed : [],
    missingIngredients: Array.isArray(missingIngredients) ? missingIngredients : [],
  });

  return recipe.toObject();
};

const getSavedRecipes = async (userId) => {
  return SavedRecipe.find({ userId }).sort({ createdAt: -1 }).lean();
};

module.exports = {
  suggestRecipes,
  saveRecipe,
  getSavedRecipes,
  validateRecipePayload,
  extractAndParseJson,
  callGroqWithRetry,
};
