import { createContext, useContext, useEffect, useState } from "react";
import {
  dashboardData,
  expiringSoon,
  recentlyConsumed,
  categoryCount,
} from "../services/dashboardService";

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [expiringItems, setExpiringItems] = useState([]);
  const [recentlyConsumedItems, setRecentlyConsumedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const request = async (serviceCall, onSuccess, message) => {
    try {
      setLoading(true);
      setError(null);
      const response = await serviceCall();
      onSuccess(response.data ?? {});
      return response;
    } catch (requestError) {
      const messageFromApi = requestError.response?.data?.message;
      setError(messageFromApi || message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = () =>
    request(dashboardData, setDashboard, "Failed to fetch dashboard data");

  const fetchRecentlyConsumed = () =>
    request(
      recentlyConsumed,
      (data) => setRecentlyConsumedItems(data.recentlyConsumed ?? []),
      "Failed to fetch recently consumed items",
    );

  const fetchExpiringSoon = () =>
    request(
      expiringSoon,
      (data) => setExpiringItems(data.expiringSoon ?? []),
      "Failed to fetch expiring items",
    );

  const fetchCategoryCount = () =>
    request(
      categoryCount,
      (data) => setCategories(data.categories ?? []),
      "Failed to fetch category counts",
    );

  useEffect(() => {
    fetchDashboard();
  }, []);

  const value = {
    loading,
    error,
    dashboard,
    expiringItems,
    recentlyConsumedItems,
    categories,
    fetchDashboard,
    fetchRecentlyConsumed,
    fetchExpiringSoon,
    fetchCategoryCount,
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
    throw new Error("useDashboard must be used inside DashboardProvider");
  };

  return context;
};
