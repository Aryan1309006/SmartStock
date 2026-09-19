import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  CalendarDays,
  Package,
  IndianRupee,
  Tag,
  CheckCircle2,
  History,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { categoryImages } from "../../assets/dummydata/item";
import { useItems } from "../../context/itemContext";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const Item = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    items,
    selectedItem,
    loading,
    error,
    fetchSingleItem,
    removeItem,
    consumeItem,
    editItem,
  } = useItems();
  const [editing, setEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    quantity: "",
    purchaseDate: "",
    expiryDate: "",
    price: "",
    notes: "",
  });

  const item =
    items.find((currentItem) => String(currentItem._id) === String(id)) ||
    (String(selectedItem?._id) === String(id) ? selectedItem : null);

  useEffect(() => {
    if (!item && id) {
      fetchSingleItem(id);
    }
  }, [id, item, fetchSingleItem]);

  useEffect(() => {
    if (item) {
      setEditForm({
        name: item.name || "",
        category: item.category || "",
        quantity: item.quantity || "",
        purchaseDate: item.purchaseDate || "",
        expiryDate: item.expiryDate || "",
        price: item.price || "",
        notes: item.notes || "",
      });
    }
  }, [item]);

  if (loading && !item) {
    return <p className="p-6 text-gray-500">Loading item...</p>;
  }

  if (error && !item) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  if (!item) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-5">
        <Package size={50} className="text-gray-300 mb-4" />

        <h2 className="text-2xl font-bold text-gray-800">Item not found</h2>

        <p className="text-gray-500 mt-2">
          The item you're looking for doesn't exist.
        </p>

        <button
          onClick={() => navigate("/inventory")}
          className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
        >
          <ArrowLeft size={18} />
          Back to Inventory
        </button>
      </div>
    );
  }

  const parseDate = (dateString) => {
    if (!dateString) return null;

    const [year, month, day] = dateString.split("-").map(Number);

    return Date.UTC(year, month - 1, day);
  };

  const today = new Date();

  const todayUTC = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const expiryUTC = parseDate(item.expiryDate);
  const purchaseUTC = parseDate(item.purchaseDate);

  // Expiry Calculations
  const daysLeft = expiryUTC
    ? Math.round((expiryUTC - todayUTC) / MS_PER_DAY)
    : 0;

  const totalDays =
    expiryUTC && purchaseUTC
      ? Math.max(1, Math.round((expiryUTC - purchaseUTC) / MS_PER_DAY))
      : 1;

  const daysPassed = purchaseUTC
    ? Math.max(
        0,
        Math.min(totalDays, Math.round((todayUTC - purchaseUTC) / MS_PER_DAY)),
      )
    : 0;

  const progress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));

  // Expiry Status
  let expiryText;
  let expiryStatus;
  let expiryColor;
  let expiryBg;
  let expiryBorder;

  if (daysLeft < 0) {
    expiryText = `${Math.abs(daysLeft)} ${
      Math.abs(daysLeft) === 1 ? "day" : "days"
    } ago`;

    expiryStatus = "Expired";
    expiryColor = "text-red-500";
    expiryBg = "bg-red-50";
    expiryBorder = "border-red-200";
  } else if (daysLeft === 0) {
    expiryText = "Today";

    expiryStatus = "Expires Today";
    expiryColor = "text-red-500";
    expiryBg = "bg-red-50";
    expiryBorder = "border-red-200";
  } else if (daysLeft <= 3) {
    expiryText = `${daysLeft} ${daysLeft === 1 ? "day" : "days"}`;

    expiryStatus = "Expiring Soon";
    expiryColor = "text-orange-500";
    expiryBg = "bg-orange-50";
    expiryBorder = "border-orange-200";
  } else {
    expiryText = `${daysLeft} days`;

    expiryStatus = "Fresh";
    expiryColor = "text-emerald-500";
    expiryBg = "bg-emerald-50";
    expiryBorder = "border-emerald-200";
  }

  // Date Formatting
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Price Formatting
  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "N/A";
    }
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  // Handlers
  const handleEdit = () => {
    setActionError("");
    setEditing(true);
  };

const handleDelete = async () => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${item.name}"?`,
  );

  if (!confirmed) return;

  try {
    setActionLoading(true);
    setActionError("");

    await removeItem(item._id);

    // Navigate only after successful deletion
    navigate("/inventory", { replace: true });
  } catch (requestError) {
    setActionError(
      requestError.response?.data?.message || "Failed to delete item",
    );
  } finally {
    setActionLoading(false);
  }
};
  const handleConsumed = async () => {
    try {
      setActionLoading(true);
      setActionError("");
      await consumeItem(item._id);
    } catch (requestError) {
      setActionError(
        requestError.response?.data?.message || "Failed to mark item as consumed",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    try {
      setActionLoading(true);
      setActionError("");
      await editItem(item._id, {
        ...editForm,
        quantity: Number(editForm.quantity),
        price: Number(editForm.price),
      });
      setEditing(false);
    } catch (requestError) {
      setActionError(
        requestError.response?.data?.message || "Failed to update item",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleHistory = () => {
    navigate("/history");
  };

  // UI

  return (
    <div className="min-h-screen bg-gray-50 px-3 pb-8 pt-3 sm:px-6 sm:pb-10 sm:pt-4 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/inventory")}
          className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Inventory
        </button>

        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:mt-6 sm:rounded-3xl">
          <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <img
                src={categoryImages?.[item.category]}
                alt={item.name}
                className="h-16 w-16 shrink-0 rounded-xl border border-gray-100 object-cover shadow-sm sm:h-24 sm:w-24 sm:rounded-2xl"
              />

              <div className="min-w-0">
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-emerald-600">
                  Inventory Item
                </p>
                <h1 className="mt-1 truncate text-xl font-bold text-gray-900 sm:mt-2 sm:text-3xl">
                  {item.name}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    {item.category}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${expiryBg} ${expiryColor} ${expiryBorder}`}
                  >
                    {expiryStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
              <button
                onClick={handleEdit}
                disabled={actionLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500 px-3 py-2 text-sm font-medium text-blue-500 transition hover:bg-blue-500 hover:text-white sm:w-auto sm:px-4 sm:py-2.5"
              >
                <Pencil size={17} />
                Edit Item
              </button>

              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white sm:w-auto sm:px-4 sm:py-2.5"
              >
                <Trash2 size={17} />
                Delete Item
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Expires in</p>
                <h2 className={`mt-2 text-3xl font-bold ${expiryColor}`}>
                  {expiryText}
                </h2>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${expiryBg}`}
              >
                <CalendarDays size={22} className={expiryColor} />
              </div>
            </div>

            <div className="my-6 border-t border-gray-100" />

            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.12em] text-gray-400">
                Expiry Date
              </p>
              <p className="mt-2 text-lg font-semibold text-gray-800">
                {formatDate(item.expiryDate)}
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                <span>Lifetime used</span>
                <span className="font-semibold text-gray-700">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all ${
                    daysLeft < 0
                      ? "bg-red-400"
                      : daysLeft <= 3
                        ? "bg-orange-400"
                        : "bg-emerald-400"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                <span>
                  {daysPassed} {daysPassed === 1 ? "day" : "days"}
                </span>
                <span>
                  {totalDays} {totalDays === 1 ? "day" : "days"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Package size={18} className="text-blue-500" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">Item Details</h2>
                <p className="text-xs text-gray-500">Quick overview</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5">
                <div className="flex items-center gap-2 text-gray-500">
                  <Package size={15} />
                  <span className="text-sm">Quantity</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{item.quantity}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5">
                <div className="flex items-center gap-2 text-gray-500">
                  <IndianRupee size={15} />
                  <span className="text-sm">Price</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{formatPrice(item.price)}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5">
                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarDays size={15} />
                  <span className="text-sm">Purchase Date</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{formatDate(item.purchaseDate)}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5">
                <div className="flex items-center gap-2 text-gray-500">
                  <Tag size={15} />
                  <span className="text-sm">Category</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{item.category}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-6 sm:rounded-3xl sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">Notes</h2>
          <p className="mt-3 leading-7 text-gray-600">
            {item.notes || "No notes added for this item."}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-3">
          <button
            onClick={handleConsumed}
            disabled={actionLoading || item.status === "consumed"}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          >
            <CheckCircle2 size={18} />
            {item.status === "consumed"
              ? "Already Consumed"
              : actionLoading
                ? "Updating..."
                : "Mark as Consumed"}
          </button>

          <button
            onClick={handleHistory}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-500 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100"
          >
            <History size={18} />
            View History
          </button>
        </div>

        {actionError && (
          <p className="mt-4 text-sm text-red-600">{actionError}</p>
        )}

        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <form
              onSubmit={handleSaveEdit}
              className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Edit Item</h2>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="text-gray-500 hover:text-gray-900"
                >
                  Close
                </button>
              </div>

              <input
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                required
                placeholder="Item name"
                className="w-full rounded-xl border border-gray-300 px-3 py-2"
              />
              <select
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
                required
                className="w-full rounded-xl border border-gray-300 px-3 py-2"
              >
                <option value="">Select category</option>
                <option value="Dairy">Dairy</option>
                <option value="Pantry">Pantry</option>
                <option value="Medicine">Medicine</option>
                <option value="Toiletries">Toiletries</option>
                <option value="Cleaning">Cleaning</option>
              </select>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  value={editForm.quantity}
                  onChange={handleEditChange}
                  required
                  placeholder="Quantity"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2"
                />
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.price}
                  onChange={handleEditChange}
                  required
                  placeholder="Price"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2"
                />
                <input
                  name="purchaseDate"
                  type="date"
                  value={editForm.purchaseDate}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-3 py-2"
                />
                <input
                  name="expiryDate"
                  type="date"
                  value={editForm.expiryDate}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-3 py-2"
                />
              </div>
              <textarea
                name="notes"
                value={editForm.notes}
                onChange={handleEditChange}
                placeholder="Notes"
                rows="3"
                className="w-full rounded-xl border border-gray-300 px-3 py-2"
              />
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {actionLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;
