import React from "react";
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

import { dummyItems, categoryImages } from "../../assets/dummydata/item";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const Item = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const items = dummyItems?.data?.items || [];

  const item = items.find((item) => String(item._id) === String(id));

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
    navigate(`/inventory/edit/${item._id}`);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`,
    );

    if (!confirmed) return;

    // Add your delete API logic here
    console.log("Delete item:", item._id);
  };

  const handleConsumed = () => {
    // Add your consumed API logic here
    console.log("Mark as consumed:", item._id);
  };

  const handleHistory = () => {
    navigate(`/inventory/${item._id}/history`);
  };

  // UI

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/inventory")}
          className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Inventory
        </button>

        <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <img
                src={categoryImages?.[item.category]}
                alt={item.name}
                className="h-20 w-20 rounded-2xl border border-gray-100 object-cover shadow-sm sm:h-24 sm:w-24"
              />

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-emerald-600">
                  Inventory Item
                </p>
                <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
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

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleEdit}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-500 px-4 py-2.5 text-sm font-medium text-blue-500 transition hover:bg-blue-500 hover:text-white"
              >
                <Pencil size={17} />
                Edit Item
              </button>

              <button
                onClick={handleDelete}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={17} />
                Delete Item
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
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

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
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

        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">Notes</h2>
          <p className="mt-3 leading-7 text-gray-600">
            {item.notes || "No notes added for this item."}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleConsumed}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          >
            <CheckCircle2 size={18} />
            Mark as Consumed
          </button>

          <button
            onClick={handleHistory}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-500 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100"
          >
            <History size={18} />
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Item;
