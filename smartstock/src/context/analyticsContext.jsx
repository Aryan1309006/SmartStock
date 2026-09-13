import { createContext, useContext, useState } from "react";
import {
  monthlyOverview,
  consumptionOverview,
} from "../services/analyticsService";

const AnalyticsContext = createContext(null);

export const AnalyticsProvider = ({ children }) => {
  const [monthly, setMonthly] = useState(null);
  const [consumption, setConsumption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (serviceCall, onSuccess, message) => {
    try {
      setLoading(true);
      setError(null);
      const response = await serviceCall();
      onSuccess(response.data ?? {});
      return response;
    } catch (requestError) {
      setError(requestError.response?.data?.message || message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyOverview = () =>
    request(
      monthlyOverview,
      setMonthly,
      "Failed to fetch monthly analytics",
    );

  const fetchConsumptionOverview = () =>
    request(
      consumptionOverview,
      setConsumption,
      "Failed to fetch consumption analytics",
    );

  const fetchAnalytics = async () => {
    await Promise.all([fetchMonthlyOverview(), fetchConsumptionOverview()]);
  };

  const value = {
    monthly,
    consumption,
    loading,
    error,
    fetchMonthlyOverview,
    fetchConsumptionOverview,
    fetchAnalytics,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);

  if (!context) {
    throw new Error("useAnalytics must be used inside AnalyticsProvider");
  }

  return context;
};
