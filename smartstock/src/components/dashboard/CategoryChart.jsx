import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CategoryChart = ({ items = [], dashboard = {} }) => {
  const [isMobile, setIsMobile] = React.useState(
    () =>
      typeof window !== "undefined"
        ? window.innerWidth < 640
        : false,
  );

  const [activeIndex, setActiveIndex] = React.useState(null);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const activeItems = items.filter((item) => item.status !== "consumed");

  const categoryCount = activeItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(categoryCount).map(
    ([category, count]) => ({
      name: category,
      value: count,
    }),
  );

  const COLORS = [
    "#3B82F6",
    "#14B8A6",
    "#10B981",
    "#8B5CF6",
    "#22C55E",
  ];

  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Inventory by Category
      </h2>

      <p className="mb-4 text-sm text-gray-500">
        Distribution of your inventory items · {dashboard.totalItems || items.length} total
      </p>

      <div className="h-[300px] w-full sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 35 : 55}
              outerRadius={isMobile ? 80 : 100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              tabIndex={-1}
              onMouseEnter={(_, index) => {
                setActiveIndex(index);
              }}
              onMouseLeave={() => {
                setActiveIndex(null);
              }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={
                    index === activeIndex
                      ? "#0f172a"
                      : "none"
                  }
                  strokeWidth={
                    index === activeIndex ? 2 : 0
                  }
                  opacity={
                    activeIndex === null ||
                    index === activeIndex
                      ? 1
                      : 0.75
                  }
                  style={{
                    outline: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => [
                `${value} items`,
                name,
              ]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e5e7eb",
              }}
            />

            <Legend
              layout={isMobile ? "horizontal" : "vertical"}
              verticalAlign={isMobile ? "bottom" : "middle"}
              align={isMobile ? "center" : "right"}
              wrapperStyle={{
                paddingTop: isMobile ? 12 : 0,
                fontSize: "12px",
              }}
              formatter={(value) => {
                const total = activeItems.length;
                const count = categoryCount[value];

                const percentage = total
                  ? Math.round((count / total) * 100)
                  : 0;

                return `${value} ${percentage}%`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;