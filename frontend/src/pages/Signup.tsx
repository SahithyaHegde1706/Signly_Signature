import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post("https://signly-signature.onrender.com/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Account created successfully ✅");

      navigate("/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Signup failed ❌");
    }
  };

  // 🔥 GOOGLE SIGNUP FUNCTION ADDED (Nothing removed)
  const handleGoogleSignup = async () => {
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
      alert("Google signup failed ❌");
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
          Create Account
        </h2>

        <p className="text-gray-600 text-center mt-2">
          Join Signly and start signing digitally
        </p>

        {/* FORM START */}
        <form onSubmit={handleSignup} className="mt-8 space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

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
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition shadow-md"
          >
            Sign Up
          </button>

        </form>
        {/* FORM END */}

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* 🔥 Google Button Connected */}
        <button
          onClick={handleGoogleSignup}
          className="w-full border border-gray-300 py-3 rounded-xl hover:bg-gray-100 transition font-medium"
        >
          Continue with Google
        </button>

        <p className="text-sm text-center text-gray-700 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Signup;