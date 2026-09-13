const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const generateRecipes = async (recipeData) => {
    const prompt = `
You are SmartStock, an AI recipe assistant.

Create 3 recipes using the user's available inventory.

Here is the inventory and user requirements:

${JSON.stringify(recipeData, null, 2)}

Rules:
- Prefer ingredients that expire soonest.
- Use available inventory ingredients.
- Do not claim unavailable ingredients are in the inventory.
- Do not use ingredients from the avoid list.
- Respect dietary preferences.
- Respect the requested servings.
- If additional ingredients are required, put them in missingIngredients.
- Return JSON only.

Return exactly this structure:

{
  "recipes": [
    {
      "name": "Recipe name",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "steps": ["step 1", "step 2"],
      "prepTime": 20,
      "servings": 2,
      "usesInventory": true,
      "inventoryItemsUsed": ["ingredient 1"],
      "missingIngredients": ["ingredient 3"]
    }
  ]
}
`;

    const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            {
                role: "system",
                content: "You are SmartStock recipe AI. Return valid JSON only.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        response_format: {
            type: "json_object",
        },
    });

    const result = response.choices[0].message.content;

    return JSON.parse(result);
};

module.exports = {
    generateRecipes,
};