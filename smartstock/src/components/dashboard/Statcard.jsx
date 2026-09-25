import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Package,
  Utensils,
  CalendarRange,
  AlertTriangle,
  Wallet,
} from "lucide-react";

const Statcard = ({ dashboard = {} }) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Total Items */}
        <Link to="/inventory" className="block">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-600">Total Items</p>

              <Box className="h-10 w-10 rounded-full bg-green-100 p-2 text-green-600" />
            </div>

            <p className="mt-5 text-3xl font-bold text-gray-900">
              {dashboard.totalItems}
            </p>
          </div>
        </Link>

        {/* Active Items */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-600">Active Items</p>

            <Package className="h-10 w-10 rounded-full bg-blue-100 p-2 text-blue-600" />
          </div>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            {dashboard.freshItems}
          </p>
        </div>

        {/* Consumed Items */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-600">Consumed</p>

            <Utensils className="h-10 w-10 rounded-full bg-purple-100 p-2 text-purple-600" />
          </div>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            {dashboard.consumedItems}
          </p>
        </div>

        {/* Expiring Soon */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-600">Expiring Soon</p>

            <CalendarRange className="h-10 w-10 rounded-full bg-yellow-100 p-2 text-yellow-600" />
          </div>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            {dashboard.expiringItems}
          </p>
        </div>

        {/* Expired */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-600">Expired</p>

            <AlertTriangle className="h-10 w-10 rounded-full bg-red-100 p-2 text-red-600" />
          </div>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            {dashboard.expiredItems}
          </p>
        </div>

        {/* Inventory Value */}
        <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm transition hover:shadow-md xl:col-span-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-600">Inventory Value</p>

            <Wallet className="h-10 w-10 rounded-full bg-green-100 p-2 text-green-600" />
          </div>

          <p
            className={`mt-5 font-bold text-gray-900 ${
              String(Number(dashboard.inventoryValue || 0).toFixed(2)).length >
              10
                ? "text-xl"
                : "text-3xl"
            }`}
          >
            ₹{Number(dashboard.inventoryValue || 0).toFixed(2)}
          </p>
        </div>
      </div>
    </>
  );
};

export default Statcard;
