import api from "../services/api";

export const dashboardData = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

export const expiringSoon = async () => {
  const response = await api.get("/dashboard/expiring-soon");
  return response.data;
};

export const recentlyConsumed = async () => {
  const response = await api.get("/dashboard/recently-consumed");
  return response.data;
};

export const categoryCount = async () => {
  const response = await api.get("/dashboard/category-count");
  return response.data;
};
