import React from "react";
import { ChevronRight } from "lucide-react";

const Dashborardcard = ({ item = [], name, type }) => {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      {/* ================= HEADER ================= */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          {name}
        </h2>

        <button
          type="button"
          className="flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          View all
          <ChevronRight size={17} />
        </button>
      </div>

      {/* ================= ITEMS ================= */}
      <div className="space-y-3">

        {item.slice(0, 4).map((product) => (
          <div
            key={product._id}
            className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition hover:bg-gray-100"
          >

            {/* Product Information */}
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-gray-900">
                {product.name}
              </p>

              {/* Expiry Card */}
              {type === "expiry" && (
                <p className="mt-1 text-sm text-gray-500">
                  Expires:{" "}
                  {new Date(
                    product.expiryDate
                  ).toLocaleDateString()}
                </p>
              )}

              {/* Recently Consumed Card */}
              {type === "consumed" && (
                <p className="mt-1 text-sm text-gray-500">
                  Consumed:{" "}
                  {new Date(
                    product.consumedAt
                  ).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Days Remaining */}
            {type === "expiry" &&
              product.daysRemaining !== undefined && (
                <span
                  className={`ml-3 shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    product.daysRemaining < 0
                      ? "bg-red-100 text-red-600"
                      : product.daysRemaining <= 2
                      ? "bg-red-100 text-red-600"
                      : product.daysRemaining <= 7
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {product.daysRemaining < 0
                    ? `${Math.abs(
                        product.daysRemaining
                      )} days`
                    : product.daysRemaining === 0
                    ? "Today"
                    : `${product.daysRemaining} days`}
                </span>
              )}
          </div>
        ))}
      </div>

      {/* ================= EMPTY STATE ================= */}
      {item.length === 0 && (
        <div className="py-10 text-center">
          <p className="text-sm text-gray-400">
            No items found
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashborardcard;