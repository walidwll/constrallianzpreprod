"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchApplications,
    updateApplicationStatus,
} from '@/lib/store/features/subContractorSlice';
import { fetchUser } from '@/lib/store/features/authSlice';
import {
    User,
    Mail,
    Phone,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    DollarSign,
    FileText,
    Filter,
    Search,
    Star,
    Cpu,
    ShieldCheck,
} from 'lucide-react';
import { PageLoader } from '@/components/LoadingComponent';

const ApplicationsList = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user?.user);
    const authLoading = useSelector((state) => state.auth.loading);
    const { applications, loading: applicationLoading, error } = useSelector(
        (state) => state.subContractor
    );

    const [filters, setFilters] = useState({
        status: '',
        searchTerm: '',
    });

    const [filteredApplications, setFilteredApplications] = useState([]);

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    useEffect(() => {
        if (user && user._id) {
            dispatch(fetchApplications({ subContractorId: user._id }));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (Array.isArray(applications)) {
            let filtered = applications;

            if (filters.status) {
                filtered = filtered.filter((app) => app.status === filters.status);
            }

            if (filters.searchTerm) {
                filtered = filtered.filter(
                    (app) =>
                        app.employeeId.name
                            .toLowerCase()
                            .includes(filters.searchTerm.toLowerCase()) ||
                        app.employeeId.email
                            .toLowerCase()
                            .includes(filters.searchTerm.toLowerCase())
                );
            }

            setFilteredApplications(filtered);
        } else {
            setFilteredApplications([]);
        }
    }, [applications, filters]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="text-green-500" />;
            case 'rejected':
                return <XCircle className="text-red-500" />;
            default:
                return <AlertCircle className="text-yellow-500" />;
        }
    };

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            await dispatch(
                updateApplicationStatus({
                    applicationId,
                    status: newStatus,

                })
            ).unwrap();

        } catch (error) {
            console.error('Error updating application status:', error);
        }
    };

    if (authLoading || applicationLoading) {
        return (
            <PageLoader />
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="container mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
                        <User className="mr-3 text-blue-600" /> Applications
                    </h2>

                    {/* Filters Section */}
                    <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                            <input
                                type="text"
                                placeholder="Search applications..."
                                value={filters.searchTerm}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        searchTerm: e.target.value,
                                    }))
                                }
                                className="pl-10 p-2 border-2 border-blue-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="block text-blue-700 mb-2">
                                <Filter className="inline-block mr-2 text-blue-500" />
                                Filter by Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, status: e.target.value }))
                                }
                                className="w-full p-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {/* Applications List */}
                    <div className="space-y-6">
                        {filteredApplications.map((application) => (
                            <div
                                key={application._id}
                                className="bg-white border-2 border-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
                                        <div className="flex flex-col items-center mb-4 md:mb-0">
                                            <img
                                                src={application.employeeId.image}
                                                alt={application.employeeId.name}
                                                className="w-32 h-32 rounded-full border-4 border-blue-200 object-cover mb-4"
                                            />
                                            <h2 className="text-xl font-bold text-blue-800">
                                                {application.employeeId.name}
                                            </h2>
                                            <p className="flex items-center">
                                                <FileText className="mr-2 text-purple-500" />
                                                <a
                                                    href={application.employeeId.cv}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-purple-500"
                                                >
                                                    View CV
                                                </a>
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                {getStatusIcon(application.status)}
                                                <span className="capitalize text-sm font-medium">
                                                    {application.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <p className="flex items-center">
                                                    <Mail className="mr-2 text-blue-500" />
                                                    {application.employeeId.email}
                                                </p>
                                                <p className="flex items-center">
                                                    <Phone className="mr-2 text-green-500" />
                                                    {application.employeeId.phone}
                                                </p>
                                                <p className="flex items-center">
                                                    <Clock className="mr-2 text-blue-500" />
                                                    Applied:{' '}
                                                    {new Date(application.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {application.status === 'pending' && (
                                            <div className="flex flex-col gap-2 mt-4 md:mt-0">

                                                <button
                                                    onClick={() => handleStatusUpdate(application._id, 'approved')}
                                                    className={`bg-green-500 text-white px-6 py-2 rounded-lg transition whitespace-nowrap hover:bg-green-600`}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition whitespace-nowrap"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredApplications.length === 0 && (
                            <div className="text-center py-8 bg-blue-50 rounded-lg">
                                <p className="text-blue-600 text-xl">
                                    No applications found.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsList;