// src/pages/MainPage.jsx

import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./MainPage.css";

const MainPage = () => {
  // The useEffect hook for the background animation can remain exactly the same.
  const particlesContainerRef = useRef(null);
  const backgroundRef = useRef(null);
  useEffect(() => {
    /* ... existing particle logic ... */
  }, []);

  return (
    <div className="main-page-container">
      {/* The animated background remains fixed in the back */}
      <div className="gradient-background" ref={backgroundRef}>
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
        <div className="glow"></div>
        <div className="grid-overlay"></div>
        <div className="noise-overlay"></div>
        <div className="particles-container" ref={particlesContainerRef}></div>
      </div>
      // In src/pages/MainPage.jsx
      <header className="main-header">
        <div className="logo">CloudStore</div>
        <nav>
          {/* Add these two new links */}
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>

          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/register" className="nav-button">
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="main-content">
        {/* --- Section 1: Hero --- */}
        <section className="hero-section">
          <h1 className="hero-title">Your Secure Digital Vault</h1>
          <p className="hero-subtitle">
            Experience the next generation of cloud storage. End-to-end
            encrypted, effortlessly simple, and always accessible.
          </p>
          <Link to="/register" className="btn">
            Create Your Free Account
          </Link>
        </section>

        {/* --- Section 2: Features --- */}
        <section className="features-section">
          {/* ... Your existing feature cards ... */}
        </section>

        {/* --- NEW Section 3: How It Works --- */}
        <section className="how-it-works-section">
          <h2 className="section-title">Simple Steps to Security</h2>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create Your Account</h3>
              <p>
                Sign up in seconds. All you need is an email and a master
                password.
              </p>
            </div>
            <div className="step-connector"></div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Upload & Encrypt</h3>
              <p>
                Drag and drop your files. They are encrypted instantly on your
                device before uploading.
              </p>
            </div>
            <div className="step-connector"></div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Access & Share</h3>
              <p>
                Your data is available on all your devices. Share files securely
                with an encrypted link.
              </p>
            </div>
          </div>
        </section>

        {/* --- NEW Section 4: Testimonials --- */}
        <section className="testimonial-section">
          <h2 className="section-title">Trusted by Users Worldwide</h2>
          <div className="testimonials-container">
            <div className="testimonial-card">
              <p className="quote">
                "CloudStore has completely changed how I think about online
                privacy. It's incredibly easy to use, and knowing my files are
                secure is a game-changer."
              </p>
              <div className="author">
                <h4>Piyush Kumar</h4>
                <span>Software Developer</span>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="quote">
                "As a photographer, secure storage is critical. CloudStore gives
                me the peace of mind I need to store and share my work with
                clients."
              </p>
              <div className="author">
                <h4>Tushar Bisht</h4>
                <span>Professional Photographer</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- NEW Section 5: Final Call to Action --- */}
        <section className="cta-section">
          <h2>Ready to Reclaim Your Digital Privacy?</h2>
          <p>
            Join thousands of users who trust CloudStore for secure, encrypted
            file storage.
          </p>
          <Link to="/register" className="btn cta-btn">
            Get Started for Free
          </Link>
        </section>
      </main>
      <footer className="main-footer">
        <p>
          &copy; {new Date().getFullYear()} CloudStore. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default MainPage;
