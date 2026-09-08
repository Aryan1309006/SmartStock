import React from "react";
import google from "../../assets/images/Google.png";
const Login = () => {
  const [tab, setTab] = React.useState("login");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (tab === "login") {
      console.log("Login");
      // send login data to backend
    } else {
      console.log("Signup");
      // send signup data to backend
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-md min-h-[520px] p-6
           flex flex-col items-center justify-center gap-7
           bg-white border-2 border-emerald-700
           rounded-4xl font-semibold"
      >
        {/* Tabs */}
        <div className="w-40 border border-gray-400 rounded-full flex">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`w-1/2 rounded-l-full p-2 transition ${
              tab === "login"
                ? "bg-emerald-500 text-white"
                : ""
            }`}
          >
            Log in
          </button>

          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`w-1/2 rounded-r-full p-2 transition ${
              tab === "signup"
                ? "bg-emerald-500 text-white"
                : ""
            }`}
          >
            Sign up
          </button>
        </div>

        {/* Form */}
        {tab === "login" ? (
          <div className="flex flex-col gap-7 items-center">
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
              className="w-full max-w-[280px] h-10 border border-gray-300
             rounded-lg px-3 outline-none
             focus:border-emerald-500"
            />

            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              required
              className="w-full max-w-[280px] h-10 border border-gray-300
             rounded-lg px-3 outline-none
             focus:border-emerald-500"
            />

            <button
              type="submit"
               className="h-10 w-70 rounded-lg p-2 bg-emerald-400 text-white"
            >
              Log In
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-7 items-center">
            <input
              type="text"
              placeholder="Name"
              autoComplete="name"
              required
              className="w-full max-w-[280px] h-10 border border-gray-300
             rounded-lg px-3 outline-none
             focus:border-emerald-500"
            />

            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
              className="w-full max-w-[280px] h-10 border border-gray-300
             rounded-lg px-3 outline-none
             focus:border-emerald-500"
            />

            <input
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              required
              className="w-full max-w-[280px] h-10 border border-gray-300
             rounded-lg px-3 outline-none
             focus:border-emerald-500"
            />

            <button
              type="submit"
              className="h-10 w-70 rounded-lg p-2 bg-emerald-400 text-white"
            >
              Sign Up
            </button>
          </div>
        )}

        <p>or</p>

        <button
          type="button"
          className="flex items-center justify-center w-70 h-10 border  rounded-lg border-emerald-500"
        >
          <img src={google} alt="Google" className="w-5 h-5 mr-2" />
          Log in with Google
        </button>
      </form>
    </div>
  );
};

export default Login;