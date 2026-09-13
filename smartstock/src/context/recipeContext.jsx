import { createContext, useContext, useState } from "react";
import { suggestRecipes } from "../services/aiSuggestionService";

const RecipeContext = createContext(null);

export const RecipeProvider = ({ children }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSuggestions = async (preferences = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await suggestRecipes(preferences);
      setResult(response.data ?? null);
      return response.data;
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to generate recipe suggestions",
      );
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const clearSuggestions = () => {
    setResult(null);
    setError(null);
  };

  const value = {
    result,
    loading,
    error,
    getSuggestions,
    clearSuggestions,
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);

  if (!context) {
    throw new Error("useRecipes must be used inside RecipeProvider");
  }

  return context;
};
