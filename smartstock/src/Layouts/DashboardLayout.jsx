import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

import { useState } from "react";
import Additem from "../pages/Additem";

const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gray-50 text-gray-800 lg:pl-72">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 px-4 py-4 sm:p-6">
        <Navbar setOpen={setOpen} setSidebarOpen={setSidebarOpen} />
        <Outlet />
      </main>

      <Footer />
      {open && <Additem setOpen={setOpen} />}
    </div>
  );
};

export default DashboardLayout;
