import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}

        {/* This is the main landing page for your entire application. */}
        <Route path="/" element={<MainPage />} />
        
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Login and Register pages are also public */}
        <Route path="/login" element={<LoginPage />} /> {/* Correctly closed tag */}
        <Route path="/register" element={<RegisterPage />} /> {/* Correctly closed tag */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* The conflicting redirect to "/login" has been REMOVED. */}
        
        {/* --- Protected Routes --- */}
        {/* Any route nested inside here will require the user to be authenticated. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* You can add more protected routes here in the future, e.g., /settings, /profile */}
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
