import { Link } from "react-router-dom";
import { Leaf, Package } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* Main footer */}
          <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500">
                  <Package className="h-6 w-6 text-white" />
                </div>

                <span className="text-xl font-extrabold tracking-tight text-[#10233f]">
                  Smart<span className="text-emerald-500">Stock</span>
                </span>
              </Link>

              <p className="mt-5 max-w-sm leading-7 text-gray-600">
                Smart inventory management for a more organized home. Track your
                products, monitor expiry dates, and reduce waste.
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                <Leaf size={16} className="text-emerald-500" />
                Manage smarter. Waste less.
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-bold text-[#10233f]">Product</h3>

              <div className="mt-5 flex flex-col gap-3 text-sm text-gray-600">
                <Link
                  to="/dashboard"
                  className="transition hover:text-emerald-500"
                >
                  Dashboard
                </Link>

                <Link
                  to="/inventory"
                  className="transition hover:text-emerald-500"
                >
                  Inventory
                </Link>

                <Link
                  to="/analytics"
                  className="transition hover:text-emerald-500"
                >
                  Analytics
                </Link>

                <a
                  href="#features"
                  className="transition hover:text-emerald-500"
                >
                  Features
                </a>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold text-[#10233f]">Company</h3>

              <div className="mt-5 flex flex-col gap-3 text-sm text-gray-600">
                <a href="#about" className="transition hover:text-emerald-500">
                  About SmartStock
                </a>

                <a
                  href="#how-it-works"
                  className="transition hover:text-emerald-500"
                >
                  How it works
                </a>

                <Link to="/login" className="transition hover:text-emerald-500">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="transition hover:text-emerald-500"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom footer */}
          <div className="flex flex-col gap-4 border-t border-gray-100 py-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {currentYear} SmartStock. All rights reserved.</p>

            <div className="flex gap-6">
              <a href="#" className="transition hover:text-emerald-500">
                Privacy Policy
              </a>

              <a href="#" className="transition hover:text-emerald-500">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
