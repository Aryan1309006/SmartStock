import React from "react";
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
  },{
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
    <aside className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-gray-200 bg-white px-4 py-7 transition-transform duration-200 lg:w-70 lg:translate-x-0 lg:pr-10 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="h-20"><img src={logo} alt="SmartStock Logo" className="h-15" /></div>
      <div className="flex flex-col gap-1 font-semibold lg:mb-75">
        {navOption.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              to={item.link}
              key={item.link}
              onClick={() => setOpen(false)}
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
      <div className="mt-auto">
        <div className=" md-auto">
          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            className={`flex rounded-xl font-semibold items-center gap-3 text-gray-500 
             
              hover:text-green-300 hover:bg-emerald-100 p-2`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex rounded-xl font-semibold items-center gap-3 text-gray-500  hover:text-green-300 hover:bg-emerald-100 p-2"
          >
            <User size={20} />
            <span>Profile</span>
          </Link>
        </div>


        <div>
          <Link
            to="/logout"
            onClick={() => setOpen(false)}
            className="flex rounded-xl items-center gap-3 font-semibold text-gray-500  hover:text-red-300 hover:bg-red-100 p-2"
          >
            <LogOut size={20} />
            <span>log out</span>
          </Link>
        </div>


      </div>
    </aside>
    </>
  );
};

export default Sidebar;
