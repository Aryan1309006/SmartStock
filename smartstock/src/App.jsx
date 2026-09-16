import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./Layouts/DashboardLayout";
import Loader from "./components/Loader";
import Protected from "./routes/Protected";

// Providers
import { RecipeProvider } from "./context/recipeContext";
import { NotificationProvider } from "./context/notificationContext";
import { DashboardProvider } from "./context/dashboardContext";
import { AnalyticsProvider } from "./context/analyticsContext";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Inventory = lazy(() => import("./pages/Inventory"));
const History = lazy(() => import("./pages/History"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const Profile = lazy(() => import("./pages/Profile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const AISuggestion = lazy(() => import("./pages/AISuggestion"));
const Item = lazy(() => import("./components/Inventory/Item"));

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader text="Loading SmartStock..." />;
  }

  return (
    <Suspense fallback={<Loader text="Loading SmartStock..." />}>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        {/* ================= PROTECTED ROUTES ================= */}

        <Route element={<Protected />}>
          <Route element={<DashboardLayout />}>
            
            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <DashboardProvider>
                  <Dashboard />
                </DashboardProvider>
              }
            />

            {/* Inventory */}
            <Route
              path="/inventory"
              element={<Inventory />}
            />

            {/* History */}
            <Route
              path="/history"
              element={<History />}
            />

            {/* Analytics */}
            <Route
              path="/analytics"
              element={
                <DashboardProvider>
                  <AnalyticsProvider>
                    <Analytics />
                  </AnalyticsProvider>
                </DashboardProvider>
              }
            />

            {/* Settings */}
            <Route
              path="/settings"
              element={<Settings />}
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={
                <DashboardProvider>
                  <Profile />
                </DashboardProvider>
              }
            />

            {/* Notifications */}
            <Route
              path="/notification"
              element={
                <NotificationProvider>
                  <Notifications />
                </NotificationProvider>
              }
            />

            {/* Single Inventory Item */}
            <Route
              path="/inventory/:id"
              element={<Item />}
            />

            {/* AI Suggestions */}
            <Route
              path="/suggestion"
              element={
                <RecipeProvider>
                  <AISuggestion />
                </RecipeProvider>
              }
            />

          </Route>
        </Route>

        {/* ================= DEFAULT ================= */}

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </Suspense>
  );
};

export default App;