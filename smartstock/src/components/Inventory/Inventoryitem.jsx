import React from "react";
import { categoryImages } from "../../assets/dummydata/item";
import { Link } from "react-router-dom";

const Inventoryitem = ({ item }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case "expired":
        return "bg-red-50 text-red-600 border border-red-200";
      case "consumed":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }
  };

  return (
    <Link
      to={`/inventory/${item._id}`}
      className="block bg-gray-50 transition hover:bg-emerald-50"
    >
      <div className="grid h-16 grid-cols-[1.5fr_1fr_0.7fr_1.1fr_1fr_0.8fr_1fr] items-center gap-3 border-b border-gray-200 px-5 text-sm font-semibold text-gray-600">
        <div className="flex items-center gap-3 text-left">
          <img
            src={categoryImages[item.category]}
            alt={item.name}
            className="h-10 w-10 rounded-lg object-cover"
          />
          <span className="font-bold text-gray-900">{item.name}</span>
        </div>

        <div className="hidden text-center sm:block">{item.category}</div>

        <div className="text-center">{item.quantity}</div>

        <div className="text-center">
          {new Date(item.expiryDate).toLocaleDateString()}
        </div>

        <div className="text-center">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClasses(
              item.status,
            )}`}
          >
            {item.status}
          </span>
        </div>

        <div className="hidden text-center lg:block">₹{item.price}</div>

        <div className="hidden text-center lg:block">View</div>
      </div>
    </Link>
  );
};

export default Inventoryitem;
