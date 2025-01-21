'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getMachineryRequests,
    updateMachineryRequestStatus,
    updateMachineryRequestFilters,
} from '@/lib/store/features/subContractorSlice';
import { Check, X, Loader2, CircleDot, Search } from 'lucide-react';
import { PageLoader } from '@/components/LoadingComponent';

export default function RequestsPage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth?.user?.user);
    const { machineryRequests, loading, error, machineryRequestFilters } = useSelector((state) => state.subContractor);

    const handleFilterChange = (filterType, value) => {
        dispatch(updateMachineryRequestFilters({ [filterType]: value }));
        if (filterType === 'status' && user?._id) {
            dispatch(getMachineryRequests({
                subContractorId: user._id,
                filters: {
                    ...machineryRequestFilters,
                    [filterType]: value
                }
            }));
        }
    };

    const handleSearch = () => {
        if (user?._id) {
            dispatch(getMachineryRequests({
                subContractorId: user._id,
                filters: machineryRequestFilters
            }));
        }
    };

    useEffect(() => {
        if (user?._id) {
            dispatch(getMachineryRequests({
                subContractorId: user._id,
                filters: {
                    ...machineryRequestFilters,
                    machineryName: ''
                }
            }));
        }
    }, [dispatch, user]);

    const handleStatusUpdate = async (requestId, status, projectId) => {
        try {
            await dispatch(updateMachineryRequestStatus({ requestId, status, projectId })).unwrap();
            dispatch(getMachineryRequests({
                subContractorId: user._id,
                filters: machineryRequestFilters
            }));
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <PageLoader />
        );
    }

    if (error) {
        return (
            <div className="m-4 p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6 bg-white rounded-lg shadow p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold text-primary mb-2">
                    Machinery Requests Management
                </h1>
                <p className="text-gray-600">
                    Manage all machinery requests from different projects
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-1 gap-2">
                        <input
                            type="text"
                            placeholder="Search by machinery name..."
                            className="px-3 py-2 border rounded-md w-full sm:w-64"
                            value={machineryRequestFilters.machineryName}
                            onChange={(e) => handleFilterChange('machineryName', e.target.value)}
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center shadow-sm"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Search
                        </button>
                    </div>
                    <select
                        className="px-3 py-2 border rounded-md w-full sm:w-auto"
                        value={machineryRequestFilters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="pending" >Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {machineryRequests?.length === 0 ? (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
                    No machinery requests found.
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Machinery Details
                                </th>
                                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Project Details
                                </th>
                                <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Request Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {machineryRequests?.map((request) => (
                                <tr key={request._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4">
                                        <div className="font-medium text-gray-900">
                                            {request.machineryId?.name || 'Unavailable'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Type: {request.machineryId?.type || 'Unavailable'}
                                        </div>
                                        <div className="sm:hidden mt-2 text-sm text-gray-500">
                                            <div>Project: {request.projectId?.name || 'Unavailable'}</div>
                                            <div>Budget: ${request.projectId?.budget?.toLocaleString() || '0'}</div>
                                            <div className="mt-1">
                                                {request.createdAt ? formatDate(request.createdAt) : 'Date unavailable'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden sm:table-cell px-4 py-4">
                                        <div className="font-medium text-gray-900">
                                            {request.projectId?.name || 'Unavailable'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Budget: ${request.projectId?.budget?.toLocaleString() || '0'}
                                        </div>
                                    </td>
                                    <td className="hidden lg:table-cell px-4 py-4 text-sm text-gray-500">
                                        {request.createdAt ? formatDate(request.createdAt) : 'Date unavailable'}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            <CircleDot className="w-3 h-3 mr-1" />
                                            {request.status || 'pending'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        {request.status === 'pending' && (
                                            <div className="flex flex-col sm:flex-row gap-2 justify-end">
                                              
                                                <button
                                                    onClick={() => handleStatusUpdate(request._id, 'approved', request.projectId?._id)}
                                                    className="inline-flex items-center justify-center px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                                                >
                                                    <Check className="w-4 h-4 mr-1" />
                                                    <span className="hidden sm:inline">Approve</span>
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(request._id, 'rejected')}
                                                    className="inline-flex items-center justify-center px-3 py-1 border border-red-600 text-red-600 text-sm font-medium rounded-md hover:bg-red-50"
                                                >
                                                    <X className="w-4 h-4 mr-1" />
                                                    <span className="hidden sm:inline">Reject</span>
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
