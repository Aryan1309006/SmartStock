import React from "react";
import {
  X,
  Package,
  Tag,
  Hash,
  Calendar,
  IndianRupee,
  FileText,
} from "lucide-react";
import { useItems } from "../context/itemContext";

const AddItem = ({ onClose }) => {
  const { addItem } = useItems();
  const [formData, setFormData] = React.useState({
    name: "",
    category: "",
    quantity: "",
    purchaseDate: "",
    expiryDate: "",
    price: "",
    notes: "",
  });
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.category ||
      !formData.quantity ||
      !formData.purchaseDate ||
      !formData.expiryDate ||
      !formData.price
    ) {
      setError("Please fill all required fields");
      return;
    }

    const newItem = {
      name: formData.name,
      category: formData.category,
      quantity: Number(formData.quantity),
      purchaseDate: formData.purchaseDate,
      expiryDate: formData.expiryDate,
      price: Number(formData.price),
      notes: formData.notes,
    };

    try {
      setSubmitting(true);
      await addItem(newItem);
      onClose();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Failed to add item. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-10">

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Add Item
            </h2>

            <p className="text-sm text-gray-500">
              Add a new item to your inventory
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >

          {/* Item Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Item Name
            </label>

            <div className="relative">
              <Package
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Milk"
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Category
            </label>

            <div className="relative">
              <Tag
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Select category</option>
                <option value="Dairy">Dairy</option>
                <option value="Pantry">Pantry</option>
                <option value="Medicine">Medicine</option>
                <option value="Toiletries">Toiletries</option>
                <option value="Cleaning">Cleaning</option>
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Quantity
            </label>

            <div className="relative">
              <Hash
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 2"
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Purchase Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Purchase Date
              </label>

              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Expiry Date
              </label>

              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Price
            </label>

            <div className="relative">
              <IndianRupee
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 65"
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Notes
            </label>

            <div className="relative">
              <FileText
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Keep refrigerated"
                rows="3"
                className="w-full resize-none rounded-xl border border-gray-300 py-3 pl-10 pr-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Buttons */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              {submitting ? "Adding..." : "Add Item"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddItem;