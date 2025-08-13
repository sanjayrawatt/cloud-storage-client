import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../components/Toast.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [toastInfo, setToastInfo] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        { email, password }
      );
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setToastInfo({ show: true, message: errorMessage, type: "error" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toast
        show={toastInfo.show}
        message={toastInfo.message}
        type={toastInfo.type}
        onDismiss={() => setToastInfo({ ...toastInfo, show: false })}
      />
      <div className="flex w-full max-w-7xl h-[850px] shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Panel - The key changes are here */}
        <div className="hidden md:flex w-1/2 p-0">
          <div
            className="w-full h-full flex flex-col justify-center p-12 text-white border-[5px] border-white rounded-tl-2xl rounded-bl-2xl"
            style={{
              backgroundImage: "url('/my-background.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              // This makes the inner image scroll normally, creating the layered effect
              backgroundAttachment: "scroll",
            }}
          >
            <img
              src="/logo.svg" // Replace with the actual path to your SVG in the public folder
              alt="Login Illustration"
              className="w-full h-auto object-contain p-10" // Adjust padding as needed
            />
          </div>
        </div>

        {/* Right Panel - Solid White Login Form */}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-8 sm:p-16 rounded-r-2xl">
          <h2 className="text-4xl font-serif text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 mb-10">
            Enter your email and password to access your account
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 bg-white border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-800"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 bg-white border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-800"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-gray-800 hover:text-gray-600"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all"
            >
              Sign In
            </button>
          </form>
          <p className="mt-8 text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-gray-800 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
