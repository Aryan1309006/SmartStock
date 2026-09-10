import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

import { useState } from "react";
import Additem from "../pages/Additem";

const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="min-h-screen px-4 py-4 sm:p-6 lg:ml-70">
        <Navbar setOpen={setOpen} setSidebarOpen={setSidebarOpen} />
        <Outlet />
      </main>
      {open && <Additem setOpen={setOpen} />}
    </div>
  );
};

export default DashboardLayout;
