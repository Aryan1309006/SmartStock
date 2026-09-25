import React from "react";
import Dashborardcard from "../components/dashboard/Dashborardcard";
import Statcard from "../components/dashboard/Statcard";
import { lazy, Suspense } from "react";
import Loader from "../components/Loader";
const CategoryChart = lazy(() => import("../components/dashboard/CategoryChart"),);
import { useAuth } from "../context/authContext";
import { useDashboard } from "../context/dashboardContext";
import { useItems } from "../context/itemContext";
import { CircleAlert } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const { dashboard, expiringItems, recentlyConsumedItems, loading, error } =
    useDashboard();
  const { items, loading: itemsLoading, error: itemsError } = useItems();

  if (loading || itemsLoading) {
    return <div className="p-6 text-gray-500"><Loader/></div>;
  }

  if (error || itemsError) {
    return <div className="flex flex-col items-center justify-center font-bold text-red-600"><CircleAlert/> {error || itemsError}</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Hi {user?.name || "there"} 👋
        </p>

        <p className="mt-1 text-sm sm:text-base text-gray-500">
          Here is your inventory overview
        </p>
      </div>

      {/* STAT CARDS */}
      <Statcard dashboard={dashboard || {}} />

      {/* BOTTOM SECTION */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Expiring Soon */}
        <Dashborardcard
          item={expiringItems}
          name="Expiring Soon"
          type="expiry"
        />

        {/* Category Chart */}
        <Suspense fallback={<Loader text="Loading chart..." />}>
          <CategoryChart items={items || []} dashboard={dashboard || {}} />
        </Suspense>

        {/* Recently Consumed */}
        <Dashborardcard
          item={recentlyConsumedItems}
          name="Recently Consumed"
          type="consumed"
        />
      </div>
    </div>
  );
};

export default Dashboard;
