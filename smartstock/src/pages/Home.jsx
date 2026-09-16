import React from "react";
import {
  ArrowRight,
  Package,
  Clock3,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Leaf,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Footer from "../components/Footer";

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    {
      icon: Package,
      title: "Smart Inventory",
      description:
        "Keep all your household products organized in one simple inventory.",
    },
    {
      icon: Clock3,
      title: "Expiry Tracking",
      description:
        "Know exactly which products are fresh, expiring soon, or already expired.",
    },
    {
      icon: BarChart3,
      title: "Useful Insights",
      description:
        "Understand your inventory value, consumption and category distribution.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Add your items",
      description:
        "Add the product name, category, quantity, price and expiry date.",
    },
    {
      number: "02",
      title: "Track expiry",
      description:
        "SmartStock automatically calculates how many days remain.",
    },
    {
      number: "03",
      title: "Reduce waste",
      description:
        "Use products before they expire and keep better control of your spending.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafb] text-[#10233f]">
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 shadow-sm">
              <Package className="h-6 w-6 text-white" />
            </div>

            <span className="text-xl font-extrabold tracking-tight">
              Smart<span className="text-emerald-500">Stock</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 transition hover:text-emerald-500"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 transition hover:text-emerald-500"
            >
              How it works
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-gray-600 transition hover:text-emerald-500"
            >
              About
            </a>
          </div>

          {/* Desktop buttons */}
          <div className="hidden items-center gap-3 md:flex">
            

            <Link
              to="/login"
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
            >
             Login
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 md:hidden"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-gray-100 bg-white px-5 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#about">About</a>

              <div className="flex gap-3 pt-2">
                <Link
                  to="/login"
                  className="flex-1 rounded-xl border border-gray-200 py-3 text-center font-semibold"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="flex-1 rounded-xl bg-emerald-500 py-3 text-center font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ================= HERO ================= */}
      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-28">
          
          {/* Hero text */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
              <Leaf size={16} />
              Manage smarter. Waste less.
            </div>

            <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Your inventory,
              <span className="text-emerald-500"> smarter.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Keep track of everything you have at home, monitor expiry dates,
              and reduce unnecessary waste with SmartStock.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-600"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <a
                href="#features"
                className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-7 py-3.5 font-semibold text-[#10233f] transition hover:bg-gray-50"
              >
                Explore Features
              </a>
            </div>

            {/* Small benefits */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={17} />
                Easy inventory management
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={17} />
                Expiry tracking
              </div>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="relative">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-100 blur-3xl" />

           
          </div>
          
        </div>
      </section>

   
      {/* <section
        id="features"
        className="bg-white py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-emerald-500">
              SMART INVENTORY
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything you need to manage your inventory
            </h2>

            <p className="mt-4 text-gray-600">
              SmartStock gives you a simple way to organize products,
              monitor expiry dates and understand your inventory.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-gray-100 bg-[#f8fafb] p-7 transition hover:-translate-y-1 hover:border-emerald-100 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                    <Icon
                      size={24}
                      className="text-emerald-500"
                    />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="bg-[#f8fafb] py-10 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="text-center">
            <p className="font-semibold text-emerald-500">
              HOW IT WORKS
            </p>

            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Simple from start to finish
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <span className="text-6xl font-black text-emerald-100">
                  {step.number}
                </span>

                <h3 className="mt-2 text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT / VALUE ================= */}
      <section id="about" className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
          
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <ShieldCheck className="text-emerald-500" />
            </div>

            <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">
              Take control of what you have at home.
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              From food and medicines to toiletries and cleaning supplies,
              SmartStock helps you maintain a centralized digital inventory
              and identify products that need attention.
            </p>

            <Link
              to="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-semibold text-white transition hover:bg-emerald-600"
            >
              Start using SmartStock
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-emerald-50 p-6">
              <p className="text-4xl font-extrabold text-emerald-500">
                01
              </p>

              <p className="mt-3 font-semibold">
                Centralized Inventory
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-6">
              <p className="text-4xl font-extrabold text-blue-500">
                02
              </p>

              <p className="mt-3 font-semibold">
                Expiry Awareness
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 p-6">
              <p className="text-4xl font-extrabold text-purple-500">
                03
              </p>

              <p className="mt-3 font-semibold">
                Inventory Insights
              </p>
            </div>

            <div className="rounded-2xl bg-orange-50 p-6">
              <p className="text-4xl font-extrabold text-orange-500">
                04
              </p>

              <p className="mt-3 font-semibold">
                Less Waste
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#10233f] px-6 py-14 text-center sm:px-10">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Stop forgetting what you have.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-300">
            Start organizing your inventory and stay ahead of expiry dates
            with SmartStock.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 font-semibold text-white transition hover:bg-emerald-600"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer/>
    </div>
  );
};

export default Home;