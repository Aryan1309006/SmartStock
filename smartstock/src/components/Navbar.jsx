import { Plus } from "lucide-react";
import React from "react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const titles = {
    "/dashboard": "Dashboard",
    "/inventory": "Inventory",
    "/products": "Products",
    "/analytics": "Analytics",
    "/inventory/": "InventoryItem",
  };
  const title = titles[location.pathname] || "";
  const isInventoryItem = location.pathname.startsWith("/inventory/");
  return (
    <nav className="h-16 w-full flex items-center justify-between px-4">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold">{title}</h1>
        {title == "Inventory" && (
          <div className="text-gray-300">manage all inventory items</div>
        )}
      </div>

      {!isInventoryItem && (
        <button className="flex bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600">
          {" "}
          <Plus /> Add Item{" "}
        </button>
      )}
    </nav>
  );
};

export default Navbar;
