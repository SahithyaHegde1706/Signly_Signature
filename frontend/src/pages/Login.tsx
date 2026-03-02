import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "https://signly-signature.onrender.com/api/auth/login",
        { email, password }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      alert("Login successful ✅");

      navigate("/dashboard");

    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed ❌");
    }
  };

  // 🔥 GOOGLE LOGIN FUNCTION ADDED (Nothing removed)
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const { data } = await axios.post(
        "https://signly-signature.onrender.com/api/auth/google",
        {
          name: user.displayName,
          email: user.email,
        }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      alert("Google login failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 px-4">

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-12">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            S
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Welcome Back
        </h2>

        <p className="text-gray-600 text-center mt-2">
          Log in to continue to Signly
        </p>

        {/* FORM START */}
        <form onSubmit={handleLogin} className="mt-8 space-y-5">

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <div className="flex justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>

            <span className="text-blue-600 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition shadow-md"
          >
            Log In
          </button>

        </form>
        {/* FORM END */}

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* 🔥 Google Button Connected (UI unchanged) */}
        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 py-3 rounded-xl hover:bg-gray-100 transition font-medium"
        >
          Continue with Google
        </button>

        <p className="text-sm text-center text-gray-700 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;