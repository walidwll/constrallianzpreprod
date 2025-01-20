"use client";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '@/lib/store/features/authSlice';
import { updateEmployee } from '@/lib/store/features/employeeSlice';
import { updateSubContractor } from '@/lib/store/features/subContractorSlice';
import { FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user?.user);
    const loading = useSelector((state) => state.auth.loading);
    const router = useRouter();

    const [formData, setFormData] = useState({
        first_name:'',
        last_name: '',
        email: '',
        phone_number: '',
        role: user?.role,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUser());
        } else {
            setFormData({
                first_name:user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone_number,
                role: user.role,
            });
        }
    }, [dispatch, user]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true);
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                formDataToSend.append(key, formData[key]);
            });
            let resultAction;
            if (user.role === 'Employee') {
                resultAction = await dispatch(updateEmployee(formDataToSend));
            } else if (user.role === 'SubManager' || user.role === 'SubAdministrator') {
                resultAction = await dispatch(updateSubContractor(formDataToSend));
            }
            if (resultAction && (updateEmployee.fulfilled.match(resultAction) || updateSubContractor.fulfilled.match(resultAction))) {
                setIsEditing(false);
            } else {
                throw new Error(resultAction.payload || 'Update failed');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            dispatch(fetchUser());
            setLoadingUpdate(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
                <div
                    className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-t-blue-500 border-transparent"
                    role="status"
                >
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    } else if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
                <img
                    className="w-64 h-64 mb-6"
                    src="https://res.cloudinary.com/daqsjyrgg/image/upload/v1690257804/jjqw2hfv0t6karxdeq1s.svg"
                    alt="No user data"
                />
                <div className="text-xl text-gray-700">No user data available</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-2xl">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/user/dashboard')}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
                >
                    <FiArrowLeft className="mr-2 w-5 h-5" />
                    Back to Dashboard
                </button>

                {/* Title */}
                <h1 className="text-3xl font-bold text-blue-800 mb-6">Profile</h1>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm mb-6">
                        {error}
                    </div>
                )}

                {/* Profile Information */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6 mb-8">
                    <div className="relative">
                        <img
                            src={user?.image || 'https://via.placeholder.com/150'}
                            alt={user.name}
                            className="w-32 h-32 rounded-full border-4 border-blue-200 object-cover"
                        />
                        {/* Status Indicator */}
                        <div className="absolute bottom-4 right-2 bg-green-500 p-2 rounded-full">

                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-semibold text-blue-800">{user.first_name + ' ' +user.last_name}</h2>
                        <p className="text-blue-600 mb-1">{user.role}</p>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-gray-600">{user.phone_number}</p>
                    </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            disabled={!isEditing}
                            className={`appearance-none rounded-md relative block w-full px-4 py-3 border ${isEditing ? 'border-blue-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            value={formData.first_name + ' ' + formData.last_name || ""}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            disabled={!isEditing}
                            className={`appearance-none rounded-md relative block w-full px-4 py-3 border ${isEditing ? 'border-blue-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            value={formData.email || ""}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label htmlFor="phone" className="block text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            required
                            disabled={!isEditing}
                            className={`appearance-none rounded-md relative block w-full px-4 py-3 border ${isEditing ? 'border-blue-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            value={formData.phone_number || ""}
                            onChange={handleChange}
                        />
                    </div>


                    {
                        (user.role === 'Sub-Contractor' || user.role === 'Employee') &&
                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                type="button"
                                onClick={handleEditToggle}
                                className={`py-3 px-6 rounded-md text-white ${isEditing ? 'bg-gray-400 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
                                    } transition-colors duration-300`}
                            >
                                {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                            {isEditing && (
                                <button
                                    type="submit"
                                    disabled={loadingUpdate}
                                    className={`py-3 px-6 rounded-md text-white ${loadingUpdate ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                        } transition-colors duration-300`}
                                >
                                    {loadingUpdate ? 'Updating...' : 'Update'}
                                </button>
                            )}
                        </div>
                    }
                </form>
            </div>
        </div>
    );
}

export default Profile;