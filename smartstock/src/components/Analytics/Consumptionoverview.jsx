import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Consumptionoverview = ({ items = [], dashboard = {} }) => {
  const chartData = items
    .reduce((acc, item) => {
      const addedDate = item.purchaseDate;
      const consumedDate =
        item.status === "consumed" && item.consumedAt
          ? item.consumedAt.split("T")[0]
          : null;

      const existingAdded = acc.find((entry) => entry.date === addedDate);
      if (existingAdded) {
        existingAdded.added += item.quantity;
      } else {
        acc.push({ date: addedDate, added: item.quantity, consumed: 0 });
      }

      if (consumedDate) {
        const existingConsumed = acc.find((entry) => entry.date === consumedDate);
        if (existingConsumed) {
          existingConsumed.consumed += item.quantity;
        } else {
          acc.push({ date: consumedDate, added: 0, consumed: item.quantity });
        }
      }

      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-2 text-lg font-semibold text-gray-800">
        Consumption Overview
      </h2>

      <p className="mb-4 text-sm text-gray-500">
        Added vs consumed inventory over time · {dashboard.totalItems || items.length} tracked items
      </p>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="added"
              stroke="#10B981"
              strokeWidth={3}
              name="Added"
            />
            <Line
              type="monotone"
              dataKey="consumed"
              stroke="#F59E0B"
              strokeWidth={3}
              name="Consumed"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Consumptionoverview;