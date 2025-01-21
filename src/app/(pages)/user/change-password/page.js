"use client";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '@/lib/store/features/authSlice';
import { Eye, EyeOff, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ChangePassword = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error } = useSelector((state) => state.auth);
    const [showPrevPassword, setShowPrevPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [formData, setFormData] = useState({
        previousPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = () => {
        const errors = {};
        if (!formData.previousPassword) {
            errors.previousPassword = 'Previous password is required';
        }
        if (!formData.newPassword) {
            errors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 6) {
            errors.newPassword = 'Password must be at least 6 characters';
        } else if (formData.newPassword === formData.previousPassword) {
            errors.newPassword = 'New password must be different from previous password';
        }
        if (formData.newPassword !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const result = await dispatch(changePassword({
                previousPassword: formData.previousPassword,
                newPassword: formData.newPassword
            })).unwrap();

            setSuccessMessage('Password changed successfully!');
            setFormData({
                previousPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setFormErrors({});
        } catch (err) {
            setFormErrors({ submit: err.message });
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (formErrors[e.target.name]) {
            setFormErrors({
                ...formErrors,
                [e.target.name]: ''
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full">
                    <button
                        onClick={() => router.push('/user/dashboard')}
                        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </button>
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-blue-800">Change Password</h2>
                        <p className="text-gray-600 mt-2 text-sm sm:text-base">Please enter your current and new password</p>
                    </div>

                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
                            <span className="mr-2">✓</span>
                            {successMessage}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
                            <AlertCircle className="mr-2" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* Previous Password Field */}
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Previous Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPrevPassword ? "text" : "password"}
                                    name="previousPassword"
                                    value={formData.previousPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.previousPassword ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPrevPassword(!showPrevPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showPrevPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formErrors.previousPassword && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.previousPassword}</p>
                            )}
                        </div>

                        {/* New Password Field */}
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formErrors.newPassword && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.newPassword}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
                            {formErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;