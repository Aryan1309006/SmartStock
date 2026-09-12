import React from "react";
import { dummyDashboard, dummyItems } from "../assets/dummydata/item";
import Statcard from "../components/dashboard/Statcard";
import Consumptionoverview from "../components/Analytics/Consumptionoverview";
import CategoryChart from "../components/dashboard/CategoryChart";
import MonthlyOverview from "../components/Analytics/MonthlyOverview";

const Analytics = () => {
  const dashboard = dummyDashboard.data;
  const items = dummyItems.data.items;

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
          <Statcard dashboard={dashboard} />

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Consumptionoverview items={items} dashboard={dashboard} />
        <CategoryChart items={items} dashboard={dashboard} />
      </div>
      <MonthlyOverview items={items}/>
    </div>
  );
};

export default Analytics;