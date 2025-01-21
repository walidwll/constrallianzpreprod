"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star } from 'lucide-react';
import {
    fetchEmployees,
    fetchEmployeeProjects
} from '@/lib/store/features/employeeSlice';

const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    size={16}
                    className={`${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                />
            ))}
            <span className="ml-2 text-sm">({rating})</span>
        </div>
    );
};

const calculateProjectEarnings = (projectDetails, workedHoursDetails) => {
    return projectDetails.map(project => {
        const workedHours = workedHoursDetails
            .filter(detail => detail.projectId === project.projectId)
            .reduce((total, detail) => total + detail.workedHours, 0);
        const earnings = workedHours * project.hourlyRate;
        return {
            projectId: project.projectId,
            hourlyRate: project.hourlyRate,
            workedHours: workedHours,
            earnings: earnings
        };
    });
};

const EmployeeDashboard = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth?.user?.user);
    const projects = useSelector((state) => state.employee.projects);
    const router = useRouter();

    useEffect(() => {
        if (user?.subCompanyId) {
            dispatch(fetchEmployees({ companyId: user.subCompanyId }));
        }
        if (user?._id) {
            dispatch(fetchEmployeeProjects(user._id));
        }
    }, [dispatch, user]);

    const calculateEarnings = (hourlyRate, workedHours) => {
        return (hourlyRate * workedHours);
    };

    const projectEarnings = calculateProjectEarnings(user?.projectDetails || [], user?.workedHoursDetails || []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="container mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl p-8 relative">
                    {/* Back to Dashboard Button */}
                    <button
                        onClick={() => router.push('/user/dashboard')}
                        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </button>

                    {/* Working Information */}
                    <div className="mb-8 bg-blue-100 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-blue-800 mb-4">Working Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {projectEarnings.map((project) => (
                                <div key={project.projectId} className="bg-white p-4 rounded-xl shadow-lg">
                                    <p className="text-gray-500 text-sm font-medium mb-1">Project ID</p>
                                    <p className="text-blue-800 text-sm font-bold mb-1">{project.projectId}</p>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Earnings</p>
                                    <p className="text-blue-800 text-xl font-bold">${project.earnings}</p>
                                </div>
                            ))}
                            <div className="bg-white p-4 rounded-xl shadow-lg md:col-span-2 lg:col-span-3">
                                <p className="text-gray-500 text-sm font-medium mb-2">Rating</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-blue-800 text-sm font-semibold mb-1">Quality</p>
                                        <StarRating rating={user?.rating?.quality || 0} />
                                    </div>
                                    <div>
                                        <p className="text-blue-800 text-sm font-semibold mb-1">Technical</p>
                                        <StarRating rating={user?.rating?.technical || 0} />
                                    </div>
                                    <div>
                                        <p className="text-blue-800 text-sm font-semibold mb-1">Punctuality</p>
                                        <StarRating rating={user?.rating?.punctuality || 0} />
                                    </div>
                                    <div>
                                        <p className="text-blue-800 text-sm font-semibold mb-1">Safety</p>
                                        <StarRating rating={user?.rating?.safety || 0} />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-lg md:col-span-2 lg:col-span-3">
                                <p className="text-gray-500 text-sm font-medium mb-2">Review</p>
                                {user?.rating?.review && <p className="text-gray-700 text-sm">{user?.rating?.review}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Projects Section */}
                    <div className="bg-blue-100 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-blue-800 mb-4">Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {projects.map((project) => (
                                <div key={project._id} className="bg-white p-4 rounded-xl shadow-lg">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-3">{project.name}</h3>
                                    <p className="text-gray-700 text-sm mb-2">
                                        <strong>Description:</strong> {project.description}
                                    </p>
                                    <p className="text-gray-700 text-sm mb-2">
                                        <strong>Budget:</strong> ${project.budget}
                                    </p>
                                    <p className="text-gray-700 text-sm mb-2">
                                        <strong>Status:</strong>{' '}
                                        {project.isCompleted ? (
                                            <span className="text-green-600">Completed</span>
                                        ) : (
                                            <span className="text-yellow-600">In Progress</span>
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;