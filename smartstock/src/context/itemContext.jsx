import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";

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

export const ItemProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);

  // =========================
  // GET ALL ITEMS
  // =========================
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllItems();

      setItems(data.data?.items ?? data.items ?? []);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch items"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET SINGLE ITEM
  // =========================
  const fetchSingleItem = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getItemById(id);

      const item = data.data?.item ?? data.item ?? null;

      setSelectedItem(item);

      return item;
    } catch (error) {
      // Important:
      // Clear old selected item if the requested item doesn't exist
      setSelectedItem(null);

      setError(
        error.response?.data?.message || "Failed to fetch item"
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADD ITEM
  // =========================
  const addItem = async (itemData) => {
    try {
      setError(null);

      const data = await createItem(itemData);

      const newItem = data.data?.item ?? data.item;

      if (newItem) {
        setItems((prevItems) => [...prevItems, newItem]);
      }

      return newItem;
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to add item"
      );

      throw error;
    }
  };

  // =========================
  // EDIT ITEM
  // =========================
  const editItem = async (id, itemData) => {
    try {
      setError(null);

      const data = await updateItem(id, itemData);

      const updatedItem =
        data.data?.item ?? data.item ?? data.data ?? data;

      setItems((prevItems) =>
        prevItems.map((item) =>
          String(item._id) === String(id)
            ? updatedItem
            : item
        )
      );

      // Also update selected item if currently viewing it
      setSelectedItem((prevItem) =>
        prevItem && String(prevItem._id) === String(id)
          ? updatedItem
          : prevItem
      );

      return updatedItem;
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update item"
      );

      throw error;
    }
  };

  // =========================
  // CONSUME ITEM
  // =========================
  const consumeItem = async (id) => {
    try {
      setError(null);

      const data = await markItemConsumed(id);

      const updatedItem =
        data.data?.item ?? data.item ?? data.data ?? data;

      setItems((prevItems) =>
        prevItems.map((item) =>
          String(item._id) === String(id)
            ? updatedItem
            : item
        )
      );

      setSelectedItem((prevItem) =>
        prevItem && String(prevItem._id) === String(id)
          ? updatedItem
          : prevItem
      );

      return updatedItem;
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to consume item"
      );

      throw error;
    }
  };

  // =========================
  // RESTORE CONSUMED ITEM
  // =========================
  const restoreConsumedItem = async (id) => {
    try {
      setError(null);

      const data = await restoreItem(id);

      const updatedItem =
        data.data?.item ?? data.item ?? data.data ?? data;

      setItems((prevItems) =>
        prevItems.map((item) =>
          String(item._id) === String(id)
            ? updatedItem
            : item
        )
      );

      setSelectedItem((prevItem) =>
        prevItem && String(prevItem._id) === String(id)
          ? updatedItem
          : prevItem
      );

      return updatedItem;
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to restore item"
      );

      throw error;
    }
  };

  // =========================
  // DELETE ITEM
  // =========================
  const removeItem = async (id) => {
    try {
      setError(null);

      // Delete from backend first
      await deleteItem(id);

      // Remove from items list
      setItems((prevItems) =>
        prevItems.filter(
          (item) => String(item._id) !== String(id)
        )
      );

      // IMPORTANT:
      // Clear selectedItem if it is the deleted item
      setSelectedItem((prevItem) => {
        if (
          prevItem &&
          String(prevItem._id) === String(id)
        ) {
          return null;
        }

        return prevItem;
      });

      return true;
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to delete item"
      );

      throw error;
    }
  };

  // =========================
  // FETCH ITEMS WHEN USER LOADS
  // =========================
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setItems([]);
      setSelectedItem(null);
      setLoading(false);
      return;
    }

    fetchItems();
  }, [authLoading, user]);

  // =========================
  // CONTEXT VALUE
  // =========================
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

  return (
    <ItemContext.Provider value={value}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemContext);

  if (!context) {
    throw new Error(
      "useItems must be used inside ItemProvider"
    );
  }

  return context;
};