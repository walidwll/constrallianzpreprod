"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchEmployeeRequests,
    updateEmployeeRequestStatus,
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
} from 'lucide-react';
import { PageLoader } from '@/components/LoadingComponent';

const EmployeeRequestsPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user?.user);
    const authLoading = useSelector((state) => state.auth.loading);
    const { employeeRequests, loading: requestsLoading, error } = useSelector(
        (state) => state.subContractor
    );

    const [filters, setFilters] = useState({
        status: '',
        searchTerm: '',
    });

    const [filteredRequests, setFilteredRequests] = useState([]);
    const [hourlyRate, setHourlyRate] = useState('');

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    useEffect(() => {
        if (user && user._id) {
            dispatch(fetchEmployeeRequests({ subContractorId: user._id }));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (Array.isArray(employeeRequests)) {
            let filtered = employeeRequests;

            if (filters.status) {
                filtered = filtered.filter((req) => req.status === filters.status);
            }

            if (filters.searchTerm) {
                filtered = filtered.filter(
                    (req) =>
                        req.EmployeeId.name
                            .toLowerCase()
                            .includes(filters.searchTerm.toLowerCase()) ||
                        req.ProjectId.name
                            .toLowerCase()
                            .includes(filters.searchTerm.toLowerCase())
                );
            }

            setFilteredRequests(filtered);
        } else {
            setFilteredRequests([]);
        }
    }, [employeeRequests, filters]);

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

    const handleStatusUpdate = async (requestId, newStatus, projectId) => {
        try {
            const response = await dispatch(
                updateEmployeeRequestStatus({
                    requestId,
                    status: newStatus,
                    subContractorId: user._id,
                    projectId: projectId,
                    hourlyRate: hourlyRate
                })
            ).unwrap();
            if (response) {
                dispatch(fetchEmployeeRequests({ subContractorId: user._id }));
            }

        } catch (error) {
            console.error('Error updating request status:', error);
        }
    };

    if (authLoading || requestsLoading) {
        return (
            <PageLoader />
        );
    }

    if (error) {
        return (
            <div className="min-h-screen p-4">
                <div className="text-red-700">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4">
            <div className="container mx-auto">
                <div className="p-6">
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                        <User className="mr-3" /> Employee Requests
                    </h2>

                    {/* Filters Section */}
                    <div className="mb-6">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search requests..."
                                value={filters.searchTerm}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        searchTerm: e.target.value,
                                    }))
                                }
                                className="pl-10 p-2 border rounded-lg w-full focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block mb-2">
                                <Filter className="inline-block mr-2" />
                                Filter by Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, status: e.target.value }))
                                }
                                className="w-full p-2 border rounded-lg focus:outline-none"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {/* Requests List */}
                    <div className="space-y-6">
                        {filteredRequests.map((request) => (
                            <div
                                key={request._id}
                                className="border rounded-lg p-6"
                            >
                                <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
                                    <div className="flex flex-col items-center mb-4 md:mb-0">
                                        <img
                                            src={request.EmployeeId.image}
                                            alt={request.EmployeeId.name}
                                            className="w-32 h-32 rounded-full mb-4"
                                        />
                                        <h2 className="text-xl font-bold">
                                            {request.EmployeeId.name}
                                        </h2>
                                        <p className="flex items-center">
                                            <FileText className="mr-2" />
                                            <a
                                                href={request.EmployeeId.cv}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View CV
                                            </a>
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {getStatusIcon(request.status)}
                                            <span className="capitalize text-sm font-medium">
                                                {request.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <p className="flex items-center">
                                                <Mail className="mr-2" />
                                                {request.EmployeeId.email}
                                            </p>
                                            <p className="flex items-center">
                                                <Phone className="mr-2" />
                                                {request.EmployeeId.phone}
                                            </p>
                                            {request.createdAt && (
                                                <p className="flex items-center">
                                                    <Clock className="mr-2" />
                                                    Applied:{' '}
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-semibold mb-2">
                                                Project Details
                                            </h3>
                                            <p className="flex items-center">
                                                <FileText className="mr-2" />
                                                {request.ProjectId.name}
                                            </p>
                                            <p className="flex items-center">
                                                <Clock className="mr-2" />
                                                Created At:{' '}
                                                {new Date(request.ProjectId.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="flex items-center">
                                                <Clock className="mr-2" />
                                                Updated At:{' '}
                                                {new Date(request.ProjectId.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {request.status === 'pending' && (
                                        <div className="flex flex-col gap-2 mt-4 md:mt-0">
                                            <input
                                                type="number"
                                                placeholder="Hourly Rate"
                                                value={hourlyRate}
                                                onChange={(e) => setHourlyRate(e.target.value)}
                                                className="p-2 border rounded-lg"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleStatusUpdate(request._id, 'approved', request.ProjectId._id)
                                                }
                                                className="bg-green-500 text-white px-6 py-2 rounded-lg"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleStatusUpdate(request._id, 'rejected', request.ProjectId._id)
                                                }
                                                className="bg-red-500 text-white px-6 py-2 rounded-lg"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {filteredRequests.length === 0 && (
                            <div className="text-center py-8">
                                <p>No requests found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeRequestsPage;
