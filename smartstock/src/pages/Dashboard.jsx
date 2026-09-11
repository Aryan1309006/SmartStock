import React from "react";
import {
  Box,
  Package,
  Utensils,
  CalendarRange,
  AlertTriangle,
  Wallet,
} from "lucide-react";

import {
  dummyDashboard,
  dummyItems,
  dummyUser,
} from "../assets/dummydata/item";

import Dashborardcard from "../components/dashboard/Dashborardcard";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const user = dummyUser;
  const dashboard = dummyDashboard.data;
  const items = dummyItems.data.items;

  // =========================
  // EXPIRING SOON
  // =========================

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

  // =========================
  // RECENTLY CONSUMED
  // =========================

  const recentlyConsumed = items
    .filter((item) => item.consumedAt !== null)
    .sort(
      (a, b) =>
        new Date(b.consumedAt) -
        new Date(a.consumedAt)
    );

  console.log("Expiring Soon:", expiringSoon);
  console.log("Recently Consumed:", recentlyConsumed);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

        {/* Total Items */}
           <Link to="/inventory">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-600">
              Total Items
            </p>

            <Box className="h-10 w-10 rounded-full bg-green-100 p-2 text-green-600" />
          </div>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            {dashboard.totalItems}
          </p>
        </div></Link>

        {/* Active Items */}
       
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-600">
              Active Items
            </p>

            <Package className="h-10 w-10 rounded-full bg-blue-100 p-2 text-blue-600" />
          </div>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            {dashboard.freshItems}
          </p>
        </div>

        {/* Consumed Items */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-600">
              Consumed
            </p>

            <Utensils className="h-10 w-10 rounded-full bg-purple-100 p-2 text-purple-600" />
          </div>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            {dashboard.consumedItems}
          </p>
        </div>

        {/* Expiring Soon */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-600">
              Expiring Soon
            </p>

            <CalendarRange className="h-10 w-10 rounded-full bg-yellow-100 p-2 text-yellow-600" />
          </div>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            {dashboard.expiringSoon}
          </p>
        </div>

        {/* Expired */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-600">
              Expired
            </p>

            <AlertTriangle className="h-10 w-10 rounded-full bg-red-100 p-2 text-red-600" />
          </div>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            {dashboard.expiredItems}
          </p>
        </div>

        {/* Inventory Value */}
        <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm transition hover:shadow-md xl:col-span-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-600">
              Inventory Value
            </p>

            <Wallet className="h-10 w-10 rounded-full bg-green-100 p-2 text-green-600" />
          </div>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            ₹{dashboard.inventoryValue}
          </p>
        </div>
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Expiring Soon Card */}
        <Dashborardcard
          item={expiringSoon}
          name="Expiring Soon"
          type="expiry"
        />

        {/* Analytics */}
        <div className="min-h-[300px] rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            Analytics
          </h2>

          <div className="flex h-56 items-center justify-center text-sm text-gray-400">
            Analytics coming soon
          </div>
        </div>

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