import React from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Package,
  Clock3,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../context/authContext";
import { useDashboard } from "../context/dashboardContext";
import Loader from "../components/Loader";
import Statcard from "../components/dashboard/Statcard";

const Profile = () => {
  const { user } = useAuth();

  const {
    dashboard,
    loading,
    error,
  } = useDashboard();

  if (!user) {
    return <Loader text="Loading Profile..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Profile
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account and view your SmartStock activity.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          
          {/* Top background */}
          <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-600" />

          <div className="px-5 pb-6 sm:px-8">
            
            {/* Avatar + user info */}
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                
                {/* Avatar */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gray-100 shadow-md">
                  <User
                    size={46}
                    className="text-gray-500"
                    strokeWidth={1.7}
                  />
                </div>

                {/* User details */}
                <div className="pb-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.name || "User"}
                  </h2>

                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <Mail size={16} />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Account status */}
              <div className="flex items-center gap-2 self-start rounded-full bg-green-50 px-3 py-2 text-sm font-medium text-green-700 sm:self-auto">
                <ShieldCheck size={17} />
                Active Account
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Inventory Overview
            </h2>
            <p className="text-sm text-gray-500">
              A quick overview of your SmartStock activity.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader text="Loading statistics..." />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              Unable to load your inventory statistics.
            </div>
          ) : (
            <Statcard dashboard={dashboard || {}} />
          )}
        </div>

        {/* Account Information + Quick Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Account Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Account Information
              </h2>
              <p className="text-sm text-gray-500">
                Your basic account details.
              </p>
            </div>

            <div className="space-y-4">

              {/* Name */}
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <User size={19} className="text-blue-600" />
                </div>

                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">
                    {user.name || "Not available"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <Mail size={19} className="text-purple-600" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="truncate font-medium text-gray-900">
                    {user.email || "Not available"}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
              <p className="text-sm text-gray-500">
                Manage your SmartStock account.
              </p>
            </div>

            <div className="space-y-3">

              <button className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Package size={19} className="text-blue-600" />
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">
                      Manage Inventory
                    </p>
                    <p className="text-xs text-gray-500">
                      View and manage your items
                    </p>
                  </div>
                </div>

                <ChevronRight size={19} className="text-gray-400" />
              </button>

              <button className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition hover:border-purple-300 hover:bg-purple-50">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <Clock3 size={19} className="text-purple-600" />
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">
                      Consumption History
                    </p>
                    <p className="text-xs text-gray-500">
                      Check your recently consumed items
                    </p>
                  </div>
                </div>

                <ChevronRight size={19} className="text-gray-400" />
              </button>

              <button className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition hover:border-gray-300 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Settings size={19} className="text-gray-600" />
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">
                      Account Settings
                    </p>
                    <p className="text-xs text-gray-500">
                      Configure your preferences
                    </p>
                  </div>
                </div>

                <ChevronRight size={19} className="text-gray-400" />
              </button>

            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-600 transition hover:bg-red-100">
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;