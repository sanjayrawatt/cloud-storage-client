// src/pages/ResetPasswordPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
    const { token } = useParams(); // Gets the token from the URL
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        try {
            const response = await axios.patch(`http://localhost:3001/api/auth/reset-password/${token}`, { password });
            setMessage(response.data.message || 'Password has been reset successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center">Reset Your Password</h2>
                <p className="text-center text-gray-400">Enter your new password below.</p>
                
                {/* THIS IS THE FORM THAT WAS MISSING */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password-input" className="block text-sm font-medium">New Password</label>
                        <input 
                            id="password-input" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password-input" className="block text-sm font-medium">Confirm New Password</label>
                        <input 
                            id="confirm-password-input" 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold">
                        Reset Your Password
                    </button>
                </form>

                {message && <p className="text-center text-green-400 mt-4">{message}</p>}
                {error && <p className="text-center text-red-400 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
