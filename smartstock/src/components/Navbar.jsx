import { Menu, Plus } from "lucide-react";
import React from "react";
import { useLocation } from "react-router-dom";

const Navbar = ({ setOpen, setSidebarOpen }) => {
  const location = useLocation();

  const titles = {
    "/dashboard": "Dashboard",
    "/inventory": "Inventory",
    "/history": "History",
    "/products": "Products",
    "/analytics": "Analytics",
    "/inventory/": "InventoryItem",
  };
  const title = titles[location.pathname] || "";
  const isInventoryItem = location.pathname.startsWith("/inventory/");
  return (
    <nav className="flex min-h-16 w-full items-center justify-between gap-3 px-0 sm:px-2">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate text-2xl font-bold sm:text-4xl">{title}</h1>
          {title === "Inventory" && (
            <div className="hidden text-sm text-gray-400 sm:block">manage all inventory items</div>
          )}
        </div>
</div>
      {!isInventoryItem && (
        <button className="flex shrink-0 items-center gap-1 rounded-lg bg-emerald-500 px-3 py-2 text-sm text-white hover:bg-emerald-600 sm:gap-2 sm:px-4 sm:text-base"
        onClick={() => setOpen(true)}
        >
          <Plus size={18} /> <span className="hidden sm:inline">Add Item</span>
        </button>
      )}
    </nav>
  );
};

export default Navbar;
