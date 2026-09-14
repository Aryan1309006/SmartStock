import { History as HistoryIcon, Package, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useItems } from "../context/itemContext";

const formatDate = (dateValue) => {
  if (!dateValue) return "Unknown date";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const History = () => {
  const { items, loading, error } = useItems();
  const consumedItems = items
    .filter((item) => item.status === "consumed" || item.consumedAt)
    .sort((firstItem, secondItem) => {
      return (
        new Date(secondItem.consumedAt || 0) -
        new Date(firstItem.consumedAt || 0)
      );
    });

  if (loading) {
    return <p className="p-6 text-gray-500">Loading history...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <section className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <HistoryIcon className="text-emerald-600" size={22} />
            <h1 className="text-2xl font-bold text-gray-900">Consumption History</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Items that have recently been consumed.
          </p>
        </div>

        <Link
          to="/inventory"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
        >
          <ArrowLeft size={16} />
          Inventory
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {consumedItems.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {consumedItems.map((item) => (
              <Link
                to={`/inventory/${item._id}`}
                key={item._id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 transition hover:bg-emerald-50 sm:p-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <Package size={19} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-gray-900">{item.name}</h2>
                    <p className="text-sm text-gray-500">
                      {item.category} · Quantity {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-left text-sm sm:text-right">
                  <p className="font-medium text-gray-700">
                    Consumed {formatDate(item.consumedAt)}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    Consumed
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
            <HistoryIcon className="text-gray-300" size={42} />
            <h2 className="mt-3 font-semibold text-gray-700">No consumed items yet</h2>
            <p className="mt-1 text-sm text-gray-500">
              Items marked as consumed will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default History;
