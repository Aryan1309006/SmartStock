import React, { useEffect, useState } from "react";
import DashboardLayout from "./Layouts/DashboardLayout";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/auth/Login";
import Signin from "./components/auth/Signin";
import Item from "./components/Inventory/Item";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import Notifications from "./pages/Notifications";
import AISuggestion from "./pages/AISuggestion";
import { RecipeProvider } from "./context/recipeContext";
import { NotificationProvider } from "./context/notificationContext";

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
    <div>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signin />} />

        {/* Dashboard Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/notification"
            element={
              <NotificationProvider>
                <Notifications />
              </NotificationProvider>
            }
          />
          <Route path="/inventory/:id" element={<Item />} />
          <Route
            path="/suggestion"
            element={
              <RecipeProvider>
                <AISuggestion />
              </RecipeProvider>
            }
          />
        </Route>
        {/* Default */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
};
export default App;
