// src/pages/ContactPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MainPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState({ loading: false, success: null, error: null });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: null, error: null });

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, { formData });
            setStatus({ loading: false, success: 'Thank you! Your message has been sent.', error: null });
            // Clear the form on success
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An unknown error occurred.';
            setStatus({ loading: false, success: null, error: errorMessage });
        }
    };

    return (
        <div className="main-page-container">
            <div className="gradient-background">{/* ... background spheres ... */}</div>

            <header className="main-header">
                <Link to="/" className="logo">CloudStore</Link>
                <nav>
                    <Link to="/about" className="nav-link">About</Link>
                    <Link to="/contact" className="nav-link active">Contact</Link>
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/register" className="nav-button">Sign Up</Link>
                </nav>
            </header>

            <main className="main-content">
                <section className="content-section">
                    <h1 className="section-title">Get In Touch</h1>
                    <p className="content-text text-center">
                        Have a question, feedback, or need support? We'd love to hear from you.
                    </p>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Your Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Your Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Your Message</label>
                            <textarea id="message" name="message" rows="6" value={formData.message} onChange={handleChange} required></textarea>
                        </div>
                        <button type="submit" className="btn form-btn" disabled={status.loading}>
                            {status.loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                    {status.success && <p className="text-center text-green-400 mt-4">{status.success}</p>}
                    {status.error && <p className="text-center text-red-400 mt-4">{status.error}</p>}
                </section>
            </main>

            <footer className="main-footer">
                <p>&copy; {new Date().getFullYear()} CloudStore. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default ContactPage;
