// src/pages/ForgotPasswordPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/auth/forgot-password', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
                <p className="text-center text-gray-400">Enter your email address and we'll send you a reset token.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold">Send Reset Token</button>
                </form>
                {message && <p className="text-center text-green-400">{message}</p>}
                <p className="text-center text-sm">
                    <Link to="/login" className="font-medium text-blue-400 hover:underline">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
