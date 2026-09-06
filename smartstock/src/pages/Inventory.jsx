import { Plus } from "lucide-react";
import React from "react";
import { dummyItems } from "../assets/dummydata/item";
import { categories, statuses } from "../assets/dummydata/constants";
import Inventoryitem from "../components/Inventory/Inventoryitem";

const Inventory = () => {
  const data = dummyItems;

  const [category, setCategory] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  const [filteredItems, setFilteredItems] = React.useState(data.data.items);

  React.useEffect(() => {
    let filtered = data.data.items;

    // SEARCH
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
      filtered = [...filtered].sort((a, b) => {
        if (sort === "name-asc") {
          return a.name.localeCompare(b.name);
        }

        if (sort === "name-desc") {
          return b.name.localeCompare(a.name);
        }

        if (sort === "expiry-asc") {
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        }

        if (sort === "expiry-desc") {
          return new Date(b.expiryDate) - new Date(a.expiryDate);
        }

        return 0;
      });
    }

    setFilteredItems(filtered);
  }, [searchTerm, category, status, sort]);

  return (
    <div className="h-screen w-full">
      {/* HEADER */}

      

      {/* FILTERS */}

      <div className="flex gap-4 mt-4 px-4">
        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 w-full border rounded-lg border-gray-300 bg-white p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* CATEGORY */}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 w-full border rounded-lg border-gray-300 bg-white p-1"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* STATUS */}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 w-full border rounded-lg border-gray-300 bg-white p-1"
        >
          <option value="">All Statuses</option>

          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* SORT */}

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-10 w-full border rounded-lg border-gray-300 bg-white p-1"
        >
          <option value="">Sort By</option>

          <option value="name-asc">Name (A-Z)</option>

          <option value="name-desc">Name (Z-A)</option>

          <option value="expiry-asc">Expiry Date (Earliest)</option>

          <option value="expiry-desc">Expiry Date (Latest)</option>
        </select>

        <div className="flex gap-2"></div>
      </div>

      {/* ITEMS */}

    <section className="mt-10 flex items-center justify-center">

  <div className="w-5xl">

    {/* Table Header */}

    <div className="w-[100%] px-4 flex  gap-4 bg-emerald-500 text-white place-items-center h-14 rounded-t-3xl font-semibold">

      <div className="w-[20%] text-center ">Item</div>
      <div className="w-[15%] text-center ">Category</div>
      <div className="w-[10%] text-center ">Quantity</div>
      <div className="w-[15%] text-center ">Expiry Date</div>
      <div className="w-[15%] text-center">Status</div>
      <div className="w-[10%] text-center ">Price</div>
      <div className="w-[20%] text-center ">Action</div>

    </div>


    {/* Items */}

    {filteredItems.map((item) => (
      <Inventoryitem
        item={item}
        key={item._id}
      />
    ))}

  </div>

</section>
    </div>
  );
};

export default Inventory;
