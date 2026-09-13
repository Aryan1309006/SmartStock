import api from "../services/api";

export const monthlyOverview = async () => {
  try {
    const response = await api.get("/analytics/monthly-overview");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const consumptionOverview = async () => {
  try {
    const response = await api.get("/analytics/consumption-overview");
    return response.data;
  } catch (error) {
    throw error;
  }
};
