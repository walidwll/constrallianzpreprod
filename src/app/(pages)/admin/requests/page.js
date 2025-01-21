'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubContractorRequests, updateSubContractorRequestStatus } from '@/lib/store/features/subContractorSlice';
import { Users, Filter, Check, X } from 'lucide-react';

const SubContractorRequests = () => {
    const dispatch = useDispatch();
    const [status, setStatus] = useState('pending');
    const {
        requests,
        requestsLoading,
        requestsTotalPages,
        requestsCurrentPage
    } = useSelector((state) => state.subContractor);

    useEffect(() => {
        dispatch(fetchSubContractorRequests({ page: 1, status }));
    }, [dispatch, status]);

    const handlePageChange = (page) => {
        dispatch(fetchSubContractorRequests({ page, status }));
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleApprove = (requestId) => {
        dispatch(updateSubContractorRequestStatus({ requestId, status: 'approved' }));
    };

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Sub Contractor Requests</h1>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                        value={status}
                        onChange={handleStatusChange}
                        className="w-full sm:w-auto bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-500"
                    >
                        <option value="">All Requests</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="min-w-full">
                    <div className="bg-gray-50 border-b border-gray-100 hidden sm:block">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <div>Company Name</div>
                            <div>Email</div>
                            <div>Status</div>
                            <div>Action</div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {requestsLoading ? (
                            <div className="text-center py-8 text-gray-500">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                Loading requests...
                            </div>
                        ) : requests?.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
                                No requests found
                            </div>
                        ) : (
                            requests?.map((request) => (
                                <div key={request._id} 
                                    className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 px-4 sm:px-6 py-4 text-sm text-gray-800 items-start sm:items-center hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <div className="font-medium">
                                        <span className="sm:hidden text-xs text-gray-500 block">Company Name:</span>
                                        {request.SubContractorId?.first_name}
                                    </div>
                                    <div className="text-gray-600">
                                        <span className="sm:hidden text-xs text-gray-500 block">Email:</span>
                                        {request.SubContractorId?.email}
                                    </div>
                                    <div>
                                        <span className="sm:hidden text-xs text-gray-500 block">Status:</span>
                                        <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full
                                            ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                            request.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                            'bg-red-100 text-red-700'}`}
                                        >
                                            {request.status === 'approved' && <Check className="w-3 h-3" />}
                                            {request.status === 'rejected' && <X className="w-3 h-3" />}
                                            {request.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 sm:mt-0">
                                        {request.status === 'pending' && (
                                            <button
                                                onClick={() => handleApprove(request._id)}
                                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                                            >
                                                <Check className="w-4 h-4" />
                                                Approve
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {requestsTotalPages > 1 && (
                <div className="flex flex-wrap justify-center mt-6 gap-2 px-4">
                    {[...Array(requestsTotalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 
                                ${requestsCurrentPage === index + 1
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'} 
                                border border-gray-200 hover:border-blue-600`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubContractorRequests;