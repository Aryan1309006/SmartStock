import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold tracking-tight text-emerald-600">
            SmartStock
          </span>
          <span>© {currentYear}. All rights reserved.</span>
        </div>

        <nav className="flex items-center gap-4">
          <Link to="/dashboard" className="transition hover:text-emerald-600">
            Dashboard
          </Link>
          <Link to="/inventory" className="transition hover:text-emerald-600">
            Inventory
          </Link>
          <Link to="/analytics" className="transition hover:text-emerald-600">
            Analytics
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
