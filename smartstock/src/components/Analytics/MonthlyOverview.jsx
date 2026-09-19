import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { Plus, Utensils, AlertTriangle, Wallet } from "lucide-react";

const MonthlyOverview = ({ items = [], monthly }) => {
  const summary = monthly?.summary;

  // CURRENT MONTH
  const now = new Date();

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // MONTHLY ITEMS
  const monthlyItems = items.filter((item) => {
    const date = new Date(item.purchaseDate);

    return (
      date.getFullYear() === currentYear && date.getMonth() === currentMonth
    );
  });

  // ADDED
  const added =
    summary?.added ??
    monthlyItems.reduce((total, item) => total + item.quantity, 0);

  // CONSUMED
  const consumed =
    summary?.consumed ??
    items
      .filter((item) => {
        if (!item.consumedAt) return false;

        const date = new Date(item.consumedAt);

        return (
          date.getFullYear() === currentYear && date.getMonth() === currentMonth
        );
      })
      .reduce((total, item) => total + item.quantity, 0);

  // EXPIRED
  const expired =
    summary?.expired ??
    monthlyItems.filter((item) => item.status === "expired").length;

  // INVENTORY VALUE
  const value =
    summary?.value ??
    monthlyItems.reduce((total, item) => total + item.quantity * item.price, 0);

  // CHART DATA
  const createMonthlyData = () => {
    const monthlyData = {};

    items.forEach((item) => {
      // Added
      const addedMonth = item.purchaseDate.slice(0, 7);

      if (!monthlyData[addedMonth]) {
        monthlyData[addedMonth] = {
          month: addedMonth,
          added: 0,
          consumed: 0,
        };
      }

      monthlyData[addedMonth].added += item.quantity;

      // Consumed
      if (item.consumedAt) {
        const consumedMonth = item.consumedAt.slice(0, 7);

        if (!monthlyData[consumedMonth]) {
          monthlyData[consumedMonth] = {
            month: consumedMonth,
            added: 0,
            consumed: 0,
          };
        }

        monthlyData[consumedMonth].consumed += item.quantity;
      }
    });

    return Object.values(monthlyData)
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .map((item) => ({
        ...item,
        month: new Date(`${item.month}-01`).toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        }),
      }));
  };

  const chartData =
    monthly?.chartData && monthly.chartData.length > 0
      ? monthly.chartData.map((item) => ({
          ...item,
          month: new Date(`${item.month}-01`).toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
          }),
        }))
      : createMonthlyData();
  // CARD DATA


  const cards = [
    {
      title: "Added",
      value: added,
      icon: Plus,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    {
      title: "Consumed",
      value: consumed,
      icon: Utensils,
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      title: "Expired",
      value: expired,
      icon: AlertTriangle,
      bg: "bg-red-100",
      text: "text-red-600",
    },
    {
      title: "Value",
      value: `₹${value.toLocaleString("en-IN")}`,
      icon: Wallet,
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
  ];

  return (
    <div className="w-full rounded-2xl mt-10 border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      {/* ================= HEADER ================= */}

      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
          Monthly Overview
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Your inventory summary for this month
        </p>
      </div>

      {/* ================= SUMMARY BOXES ================= */}

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <Icon
                  className={`h-8 w-8 rounded-full p-1.5 ${card.bg} ${card.text}`}
                />
              </div>

              <p className="mt-3 text-xl font-bold text-gray-900 sm:text-2xl">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* ================= CHART ================= */}

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" tick={{ fontSize: 15 }} />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="added"
              name="Added"
              fill="#22c55e"
              barSize={12}
              maxBarSize={16}
              radius={[2, 2, 0, 0]}
            />

            <Bar
              dataKey="consumed"
              name="Consumed"
              fill="#3b82f6"
              barSize={12}
              maxBarSize={16}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyOverview;
