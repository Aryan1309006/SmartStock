import React, { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { dummyItems } from "../assets/dummydata/item";
import { categories, statuses } from "../assets/dummydata/constants";
import Inventoryitem from "../components/Inventory/Inventoryitem";

const Inventory = () => {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const items = dummyItems?.data?.items || [];

  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // SEARCH
    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }

    // CATEGORY
    if (category) {
      filtered = filtered.filter((item) => item.category === category);
    }

    // STATUS
    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }

    // SORT
    if (sort) {
      filtered.sort((a, b) => {
        switch (sort) {
          case "name-asc":
            return a.name.localeCompare(b.name);

          case "name-desc":
            return b.name.localeCompare(a.name);

          case "expiry-asc":
            return new Date(a.expiryDate) - new Date(b.expiryDate);

          case "expiry-desc":
            return new Date(b.expiryDate) - new Date(a.expiryDate);

          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [items, searchTerm, category, status, sort]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("");
    setStatus("");
    setSort("");
  };

  const hasFilters = searchTerm || category || status || sort;

  return (
    <div className="min-h-screen w-full bg-gray-50 p-3 sm:p-5 lg:p-6">
      {/* PAGE HEADER */}
   
      {/* FILTER CARD */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal size={19} className="text-emerald-600" />

          <h2 className="font-semibold text-gray-800">
            Filters
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* SEARCH */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">All Categories</option>

            {categories.map((itemCategory) => (
              <option key={itemCategory} value={itemCategory}>
                {itemCategory}
              </option>
            ))}
          </select>

          {/* STATUS */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">All Statuses</option>

            {statuses.map((itemStatus) => (
              <option key={itemStatus} value={itemStatus}>
                {itemStatus}
              </option>
            ))}
          </select>

          {/* SORT */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Sort By</option>

            <option value="name-asc">
              Name (A-Z)
            </option>

            <option value="name-desc">
              Name (Z-A)
            </option>

            <option value="expiry-asc">
              Expiry Date (Earliest)
            </option>

            <option value="expiry-desc">
              Expiry Date (Latest)
            </option>
          </select>
        </div>

        {/* ACTIVE FILTERS / CLEAR */}
        {hasFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">
              {filteredItems.length} result
              {filteredItems.length !== 1 ? "s" : ""}
            </span>

            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <X size={15} />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* INVENTORY */}
      <section className="mt-6">
        {/* TABLE CONTAINER */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* TABLE SCROLL */}
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* TABLE HEADER */}
              <div className="grid h-14 grid-cols-[1.5fr_1fr_0.7fr_1.1fr_1fr_0.8fr_1fr] items-center gap-3 bg-emerald-500 px-5 text-sm font-semibold text-white">
                <div>Item</div>

                <div className="text-center">
                  Category
                </div>

                <div className="text-center">
                  Quantity
                </div>

                <div className="text-center">
                  Expiry Date
                </div>

                <div className="text-center">
                  Status
                </div>

                <div className="text-center">
                  Price
                </div>

                <div className="text-center">
                  Action
                </div>
              </div>

              {/* ITEMS */}
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <Inventoryitem
                    item={item}
                    key={item._id}
                  />
                ))
              ) : (
                <div className="flex min-h-60 flex-col items-center justify-center px-5 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <Search
                      size={22}
                      className="text-gray-400"
                    />
                  </div>

                  <h3 className="font-semibold text-gray-700">
                    No items found
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Try changing your search or filters.
                  </p>

                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* RESULT COUNT */}
      <div className="mt-3 text-right text-xs text-gray-500 sm:text-sm">
        Showing {filteredItems.length} of {items.length} items
      </div>
    </div>
  );
};

export default Inventory;

