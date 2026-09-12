import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const CategoryChart = ({ items = [] }) => {
  const categoryCount = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(categoryCount).map(
    ([category, count]) => ({
      name: category,
      value: count,
    })
  );

  const COLORS = [
    "#3B82F6",
    "#14B8A6",
    "#10B981",
    "#8B5CF6",
    "#22C55E",
  ];

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">
        Inventory by Category
      </h2>

      <p className="mb-4 text-sm text-gray-500">
        Distribution of your inventory items
      </p>

      <div className="h-[320px] w-full">
        <PieChart
          responsive
          style={{ width: "100%", height: "100%" }}
        >
            <Pie
              data={chartData}
              cx="40%"
              cy="50%"
              innerRadius="28%"
              outerRadius="48%"
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => [
                `${value} items`,
                name,
              ]}
            />

            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              formatter={(value, entry, index) => {
                const total = items.length;
                const count = categoryCount[value];
                const percentage = total
                  ? Math.round((count / total) * 100)
                  : 0;

                return `${value}  ${percentage}%`;
              }}
            />
        </PieChart>
      </div>
    </div>
  );
};

export default CategoryChart;