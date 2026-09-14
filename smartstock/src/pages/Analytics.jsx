import React from "react";
import Statcard from "../components/dashboard/Statcard";
import Consumptionoverview from "../components/Analytics/Consumptionoverview";
import CategoryChart from "../components/dashboard/CategoryChart";
import MonthlyOverview from "../components/Analytics/MonthlyOverview";
import { useAnalytics } from "../context/analyticsContext";
import { useDashboard } from "../context/dashboardContext";
import { useItems } from "../context/itemContext";

const Analytics = () => {
  const { monthly, consumption, loading: analyticsLoading, error: analyticsError } =
    useAnalytics();
  const { dashboard, loading: dashboardLoading, error: dashboardError } =
    useDashboard();
  const { items, loading: itemsLoading, error: itemsError } = useItems();

  if (analyticsLoading || dashboardLoading || itemsLoading) {
    return <p className="p-6 text-gray-500">Loading analytics...</p>;
  }

  if (analyticsError || dashboardError || itemsError) {
    return (
      <p className="p-6 text-red-600">
        {analyticsError || dashboardError || itemsError}
      </p>
    );
  }

  const dashboardData = dashboard || {};
  const inventoryItems = items || [];

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <Statcard dashboard={dashboardData} />

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Consumptionoverview
          items={inventoryItems}
          dashboard={dashboardData}
          chartData={consumption?.chartData}
        />
        <CategoryChart items={inventoryItems} dashboard={dashboardData} />
      </div>
      <MonthlyOverview items={inventoryItems} monthly={monthly} />
    </div>
  );
};

export default Analytics;