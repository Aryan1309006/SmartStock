import { createContext, useContext, useEffect, useState } from "react";

import {
  dashboardData,
  expiringSoon,
  recentlyConsumed,
  categoryCount,
} from "../services/dashboardService";

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState(null);
  const [expiringItems, setExpiringItems] = useState([]);
  const [recentlyConsumedItems, setRecentlyConsumedItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [error, setError] = useState(null);

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        dashboardResponse,
        expiringResponse,
        consumedResponse,
        categoryResponse,
      ] = await Promise.all([
        dashboardData(),
        expiringSoon(),
        recentlyConsumed(),
        categoryCount(),
      ]);

      setDashboard(dashboardResponse.data ?? {});

      setExpiringItems(
        expiringResponse.data?.expiringSoon ?? []
      );

      setRecentlyConsumedItems(
        consumedResponse.data?.recentlyConsumed ?? []
      );

      setCategories(
        categoryResponse.data?.categories ?? []
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load dashboard data";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  const value = {
    loading,
    error,

    dashboard,
    expiringItems,
    recentlyConsumedItems,
    categories,

    fetchDashboard: fetchAllDashboardData,
    fetchRecentlyConsumed: fetchAllDashboardData,
    fetchExpiringSoon: fetchAllDashboardData,
    fetchCategoryCount: fetchAllDashboardData,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboard must be used inside DashboardProvider"
    );
  }

  return context;
};