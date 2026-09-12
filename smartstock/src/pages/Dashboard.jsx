import React from "react";


import {
  dummyDashboard,
  dummyItems,
  dummyUser,
} from "../assets/dummydata/item";

import Dashborardcard from "../components/dashboard/Dashborardcard";
import CategoryChart from "../components/dashboard/CategoryChart";
import Statcard from "../components/dashboard/Statcard";

const Dashboard = () => {
  const user = dummyUser;
  const dashboard = dummyDashboard.data;
  const items = dummyItems.data.items;

  // EXPIRING SOON
  const expiringSoon = items
    .map((item) => {
      const today = new Date();
      const expiryDate = new Date(item.expiryDate);

      const diffTime = expiryDate - today;

      const daysRemaining = Math.ceil(
        diffTime / (1000 * 60 * 60 * 24)
      );

      return {
        ...item,
        daysRemaining,
      };
    })
    // Include expired items and items expiring within next 7 days
    .filter((item) => item.daysRemaining <= 7)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  // RECENTLY CONSUMED
  const recentlyConsumed = items
    .filter((item) => item.consumedAt !== null)
    .sort(
      (a, b) =>
        new Date(b.consumedAt) -
        new Date(a.consumedAt)
    );
  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Hi {user.name} 👋
        </p>

        <p className="mt-1 text-sm sm:text-base text-gray-500">
          Here is your inventory overview
        </p>
      </div>

      {/* ================= STAT CARDS ================= */}
      <Statcard dashboard={dashboard} items={items} />

      {/* ================= BOTTOM SECTION ================= */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Expiring Soon Card */}
        <Dashborardcard
          item={expiringSoon}
          name="Expiring Soon"
          type="expiry"
        />

        {/* Analytics */}
      <CategoryChart items={items} dashboard={dashboard} />

        {/* Recently Consumed */}
        <Dashborardcard
          item={recentlyConsumed}
          name="Recently Consumed"
          type="consumed"
        />
      </div>
    </div>
  );
};

export default Dashboard;