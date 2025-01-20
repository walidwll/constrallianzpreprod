'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchJoinRequests,
	handleJoinRequest,
	setJoinRequestsPage,
} from '@/lib/store/features/contractorSlice';
import { Users, Filter, Check, X } from 'lucide-react';

const JoinRequestsPage = () => {
	const dispatch = useDispatch();
	const [status, setStatus] = useState('pending');
	const { joinRequests } = useSelector((state) => state.contractor);
	const { data, loading, error, pagination } = joinRequests;

	useEffect(() => {
		dispatch(fetchJoinRequests({ page: pagination.currentPage, status }));
	}, [dispatch, pagination.currentPage, status]);

	const handlePageChange = (page) => {
		dispatch(setJoinRequestsPage(page));
	};

	const handleStatusChange = (e) => {
		setStatus(e.target.value);
	};

	const handleApprove = (id) => {
		dispatch(handleJoinRequest({ id, actionType: 'approve' }));
	};

	return (
		<div className="p-4 sm:p-8 max-w-7xl mx-auto">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
				<div className="flex items-center gap-3">
					<Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Join Requests</h1>
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
				<div className="overflow-x-auto">
					<div className="min-w-full">
						<div className="bg-gray-50 border-b border-gray-100 hidden sm:block">
							<div className="grid sm:grid-cols-6 gap-4 px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
								<div className="sm:col-span-1">Company Name</div>
								<div className="sm:col-span-1">Director</div>
								<div className="sm:col-span-1">Production</div>
								<div className="sm:col-span-1">Supervisor</div>
								<div className="sm:col-span-1">Status</div>
								<div className="sm:col-span-1">Action</div>
							</div>
						</div>

						<div className="divide-y divide-gray-100">
							{loading ? (
								<div className="text-center py-8 text-gray-500">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
									Loading requests...
								</div>
							) : data?.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									<Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
									No requests found
								</div>
							) : (
								data?.map((request) => (
									<div key={request._id}
										className="group block sm:grid sm:grid-cols-6 gap-2 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
									>
										<div className="mb-2 sm:mb-0 sm:col-span-1">
											<span className="block sm:hidden text-xs font-medium text-gray-500 mb-1">Company Name</span>
											<span className="font-medium text-gray-900 break-words">{request.companyName}</span>
										</div>

										<div className="mb-2 sm:mb-0 sm:col-span-1">
											<span className="block sm:hidden text-xs font-medium text-gray-500 mb-1">Director</span>
											<div className="space-y-1">
												<div className="text-sm text-gray-900 break-words">{request.director.name}</div>
												<div className="text-xs text-gray-500 break-words">{request.director.email}</div>
											</div>
										</div>

										<div className="mb-2 sm:mb-0 sm:col-span-1">
											<span className="block sm:hidden text-xs font-medium text-gray-500 mb-1">Production</span>
											<div className="space-y-1">
												<div className="text-sm text-gray-900 break-words">{request.director.name}</div>
												<div className="text-xs text-gray-500 break-words">{request.director.email}</div>
											</div>
										</div>

										<div className="mb-2 sm:mb-0 sm:col-span-1">
											<span className="block sm:hidden text-xs font-medium text-gray-500 mb-1">Supervisor</span>
											<div className="space-y-1">
												<div className="text-sm text-gray-900 break-words">{request.director.name}</div>
												<div className="text-xs text-gray-500 break-words">{request.director.email}</div>
											</div>
										</div>

										<div className="mb-2 sm:mb-0 sm:col-span-1">
											<span className="block sm:hidden text-xs font-medium text-gray-500 mb-1">Status</span>
											<span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
												${request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
													request.status === 'approved' ? 'bg-green-100 text-green-700' :
														'bg-red-100 text-red-700'}`}
											>
												{request.status === 'approved' && <Check className="w-3 h-3" />}
												{request.status === 'rejected' && <X className="w-3 h-3" />}
												{request.status}
											</span>
										</div>

										<div className="sm:col-span-1">
											{request.status === 'pending' && (
												<button
													onClick={() => handleApprove(request._id)}
													className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
												>
													<Check className="w-4 h-4" />
													<span className="sm:hidden md:inline">Approve</span>
												</button>
											)}
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>

			{pagination.totalPages > 1 && (
				<div className="flex flex-wrap justify-center mt-6 gap-2 px-4">
					{[...Array(pagination.totalPages)].map((_, index) => (
						<button
							key={index}
							onClick={() => handlePageChange(index + 1)}
							className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 
                                ${pagination.currentPage === index + 1
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

export default JoinRequestsPage;