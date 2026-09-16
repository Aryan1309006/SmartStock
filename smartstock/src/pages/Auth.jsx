import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import google from "../assets/images/Google.png";
import bgImg from "../assets/images/loginBackground.webp";
import { useAuth } from "../context/authContext";

const Login = () => {
  const location = useLocation();
  const [tab, setTab] = React.useState(
    location.pathname === "/register" ? "signup" : "login",
  );
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    setTab(location.pathname === "/register" ? "signup" : "login");
  }, [location.pathname]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (tab === "login") {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await register(formData);
      }

      navigate("/dashboard");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Authentication failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="
    relative flex h-screen w-full
    items-center justify-center
    overflow-hidden
    bg-cover bg-center bg-no-repeat
    px-4 py-6
    sm:px-6
    md:px-8
      "
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-white/30" />

      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
        className="
          relative z-10
          flex w-full max-w-sm
          flex-col items-center
          gap-6
          rounded-3xl
          border border-emerald-200
          bg-white/95
          px-5 py-7
          shadow-2xl
          backdrop-blur-sm

          sm:max-w-md
          sm:px-8 sm:py-9
        "
      >
        {/* Logo / Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Smart<span className="text-emerald-500">Stock</span>
          </h1>

          <p className="mt-1 text-sm font-normal text-gray-500">
            Manage smarter. Waste less.
          </p>
        </div>

        {/* Tabs */}
        <div
          className="
            flex w-full max-w-xs
            overflow-hidden
            rounded-full
            border border-gray-300
            bg-gray-50
          "
        >
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`
              w-1/2 rounded-full
              px-4 py-2
              text-sm font-semibold
              transition-all duration-200
              sm:text-base
              ${
                tab === "login"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            Log in
          </button>

          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`
              w-1/2 rounded-full
              px-4 py-2
              text-sm font-semibold
              transition-all duration-200
              sm:text-base
              ${
                tab === "signup"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            Sign up
          </button>
        </div>

        {/* Forms */}
        {tab === "login" ? (
          <div className="flex w-full flex-col items-center gap-5">
            {/* Email */}
            <input
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="
                h-11 w-full max-w-xs
                rounded-lg
                border border-gray-300
                bg-white
                px-3
                text-sm
                font-normal
                text-gray-800
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-100
                sm:text-base
              "
            />

            {/* Password */}
            <input
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="
                h-11 w-full max-w-xs
                rounded-lg
                border border-gray-300
                bg-white
                px-3
                text-sm
                font-normal
                text-gray-800
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-100
                sm:text-base
              "
            />

            {/* Login Button */}
            <button
              type="submit"
              disabled={submitting}
              className="
                h-11 w-full max-w-xs
                rounded-lg
                bg-emerald-500
                px-4
                text-sm font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-emerald-600
                active:scale-[0.98]
                sm:text-base
              "
            >
              {submitting ? "Logging in..." : "Log In"}
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-5">
            {/* Name */}
            <input
              name="name"
              type="text"
              placeholder="Name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="
                h-11 w-full max-w-xs
                rounded-lg
                border border-gray-300
                bg-white
                px-3
                text-sm
                font-normal
                text-gray-800
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-100
                sm:text-base
              "
            />

            {/* Email */}
            <input
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="
                h-11 w-full max-w-xs
                rounded-lg
                border border-gray-300
                bg-white
                px-3
                text-sm
                font-normal
                text-gray-800
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-100
                sm:text-base
              "
            />

            {/* Password */}
            <input
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="
                h-11 w-full max-w-xs
                rounded-lg
                border border-gray-300
                bg-white
                px-3
                text-sm
                font-normal
                text-gray-800
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-100
                sm:text-base
              "
            />

            {/* Signup Button */}
            <button
              type="submit"
              disabled={submitting}
              className="
                h-11 w-full max-w-xs
                rounded-lg
                bg-emerald-500
                px-4
                text-sm font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-emerald-600
                active:scale-[0.98]
                sm:text-base
              "
            >
              {submitting ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        )}

        {error && (
          <p className="w-full max-w-xs text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Divider */}
        <div className="flex w-full max-w-xs items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-sm font-normal text-gray-400">or</span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          className="
            flex h-11 w-full max-w-xs
            items-center justify-center
            rounded-lg
            border border-gray-300
            bg-white
            px-4
            text-sm font-semibold
            text-gray-700
            transition
            hover:bg-gray-50
            active:scale-[0.98]
            sm:text-base
          "
        >
          <img src={google} alt="Google" className="mr-2 h-5 w-5" />

          <span>Continue with Google</span>
        </button>

        {/* Bottom Text */}
        <p className="text-center text-xs font-normal text-gray-500 sm:text-sm">
          {tab === "login"
            ? "Don't have an account? "
            : "Already have an account? "}

          <button
            type="button"
            onClick={() => setTab(tab === "login" ? "signup" : "login")}
            className="font-semibold text-emerald-500 hover:text-emerald-600"
          >
            {tab === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
