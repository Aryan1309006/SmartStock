import React, { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { categories, statuses } from "../assets/dummydata/constants";
import Inventoryitem from "../components/Inventory/Inventoryitem";
import { useItems } from "../context/itemContext";
import Loader from "../components/Loader";

const Inventory = () => {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { items: allItems, loading, error } = useItems();

  const items = allItems.filter((item) => item.status !== "consumed");

  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // SEARCH
    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase().trim()),
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

  // Show loader while inventory/items are loading
  if (loading && !items) {
   return <Loader text="Loading inventory..." />;
  }

  // Only show error after loading has finished
  if (error && !items && !loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-5">
        <Package size={50} className="mb-4 text-red-300" />

        <h2 className="text-2xl font-bold text-gray-800">
          Unable to load item
        </h2>

        <p className="mt-2 text-gray-500 text-center">{error}</p>

        <button
          onClick={() => navigate("/inventory")}
          className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-white transition hover:bg-emerald-700"
        >
          <ArrowLeft size={18} />
          Back to Inventory
        </button>
      </div>
    );
  }

  // Only show "not found" when loading has completely finished
  if (!items && !loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-5">
        <Package size={50} className="mb-4 text-gray-300" />

        <h2 className="text-2xl font-bold text-gray-800">Item not found</h2>

        <p className="mt-2 text-gray-500">
          The item you're looking for doesn't exist.
        </p>

        <button
          onClick={() => navigate("/inventory")}
          className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-white transition hover:bg-emerald-700"
        >
          <ArrowLeft size={18} />
          Back to Inventory
        </button>
      </div>
    );
  }
  return (
    <div
      className="
        min-h-screen w-full bg-gray-50
        p-3
        sm:p-5
        lg:p-6
      "
    >
      {/* ================= FILTER CARD ================= */}

      <div
        className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-4
          shadow-sm
          sm:p-5
        "
      >
        {/* FILTER TITLE */}

        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal size={19} className="text-emerald-600" />

          <h2 className="font-semibold text-gray-800">Filters</h2>
        </div>

        {/* FILTERS */}

        <div
          className="
            grid grid-cols-1 gap-3
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {/* SEARCH */}

          <div className="relative">
            <Search
              size={18}
              className="
                absolute left-3 top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                h-11 w-full
                rounded-xl
                border border-gray-300
                bg-white
                pl-10 pr-4
                text-sm text-gray-700
                outline-none
                transition

                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-100
              "
            />
          </div>

          {/* CATEGORY */}

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="
              h-11 w-full
              rounded-xl
              border border-gray-300
              bg-white
              px-3
              text-sm text-gray-700
              outline-none
              transition

              focus:border-emerald-500
              focus:ring-2
              focus:ring-emerald-100
            "
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
            className="
              h-11 w-full
              rounded-xl
              border border-gray-300
              bg-white
              px-3
              text-sm text-gray-700
              outline-none
              transition

              focus:border-emerald-500
              focus:ring-2
              focus:ring-emerald-100
            "
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
            className="
              h-11 w-full
              rounded-xl
              border border-gray-300
              bg-white
              px-3
              text-sm text-gray-700
              outline-none
              transition

              focus:border-emerald-500
              focus:ring-2
              focus:ring-emerald-100
            "
          >
            <option value="">Sort By</option>

            <option value="name-asc">Name (A-Z)</option>

            <option value="name-desc">Name (Z-A)</option>

            <option value="expiry-asc">Expiry Date (Earliest)</option>

            <option value="expiry-desc">Expiry Date (Latest)</option>
          </select>
        </div>

        {/* ACTIVE FILTERS */}

        {hasFilters && (
          <div
            className="
              mt-4
              flex flex-wrap
              items-center
              gap-2
            "
          >
            <span className="text-sm text-gray-500">
              {filteredItems.length} result
              {filteredItems.length !== 1 ? "s" : ""}
            </span>

            <button
              onClick={clearFilters}
              className="
                ml-auto
                flex items-center gap-1.5
                rounded-lg
                px-3 py-1.5
                text-sm font-medium
                text-red-600
                transition
                hover:bg-red-50
              "
            >
              <X size={15} />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <section className="mt-5 sm:mt-6">
        <div
          className="
      overflow-hidden
      rounded-2xl
      border border-gray-200
      bg-white
      shadow-sm
    "
        >
          {/* TABLE HEADER */}

          <div
            className="
        grid h-14
        items-center
        gap-2
        bg-emerald-500
        px-3
        text-xs
        font-semibold
        text-white

        /* MOBILE
           Item | Expiry | Status
        */
        grid-cols-[1.5fr_1.1fr_1fr]

        /* TABLET
           Item | Category | Quantity | Expiry | Status
        */
        sm:grid-cols-[1.5fr_0.8fr_0.7fr_1.1fr_0.8fr]

        /* DESKTOP
           All columns
        */
        lg:grid-cols-[1.5fr_1fr_0.7fr_1.1fr_1fr_0.8fr_1fr]

        sm:text-sm
        lg:gap-3
        lg:px-5
      "
          >
            {/* ITEM */}

            <div>Item</div>

            {/* CATEGORY */}

            <div className="hidden text-center sm:block">Category</div>

            {/* QUANTITY */}

            <div className="hidden text-center sm:block">Quantity</div>

            {/* EXPIRY */}

            <div className="text-center">Expiry</div>

            {/* STATUS */}

            <div className="text-center">Status</div>

            {/* PRICE */}

            <div className="hidden text-center lg:block">Price</div>

            {/* DAYS LEFT */}

            <div className="hidden text-center lg:block">Days Left</div>
          </div>

          {/* ITEMS */}

          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Inventoryitem item={item} key={item._id} />
            ))
          ) : (
            <div
              className="
          flex min-h-60
          flex-col
          items-center
          justify-center
          px-5
          text-center
        "
            >
              <div
                className="
            mb-3
            flex h-12 w-12
            items-center justify-center
            rounded-full
            bg-gray-100
          "
              >
                <Search size={22} className="text-gray-400" />
              </div>

              <h3 className="font-semibold text-gray-700">No items found</h3>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or filters.
              </p>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="
              mt-4
              rounded-lg
              bg-emerald-500
              px-4 py-2
              text-sm font-medium
              text-white
              transition
              hover:bg-emerald-600
            "
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ================= RESULT COUNT ================= */}

      <div
        className="
          mt-3
          text-right
          text-xs
          text-gray-500
          sm:text-sm
        "
      >
        Showing {filteredItems.length} of {items.length} items
      </div>
    </div>
  );
};

export default Inventory;
