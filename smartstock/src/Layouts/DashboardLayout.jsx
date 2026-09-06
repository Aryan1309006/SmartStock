import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-65 min-h-screen p-6 bg-gray-50">
        <Navbar/>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;