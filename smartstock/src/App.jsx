import React from "react";
import Sidebar from "./components/Sidebar";
import DashboardLayout from "./Layouts/DashboardLayout";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/auth/Login";
const App = () => {
  return (
    <div className="bg-gray-500">
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Default */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </div>
  );
};
export default App;
