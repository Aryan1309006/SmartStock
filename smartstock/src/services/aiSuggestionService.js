import api from "../services/api";

export const suggestRecipes = async (preferences) => {
  const response = await api.post("/recipes/suggest", preferences);
  return response.data;
};