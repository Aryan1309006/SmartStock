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

  const getDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);

    const diffTime = expiry.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)}d ago`;
    if (diffDays === 0) return "Today";
    return `${diffDays}d`;
  };

  return (
    <Link
      to={`/inventory/${item._id}`}
      className="block bg-gray-50 transition hover:bg-emerald-50"
    >
      <div
        className="
          grid h-16 items-center
          gap-2
          border-b border-gray-200
          px-3
          text-xs font-semibold text-gray-600

          /* MOBILE
             Item | Expiry | Status
          */
          grid-cols-[1.5fr_1.1fr_1fr]

          /* TABLET
             Item | Category | Quantity | Expiry | Status
          */
          sm:grid-cols-[1.5fr_0.8fr_0.7fr_1.1fr_0.8fr]

          /* DESKTOP
             Item | Category | Quantity | Expiry | Status | Price | Action
          */
          lg:grid-cols-[1.5fr_1fr_0.7fr_1.1fr_1fr_0.8fr_1fr]

          sm:text-sm
          lg:gap-3
          lg:px-5
        "
      >
        {/* ITEM */}

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <img
            src={categoryImages[item.category]}
            alt={item.name}
            className="
              h-8 w-8
              shrink-0
              rounded-lg
              object-cover

              sm:h-10 sm:w-10
            "
          />

          <span className="truncate font-bold text-gray-900">
            {item.name}
          </span>
        </div>

        {/* CATEGORY
            Hidden on mobile
            Visible tablet+
        */}

        <div className="hidden text-center sm:block">
          {item.category}
        </div>

        {/* QUANTITY
            Hidden on mobile
            Visible tablet+
        */}

        <div className="hidden text-center sm:block">
          {item.quantity}
        </div>

        {/* EXPIRY DATE */}

        <div className="text-center text-[11px] sm:text-sm">
          {new Date(item.expiryDate).toLocaleDateString()}
        </div>

        {/* STATUS */}

        <div className="text-center">
          <span
            className={`
              inline-flex
              rounded-full
              px-2 py-1
              text-[9px]
              font-medium
              capitalize

              sm:px-2.5
              sm:text-xs

              ${getStatusClasses(item.status)}
            `}
          >
            {item.status}
          </span>
        </div>

        {/* PRICE
            Desktop only
        */}

        <div className="hidden text-center lg:block">
          ₹{item.price}
        </div>

        {/* DAYS LEFT
            Desktop only
        */}

        <div className="hidden text-center lg:block">
          <span
            className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
              new Date(item.expiryDate) < new Date()
                ? "bg-red-100 text-red-600"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {getDaysLeft(item.expiryDate)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Inventoryitem;