import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../components/Toast";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [toastInfo, setToastInfo] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setToastInfo({
        show: true,
        message: "Passwords do not match.",
        type: "error",
      });
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      let errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      // Add a more helpful message
      if (errorMessage.includes("User already exists")) {
        errorMessage =
          "An account with this email already exists. Please try logging in.";
      }
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
      {/* 
        The h-auto and my-8 classes are used here to better accommodate the 
        extra fields of the registration form, preventing overflow.
      */}
      <div className="flex w-full max-w-4xl h-[600px] shadow-2xl rounded-2xl overflow-hidden">
        <div className="hidden md:flex w-1/2 p-0">
          <div
            className="w-full h-full flex flex-col justify-center p-12 text-white border-[5px] border-white rounded-tl-2xl rounded-bl-2xl"
            style={{
              backgroundImage: "url('/my-background.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "scroll",
            }}
          >
            <img
              src="/register.jpg" // Replace with the actual path to your SVG in the public folder
              alt="Login Illustration"
              className="w-full h-auto object-contain p-10" // Adjust padding as needed
            />
          </div>
        </div>

        {/* Right Panel - Solid White Registration Form */}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-8 sm:p-16 rounded-r-2xl">
          <h2 className="text-4xl font-serif text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-500 mb-10">
            Join us to secure your files with end-to-end encryption.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 bg-white border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-800"
                placeholder="Enter your full name"
              />
            </div>
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
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-600"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 bg-white border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-800"
                placeholder="Confirm your password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-8 text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-gray-800 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
