// src/pages/AboutPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css'; // We reuse the same styles for consistency

const AboutPage = () => {
    return (
        <div className="main-page-container">
            {/* The animated background remains fixed in the back */}
            <div className="gradient-background">
                <div className="gradient-sphere sphere-1"></div>
                <div className="gradient-sphere sphere-2"></div>
                <div className="gradient-sphere sphere-3"></div>
                <div className="glow"></div>
                <div className="grid-overlay"></div>
                <div className="noise-overlay"></div>
            </div>

            <header className="main-header">
                <Link to="/" className="logo">CloudStore</Link>
                <nav>
                    <Link to="/about" className="nav-link active">About</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/register" className="nav-button">Sign Up</Link>
                </nav>
            </header>

            <main className="main-content">
                <section className="content-section">
                    <h1 className="section-title">Our Mission</h1>
                    <p className="content-text">
                        In a world where digital privacy is increasingly rare, CloudStore was born from a simple yet powerful idea: your data should be yours alone. We believe that security shouldn't come at the cost of simplicity. Our mission is to provide an effortlessly secure cloud storage platform where state-of-the-art, end-to-end encryption is the default, not an optional extra.
                    </p>
                    <p className="content-text">
                        We are dedicated to building a service where users have complete control and ownership of their digital lives, free from the prying eyes of corporations or bad actors.
                    </p>

                    <h2 className="section-subtitle">Our Technology</h2>
                    <p className="content-text">
                        Every file you upload to CloudStore is encrypted directly on your device using the robust AES-256 standard before it ever leaves your computer. This means that no one—not even our team—can access the contents of your files. Only you, with your unique master password, hold the key to decrypt your data. This is zero-knowledge architecture, and it's the foundation of our promise to you.
                    </p>
                </section>
            </main>

            <footer className="main-footer">
                <p>&copy; {new Date().getFullYear()} CloudStore. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default AboutPage;
