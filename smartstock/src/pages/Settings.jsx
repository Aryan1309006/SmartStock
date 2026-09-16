
import React, { useState } from "react";
import {
  User,
  Mail,
  Bell,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../context/authContext";

const Settings = () => {
  const { user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [notifications, setNotifications] = useState({
    expiry: true,
    consumed: true,
    suggestions: true,
  });

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Connect your update profile API here
    console.log("Updated profile:", formData);
  };

  const toggleNotification = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Account Settings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your profile, preferences, notifications, and security.
          </p>
        </div>

        {/* Profile Settings */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                <User size={20} className="text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Profile Information
                </h2>
                <p className="text-sm text-gray-500">
                  Update your personal account information.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5 p-5 sm:p-6">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Save size={17} />
                Save Changes
              </button>
            </div>
          </form>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                <Bell size={20} className="text-purple-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Notifications
                </h2>

                <p className="text-sm text-gray-500">
                  Choose which notifications you want to receive.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">

            {/* Expiry */}
            <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
              <div>
                <p className="font-medium text-gray-900">
                  Expiry Alerts
                </p>

                <p className="text-sm text-gray-500">
                  Get notified when items are close to expiry.
                </p>
              </div>

              <button
                onClick={() => toggleNotification("expiry")}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  notifications.expiry
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    notifications.expiry
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Consumed */}
            <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
              <div>
                <p className="font-medium text-gray-900">
                  Consumption Updates
                </p>

                <p className="text-sm text-gray-500">
                  Receive updates about your consumption activity.
                </p>
              </div>

              <button
                onClick={() => toggleNotification("consumed")}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  notifications.consumed
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    notifications.consumed
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* AI Suggestions */}
            <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
              <div>
                <p className="font-medium text-gray-900">
                  AI Suggestions
                </p>

                <p className="text-sm text-gray-500">
                  Get smart recommendations based on your inventory.
                </p>
              </div>

              <button
                onClick={() => toggleNotification("suggestions")}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  notifications.suggestions
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    notifications.suggestions
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>

          </div>
        </section>

        {/* Security */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                <ShieldCheck size={20} className="text-green-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Security
                </h2>

                <p className="text-sm text-gray-500">
                  Manage your password and account security.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Current Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                placeholder="Enter current password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <button className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
              Change Password
              <ChevronRight size={16} />
            </button>

          </div>
        </section>

        {/* Session */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="p-5 sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="font-semibold text-gray-900">
                  Session
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Sign out of your SmartStock account.
                </p>
              </div>

              <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50">
                <LogOut size={17} />
                Log Out
              </button>

            </div>

          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-2xl border border-red-200 bg-white shadow-sm">

          <div className="border-b border-red-100 p-5 sm:p-6">
            <h2 className="font-semibold text-red-600">
              Danger Zone
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              These actions can permanently affect your account.
            </p>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

            <div>
              <p className="font-medium text-gray-900">
                Delete Account
              </p>

              <p className="text-sm text-gray-500">
                Permanently delete your account and inventory data.
              </p>
            </div>

            <button className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50">
              <Trash2 size={17} />
              Delete Account
            </button>

          </div>
        </section>

      </div>
    </div>
  );
};

export default Settings;

