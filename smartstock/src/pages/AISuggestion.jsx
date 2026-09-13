import { useState } from "react";
import {
  AlertCircle,
  ChefHat,
  Clock3,
  LoaderCircle,
  Sparkles,
  Utensils,
} from "lucide-react";
import { useRecipes } from "../context/recipeContext";

const AISuggestion = () => {
  const { result, loading, error, getSuggestions, clearSuggestions } =
    useRecipes();
  const [preferences, setPreferences] = useState("");
  const [servings, setServings] = useState(2);
  const [avoid, setAvoid] = useState("");

  const recipes = result?.recipes ?? [];

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await getSuggestions({
        preferences: preferences.trim(),
        servings: Number(servings),
        avoid: avoid
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
    } catch {
      // The context exposes the request error in the page.
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="relative overflow-hidden rounded-3xl bg-emerald-950 px-6 py-8 text-white shadow-xl sm:px-10">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-emerald-300">
              <Sparkles size={18} aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                SmartStock kitchen
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Turn what you have into dinner.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100 sm:text-base">
              Get three practical recipes built around your active inventory,
              with priority given to ingredients expiring soon.
            </p>
          </div>
          <ChefHat
            className="absolute -right-4 -top-6 h-40 w-40 text-emerald-900 sm:right-8 sm:h-48 sm:w-48"
            aria-hidden="true"
          />
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                Set your preferences
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Optional details help the assistant shape better suggestions.
              </p>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Dietary preference or mood
                <input
                  value={preferences}
                  onChange={(event) => setPreferences(event.target.value)}
                  placeholder="Vegetarian, quick and light"
                  className="h-11 rounded-xl border border-slate-300 px-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <label className="grid max-w-36 gap-2 text-sm font-semibold text-slate-700">
                Servings
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={servings}
                  onChange={(event) => setServings(event.target.value)}
                  className="h-11 rounded-xl border border-slate-300 px-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Ingredients to avoid
                <input
                  value={avoid}
                  onChange={(event) => setAvoid(event.target.value)}
                  placeholder="Peanuts, mushrooms"
                  className="h-11 rounded-xl border border-slate-300 px-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
                <span className="font-normal text-slate-400">
                  Separate multiple ingredients with commas.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <LoaderCircle className="animate-spin" size={18} aria-hidden="true" />
              ) : (
                <Sparkles size={18} aria-hidden="true" />
              )}
              {loading ? "Creating suggestions..." : "Suggest recipes"}
            </button>

            {error && (
              <div className="mt-4 flex gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
                <p>{error}</p>
              </div>
            )}
          </form>

          <div>
            {result && recipes.length === 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
                <h2 className="font-bold">Your inventory needs a little more food.</h2>
                <p className="mt-1 text-sm">
                  {result.message || "Add active pantry or dairy items to receive suggestions."}
                </p>
              </div>
            )}

            {!result && !loading && (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Utensils size={26} aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-900">
                  Your next meal starts here
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Add a preference or simply ask for ideas based on your inventory.
                </p>
              </div>
            )}

            {recipes.length > 0 && (
              <div className="grid gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Your suggestions</h2>
                    <p className="text-sm text-slate-500">Made from what is currently in stock.</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearSuggestions}
                    className="text-sm font-semibold text-slate-500 underline underline-offset-4 hover:text-slate-900"
                  >
                    Clear
                  </button>
                </div>

                {recipes.map((recipe, index) => (
                  <article
                    key={`${recipe.name}-${index}`}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                          Recipe {index + 1}
                        </span>
                        <h3 className="mt-1 text-xl font-bold text-slate-900">
                          {recipe.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={15} aria-hidden="true" />
                          {recipe.prepTime || "--"} min
                        </span>
                        <span>{recipe.servings || servings} servings</span>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Ingredients</h4>
                        <ul className="mt-2 grid gap-2 text-sm text-slate-600">
                          {(recipe.ingredients || []).map((ingredient) => (
                            <li key={ingredient} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                              {ingredient}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Method</h4>
                        <ol className="mt-2 grid gap-2 text-sm text-slate-600">
                          {(recipe.steps || []).map((step, stepIndex) => (
                            <li key={step} className="flex gap-2">
                              <span className="font-bold text-emerald-600">{stepIndex + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {recipe.missingIngredients?.length > 0 && (
                      <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-amber-700">
                        You may need: {recipe.missingIngredients.join(", ")}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISuggestion;