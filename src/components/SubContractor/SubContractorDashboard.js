"use client";
import React, { useEffect, useRef, useState } from 'react';
import { fetchSubCompanies, fetchApplications, fetchResources } from '@/lib/store/features/subContractorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Building2,
    Users,
    ChevronRight,
    Briefcase,
    Calendar,
    User,
    Mail,
    Phone,
    Menu,
    KeyRound,
    LogOut,
} from 'lucide-react';

const SubContractorDashboard = ({ user, logout }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { applications } = useSelector((state) => state?.subContractor);
    const { subCompanies, loading, error } = useSelector((state) => state?.subContractor);
    const [activeTab, setActiveTab] = useState('employees');
    const [currentPage, setCurrentPage] = useState(1);
    const { resources } = useSelector((state) => state.subContractor);
    useEffect(() => {
        dispatch(fetchSubCompanies({ id: user?._id }));
    }, [dispatch, user._id]);

    useEffect(() => {
        if (user && user._id) {
            dispatch(fetchApplications({ subContractorId: user._id }));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (user?._id) {
            dispatch(fetchResources({
                subContractorId: user._id,
                type: activeTab,
                page: currentPage,
                limit: 10
            }));
        }
    }, [dispatch, user?._id, activeTab, currentPage]);

    const navigateToViewProjects = () => {
        router.push('/user/projects');
    };
    const navigateToEmployeeApplications = () => {
        router.push('/employee/applications');
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const ResourceTable = ({ data, type }) => {
        if (!data?.length) return <p>No {type} found.</p>;

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Project</th>
                            <th className="px-4 py-3">Project ID</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Total Cost</th>
                            <th className="px-4 py-3">Start Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item._id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">{item.name}</td>
                                <td className="px-4 py-3">{item.projectName}</td>
                                <td className="px-4 py-3">{item.projectId || 'N/A'}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {item.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    ${item.totalCost ? item.totalCost.toFixed(2) : '0.00'}
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="container mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    {/* Header section with dropdown */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-blue-800">Dashboard</h1>
                    </div>

                    {/* Profile Section */}
                    <div className="mb-8 bg-blue-50 rounded-xl p-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                            <div className="relative">
                                <img
                                    src={user.image || `https://ui-avatars.com/api/?name=${user.first_name+'+'+user.last_name}&background=random`}
                                    alt={user.first_name}
                                    className="w-32 h-32 rounded-full border-4 border-blue-200 object-cover"
                                />
                                <div className="absolute bottom-2 -right-0 bg-green-500 p-2 rounded-full">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div className="flex-grow text-center md:text-left">
                                <h1 className="text-3xl font-bold text-blue-800 mb-2">Welcome, {user.first_name}</h1>
                                <p className="text-blue-600 mb-2">{user.role}</p>
                                <div className="flex flex-col md:flex-row gap-4 mt-3">
                                    <p className="flex items-center justify-center md:justify-start text-gray-600">
                                        <Mail className="w-4 h-4 mr-2 text-blue-500" />
                                        {user.email}
                                    </p>
                                    <p className="flex items-center justify-center md:justify-start text-gray-600">
                                        <Phone className="w-4 h-4 mr-2 text-blue-500" />
                                        {user.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resources Section */}
                    <div className="mt-8 bg-white rounded-2xl shadow-2xl p-6 mb-8">
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setActiveTab('employees')}
                                className={`px-4 py-2 rounded-lg ${activeTab === 'employees'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200'
                                    }`}
                            >
                                Employees
                            </button>
                            <button
                                onClick={() => setActiveTab('machinery')}
                                className={`px-4 py-2 rounded-lg ${activeTab === 'machinery'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200'
                                    }`}
                            >
                                Machinery
                            </button>
                        </div>

                        {resources.loading ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : resources.error ? (
                            <div className="text-red-600 text-center py-4">{resources.error}</div>
                        ) : (
                            <>
                                <ResourceTable
                                    data={activeTab === 'employees' ? resources.employees : resources.machinery}
                                    type={activeTab}
                                />

                                {/* Pagination */}
                                <div className="mt-4 flex justify-center gap-2">
                                    {Array.from({ length: resources.pagination.totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`px-3 py-1 rounded ${currentPage === i + 1
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <button
                            onClick={navigateToViewProjects}
                            className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="flex items-center">
                                <Users className="w-8 h-8 mr-4" />
                                <div className="text-left">
                                    <h3 className="text-xl font-semibold">Manage Projects</h3>
                                    <p className="text-blue-100">View project details</p>
                                </div>
                            </div>
                            <ChevronRight className="w-6 h-6" />
                        </button>
                        <button
                            onClick={navigateToEmployeeApplications}
                            className="flex items-center justify-between p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="flex items-center">
                                <Building2 className="w-8 h-8 mr-4" />
                                <div className="text-left">
                                    <h3 className="text-xl font-semibold">Employee Requests</h3>
                                    <p className="text-green-100">{applications?.length || 0} Requests</p>
                                </div>
                            </div>
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Companies Section */}
                    <div className="p-4">
                        <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center flex-wrap">
                            <Building2 className="mr-3 text-blue-600" /> Your Companies
                        </h2>

                        {loading && (
                            <div className="text-center text-blue-600 py-4">
                                Loading companies...
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
                                <strong className="font-bold">Error:</strong>
                                <span className="block sm:inline"> {error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            {subCompanies && subCompanies.map((subCompany, index) => (
                                <div
                                    key={index}
                                    className="bg-white border-2 border-blue-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                                        <div className="w-full">
                                            <h3 className="text-xl font-semibold text-blue-800 mb-2 truncate">{subCompany.name}</h3>
                                            <div className="flex flex-wrap gap-4">
                                                <p className="text-gray-600 flex items-center truncate">
                                                    <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                                                    <span className="truncate">ID: {subCompany._id}</span>
                                                </p>
                                                <p className="text-gray-600 flex items-center truncate">
                                                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                                    <span className="truncate">Created: {new Date(subCompany.createdAt).toLocaleDateString()}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={() => router.push(`/company`)} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 w-full md:w-auto">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {!loading && subCompanies && subCompanies.length === 0 && (
                                <div className="text-center py-8 bg-blue-50 rounded-xl">
                                    <Building2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                                    <p className="text-blue-600 text-xl">No companies found</p>
                                    <p className="text-blue-400">Add your first company to get started</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SubContractorDashboard;