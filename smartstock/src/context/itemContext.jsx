import { createContext, useContext, useEffect, useState } from "react";
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  markItemConsumed,
  restoreItem,
} from "../services/itemsService";

const ItemContext = createContext(null);

// Provide item state and CRUD actions to the component tree.
export const ItemProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);

  // Load the current user's items and expose request errors to the UI.
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllItems();

      setItems(data.data?.items ?? data.items ?? []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };
  const fetchSingleItem = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getItemById(id);

      const item = data.data?.item ?? data.item ?? null;
      setSelectedItem(item);
      return item;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  // Add an item and append the server-created record to local state.
  const addItem = async (itemData) => {
    try {
      setError(null);

      const data = await createItem(itemData);

      setItems((prevItems) => [...prevItems, data.data?.item ?? data.item]);

      return data.data?.item ?? data.item;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create item");

      throw error;
    }
  };

  // Update an item and replace its local copy with the server response.
  const editItem = async (id, itemData) => {
    try {
      setError(null);

      const data = await updateItem(id, itemData);

      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === id ? (data.data?.item ?? data.item) : item,
        ),
      );

      return data.data?.item ?? data.item;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update item");

      throw error;
    }
  };

  // Change an item's state to consumed in the API and local state.
  const consumeItem = async (id) => {
    const data = await markItemConsumed(id);
    const updatedItem = data.data?.item ?? data.item;
    setItems((prevItems) =>
      prevItems.map((item) => (item._id === id ? updatedItem : item)),
    );
    return updatedItem;
  };

  // Restore a consumed item in the API and local state.
  const restoreConsumedItem = async (id) => {
    const data = await restoreItem(id);
    const updatedItem = data.data?.item ?? data.item;
    setItems((prevItems) =>
      prevItems.map((item) => (item._id === id ? updatedItem : item)),
    );
    return updatedItem;
  };

  // Delete an item and remove its local copy after success.
  const removeItem = async (id) => {
    try {
      setError(null);

      await deleteItem(id);

      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete item");

      throw error;
    }
  };

  // Fetch items once when the provider is mounted.
  useEffect(() => {
    fetchItems();
  }, []);

  const value = {
    items,
    selectedItem,
    loading,
    error,

    fetchItems,
    fetchSingleItem,
    addItem,
    editItem,
    removeItem,
    consumeItem,
    restoreConsumedItem,
  };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};

export const useItems = () => {
  const context = useContext(ItemContext);

  if (!context) {
    throw new Error("useItems must be used inside ItemProvider");
  }

  return context;
};
