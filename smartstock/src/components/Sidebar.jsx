import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/SmartStockLogo.svg";
import boxLogo from "../assets/smartstock-box-logo.svg";
import {
  LayoutDashboard,
  Package,
  Plus,
  User,
  Settings,
  LogOut,
  BellDot,
  ChartNoAxesCombined,
  Sparkles,
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
    icon: ChartNoAxesCombined,
  },
  {
    component: "AI Suggestions",
    link: "/suggestion",
    icon: Sparkles,
  },
  {
    component: "Notification",
    link: "/notification",
    icon: BellDot,
  },
];
const Sidebar = ({ open, setOpen }) => {
  return (
    <>
    {open && (
      <button
        type="button"
        aria-label="Close navigation"
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-40 bg-black/30 lg:hidden"
      />
    )}
    <aside className={`group fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-gray-200 bg-white px-4 py-7 shadow-sm transition-[width,transform,padding,box-shadow] duration-300 ease-in-out lg:w-20 lg:translate-x-0 lg:px-3 lg:hover:w-72 lg:hover:px-4 lg:hover:shadow-lg ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="relative flex h-20 items-center overflow-hidden">
        <img
          src={boxLogo}
          alt="SmartStock"
          className="h-12 w-12 shrink-0 object-contain transition-all duration-300 ease-in-out lg:opacity-100 lg:group-hover:scale-95 lg:group-hover:opacity-0"
        />
        <img
          src={logo}
          alt="SmartStock"
          className="absolute left-0 h-15 w-auto max-w-none opacity-100 transition-all duration-300 ease-in-out lg:translate-x-2 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100"
        />
      </div>
      <div className="flex flex-col gap-1 font-semibold">
        {navOption.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              to={item.link}
              key={item.link}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>`flex items-center justify-center gap-4 rounded-xl p-2 transition-colors duration-200 lg:justify-center lg:group-hover:justify-start ${
                  isActive
                    ? "bg-emerald-100 text-emerald-500"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <Icon size={20} />
              <span className="lg:invisible lg:w-0 lg:translate-x-2 lg:opacity-0 lg:transition-[width,transform,opacity] lg:duration-300 lg:group-hover:visible lg:group-hover:w-auto lg:group-hover:translate-x-0 lg:group-hover:opacity-100">{item.component}</span>
            </NavLink>
          );
        })}
      </div>
      <div className="mt-auto">
        <div className=" md-auto">
          <Link
            to="/settings"
            onClick={() => setOpen(false)}
              className={`flex items-center justify-center gap-3 rounded-xl p-2 font-semibold text-gray-500 lg:justify-center lg:group-hover:justify-start
             
              hover:bg-emerald-100 hover:text-green-300`}
          >
            <Settings size={20} />
            <span className="lg:invisible lg:w-0 lg:opacity-0 lg:transition-opacity lg:group-hover:visible lg:group-hover:w-auto lg:group-hover:opacity-100">Settings</span>
          </Link>
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-3 rounded-xl p-2 font-semibold text-gray-500 hover:bg-emerald-100 hover:text-green-300 lg:justify-center lg:group-hover:justify-start"
          >
            <User size={20} />
            <span className="lg:invisible lg:w-0 lg:opacity-0 lg:transition-opacity lg:group-hover:visible lg:group-hover:w-auto lg:group-hover:opacity-100">Profile</span>
          </Link>
        </div>


        <div>
          <Link
            to="/logout"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-3 rounded-xl p-2 font-semibold text-gray-500 hover:bg-red-100 hover:text-red-300 lg:justify-center lg:group-hover:justify-start"
          >
            <LogOut size={20} />
            <span className="lg:invisible lg:w-0 lg:opacity-0 lg:transition-opacity lg:group-hover:visible lg:group-hover:w-auto lg:group-hover:opacity-100">Log out</span>
          </Link>
        </div>


      </div>
    </aside>
    </>
  );
};

export default Sidebar;
