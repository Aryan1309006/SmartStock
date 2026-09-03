import api from "./api";

// Create an item for the authenticated user.
export const createItem = async (itemData) => {
  const response = await api.post("/items", itemData);
  return response.data;
};

// Retrieve all items belonging to the authenticated user.
export const getAllItems = async () => {
  const response = await api.get("/items");
  return response.data;
};

// Retrieve one item by its database identifier.
export const getItemById = async (id) => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

// Update an existing item and return the updated record.
export const updateItem = async (id, itemData) => {
  const response = await api.put(`/items/${id}`, itemData);
  return response.data;
};

// Permanently remove an item.
export const deleteItem = async (id) => {
  const response = await api.delete(`/items/${id}`);
  return response.data;
};

// Mark an item as consumed.
export const markItemConsumed = async (id) => {
  const response = await api.patch(`/items/${id}/consume`);
  return response.data;
};

// Restore a consumed item to the available state.
export const restoreItem = async (id) => {
  const response = await api.patch(`/items/${id}/restore`);
  return response.data;
};