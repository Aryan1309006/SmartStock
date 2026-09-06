import React, { Profiler } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/SmartStockLogo.svg"
import {
  LayoutDashboard,
  Package,
  Plus,
  User,
  Settings,
  LogOut,
} from "lucide-react";
export const navOption = [
  {
    component: "Dashboard",
    link: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    component: "Inventory",
    link: "/inventory",
    icon: Package,
  },
  {
    component: "Analytics",
    link: "/analytics",
    icon: Plus,
  },
  {
    component: "Notification",
    link: "/notification",
    icon: User,
  },
];
const Sidebar = () => {
  return (
    <div className="bg-white fixed top-0 left-0 z-40 h-screen w-70 flex flex-col py-7 pl-4 pr-10 ">
      <div className="h-20"><img src={logo} alt="SmartStock Logo"  className="h-15"/></div>
      <div className="flex flex-col gap-1 mb-75 font-semibold">
        {navOption.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              to={item.link}
              key={item.link}
              className={({ isActive }) =>`flex rounded-xl items-center gap-4  ${
                  isActive
                    ? "bg-emerald-100 text-emerald-500"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }  p-2`}
            >
              <Icon size={20} />
              <span>{item.component}</span>
            </NavLink>
          );
        })}
      </div>
      <div>
        <div className=" md-auto">
          <Link
            to="/settings"
            className={`flex rounded-xl font-semibold items-center gap-3 text-gray-500 
             
              hover:text-green-300 hover:bg-emerald-100 p-2`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <Link
            to="/profile"
            className="flex rounded-xl font-semibold items-center gap-3 text-gray-500  hover:text-green-300 hover:bg-emerald-100 p-2"
          >
            <User size={20} />
            <span>Profile</span>
          </Link>
        </div>


        <div>
          <Link
            to="/logout"
            className="flex rounded-xl items-center gap-3 font-semibold text-gray-500  hover:text-red-300 hover:bg-red-100 p-2"
          >
            <LogOut size={20} />
            <span>log out</span>
          </Link>
        </div>


      </div>
    </div>
  );
};

export default Sidebar;
