"use client";
import React, { useEffect, useState } from 'react';
import { fetchAllMachinery, createMachineryRequest } from '@/lib/store/features/subContractorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Package, Filter } from 'lucide-react';
import { useParams } from 'next/navigation';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	useMediaQuery,
	useTheme
} from '@mui/material';
import toast from 'react-hot-toast';

const ConfirmModal = ({ open, machinery, onClose, onConfirm, loading }) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Dialog
			fullScreen={fullScreen}
			open={open}
			onClose={onClose}
			aria-labelledby="confirm-dialog-title"
			PaperProps={{
				sx: {
					borderRadius: 2,
					padding: 1,
					minWidth: { xs: '90%', sm: '400px' }
				}
			}}
		>
			<DialogTitle id="confirm-dialog-title">
				Confirm Addition
			</DialogTitle>
			<DialogContent>
				<DialogContentText className="mb-4">
					Are you sure you want to create a request to add <span className='font-black'>{machinery?.name}</span> to this project
				</DialogContentText>

			</DialogContent>
			<DialogActions sx={{ padding: 2 }}>
				<Button
					onClick={onClose}
					variant="outlined"
					color="primary"
					disabled={loading}
				>
					Cancel
				</Button>
				<Button
					onClick={onConfirm}
					variant="contained"
					color="primary"
					disabled={loading}
					sx={{ ml: 2 }}
				>
					{loading ? (
						<>
							<span className="animate-spin mr-2">⚪</span>
							Requesting...
						</>
					) : 'Confirm'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const StatusBadge = ({ isActive }) => (
	<span className={`px-2 py-1 text-xs rounded-full ${isActive
		? 'bg-green-100 text-green-800 border border-green-200'
		: 'bg-red-100 text-red-800 border border-red-200'
		}`}>
		{isActive ? 'Active' : 'Inactive'}
	</span>
);

// Add this helper function at the top level of your component
const ratingOptions = [
	{ value: '', label: 'Any' },
	{ value: '1', label: '1+' },
	{ value: '2', label: '2+' },
	{ value: '3', label: '3+' },
	{ value: '4', label: '4+' },
	{ value: '5', label: '5' },
];

const AddMachinery = () => {
	const dispatch = useDispatch();
	const params = useParams();
	const { projectid } = params;
	const { allMachinery, loading: machineryLoading, error: machineryError, totalPages } = useSelector(
		(state) => state.subContractor
	);

	const [filteredMachinery, setFilteredMachinery] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [filters, setFilters] = useState({
		name: '',
		category: '',
		type: '',
		status: '',
		isActive: '',
		minPerformance: '',
		minDurability: '',
		minCostEfficiency: '',
		minReliability: '',
	});
	const [loadingMachinery, setLoadingMachinery] = useState({});
	const [confirmModal, setConfirmModal] = useState({
		show: false,
		machineryId: null,
		machineryName: ''
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	useEffect(() => {
		dispatch(fetchAllMachinery({
			name: searchTerm,
			category: filters.category,
			type: filters.type,
			status: filters.status,
			isActive: filters.isActive,
			minPerformance: filters.minPerformance,
			minDurability: filters.minDurability,
			minCostEfficiency: filters.minCostEfficiency,
			minReliability: filters.minReliability,
			page: currentPage,
			limit: itemsPerPage,
		}));
	}, [dispatch, filters, searchTerm, currentPage, itemsPerPage]);

	useEffect(() => {
		if (allMachinery) {
			let filtered = allMachinery;
			filtered = filtered.filter(machine => {
				if (filters.name && !machine.name.toLowerCase().includes(filters.name.toLowerCase())) {
					return false;
				}
				if (filters.category && machine.category !== filters.category) {
					return false;
				}
				if (filters.type && machine.type !== filters.type) {
					return false;
				}
				if (filters.status !== '' && machine.status.toString() !== filters.status) {
					return false;
				}
				if (filters.isActive !== '' && machine.isActive.toString() !== filters.isActive) {
					return false;
				}
				return true;
			});
			setFilteredMachinery(filtered);
		}
	}, [allMachinery, filters]);

	const handleAddMachinery = (machineryId) => async () => {


		try {
			setLoadingMachinery(prev => ({ ...prev, [machineryId]: true }));
			await dispatch(createMachineryRequest({
				machineryId,
				projectId: projectid,
			})).unwrap();
			toast.success('Request sent successfully!');
		} catch (error) {
			if (error.message === 'A request already exists') {
				toast.error('A request for this machinery already exists and is not rejected.');
			} else {
				toast.error('Failed to add machinery.');
			}
			console.error('Failed to add machinery:', error);
		} finally {
			setLoadingMachinery(prev => ({ ...prev, [machineryId]: false }));
			setConfirmModal({ show: false, machineryId: null, machineryName: '' });
		}
	};

	const showConfirmation = (machineryId, machineryName) => {
		setConfirmModal({
			show: true,
			machineryId,
			machineryName
		});
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleFilterChange = (e) => {
		setFilters({
			...filters,
			[e.target.name]: e.target.value,
		});
	};

	const resetFilters = () => {
		setFilters({
			name: '',
			category: '',
			type: '',
			status: '',
			isActive: '',
			minRating: '',
		});
		setSearchTerm('');
	};

	const calculateRatings = (ratings) => {
		if (!ratings || ratings.length === 0) {
			return {
				performance: 'N/A',
				durability: 'N/A',
				costEfficiency: 'N/A',
				reliability: 'N/A'
			};
		}

		const sum = ratings.reduce((acc, rating) => ({
			performance: acc.performance + (rating.performance || 0),
			durability: acc.durability + (rating.durability || 0),
			costEfficiency: acc.costEfficiency + (rating.costEfficiency || 0),
			reliability: acc.reliability + (rating.reliability || 0),
		}), { performance: 0, durability: 0, costEfficiency: 0, reliability: 0 });

		const count = ratings.length;
		return {
			performance: (sum.performance / count).toFixed(1),
			durability: (sum.durability / count).toFixed(1),
			costEfficiency: (sum.costEfficiency / count).toFixed(1),
			reliability: (sum.reliability / count).toFixed(1)
		};
	};

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
			<div className="container mx-auto">
				<div className="bg-white rounded-2xl shadow-2xl p-6">
					<h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
						<Package className="mr-3 text-blue-600" /> Machinery
					</h2>

					<div className="mb-6 bg-blue-50 p-4 rounded-lg">
						<div className="relative mb-4">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
							<input
								type="text"
								placeholder="Search machinery..."
								value={searchTerm}
								onChange={handleSearchChange}
								className="pl-10 p-2 border-2 border-blue-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label htmlFor="category" className="block text-blue-700 mb-1">Category</label>
								<input
									type="text"
									name="category"
									id="category"
									value={filters.category}
									onChange={handleFilterChange}
									className="p-2 border-2 border-blue-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
								/>
							</div>
							<div>
								<label htmlFor="type" className="block text-blue-700 mb-1">Type</label>
								<input
									type="text"
									name="type"
									id="type"
									value={filters.type}
									onChange={handleFilterChange}
									className="p-2 border-2 border-blue-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
								/>
							</div>
							<div>
								<label htmlFor="status" className="block text-blue-700 mb-1">Status</label>
								<select
									name="status"
									id="status"
									value={filters.status}
									onChange={handleFilterChange}
									className="p-2 border-2 border-blue-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
								>
									<option value="">All</option>
									<option value="true">Available</option>
									<option value="false">Unavailable</option>
								</select>
							</div>
							<div>
								<label htmlFor="isActive" className="block text-blue-700 mb-1">Active</label>
								<select
									name="isActive"
									id="isActive"
									value={filters.isActive}
									onChange={handleFilterChange}
									className="p-2 border-2 border-blue-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
								>
									<option value="">All</option>
									<option value="true">Active</option>
									<option value="false">Inactive</option>
								</select>
							</div>
							<div>
								<label htmlFor="minPerformance" className="block text-blue-700 mb-1">Min Performance</label>
								<select
									name="minPerformance"
									id="minPerformance"
									value={filters.minPerformance}
									onChange={handleFilterChange}
									className="p-2 border-2 border-blue-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
								>
									{ratingOptions.map(option => (
										<option key={`perf-${option.value}`} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>

							<div>
								<label htmlFor="minDurability" className="block text-blue-700 mb-1">Min Durability</label>
								<select
									name="minDurability"
									id="minDurability"
									value={filters.minDurability}
									onChange={handleFilterChange}
									className="p-2 border-2 border-blue-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
								>
									{ratingOptions.map(option => (
										<option key={`dur-${option.value}`} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>

							<div>
								<label htmlFor="minCostEfficiency" className="block text-blue-700 mb-1">Min Cost Efficiency</label>
								<select
									name="minCostEfficiency"
									id="minCostEfficiency"
									value={filters.minCostEfficiency}
									onChange={handleFilterChange}
									className="p-2 border-2 border-blue-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
								>
									{ratingOptions.map(option => (
										<option key={`cost-${option.value}`} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>

							<div>
								<label htmlFor="minReliability" className="block text-blue-700 mb-1">Min Reliability</label>
								<select
									name="minReliability"
									id="minReliability"
									value={filters.minReliability}
									onChange={handleFilterChange}
									className="p-2 border-2 border-blue-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
								>
									{ratingOptions.map(option => (
										<option key={`rel-${option.value}`} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="flex items-end mt-4">
							<button
								onClick={resetFilters}
								className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full"
							>
								Reset Filters
							</button>
						</div>
					</div>

					{machineryLoading ? (
						<div className="text-center text-blue-600 py-4">
							Loading machinery...
						</div>
					) : (
						<>
							{machineryError && (
								<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
									Error: {machineryError}
								</div>
							)}

							<div className="space-y-6">
								{filteredMachinery && filteredMachinery.map((machine) => {
									const ratings = calculateRatings(machine.rating);
									return (
										<div
											key={machine._id}
											className="bg-white border-2 border-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 w-full"
										>
											<div className="p-6">
												<div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
													{/* Updated machinery details section */}
													<div className="flex-1">
														<h2 className="text-2xl font-bold text-blue-900 mb-2">{machine.name}</h2>
														<p className="text-blue-700"><strong>Hourly Rate:</strong> {machine?.hourlyRate || "N/A"}</p>
														<p className="text-blue-700"><strong>Type:</strong> {machine.type}</p>
														<p className="text-blue-700"><strong>Category:</strong> {machine.category}</p>
														<p className="text-blue-700"><strong>Status:</strong> {machine.status ? 'Occupied' : 'Available'}</p>
														<p className="text-blue-700"><strong>Active:</strong> {machine.isActive ? 'Yes' : 'No'}</p>
														<p className="text-blue-700"><strong>Model:</strong> {machine.model}</p>
														<div className="mt-4 grid grid-cols-2 gap-2">
															<p className="text-blue-700"><strong>Performance:</strong> {ratings.performance}</p>
															<p className="text-blue-700"><strong>Durability:</strong> {ratings.durability}</p>
															<p className="text-blue-700"><strong>Cost Efficiency:</strong> {ratings.costEfficiency}</p>
															<p className="text-blue-700"><strong>Reliability:</strong> {ratings.reliability}</p>
														</div>
													</div>

													<div className="flex flex-col items-center mt-4 md:mt-0">
														<button
															onClick={() => showConfirmation(machine._id, machine.name)}
															disabled={loadingMachinery[machine._id] || !machine.isActive || machine.status}
															className={`px-6 py-2 rounded-lg transition whitespace-nowrap ${!machine.isActive || machine.status
																? 'bg-gray-400 text-gray-100 cursor-not-allowed'
																: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400'
																}`}
														>
															{loadingMachinery[machine._id] ? 'Adding...' : 'Add to Project'}
														</button>
														{(!machine.isActive || machine.status) && (
															<p className="text-xs text-red-600 mt-2 text-center">
																{machine.status ? 'Cannot add occupied machinery' : 'Cannot add inactive machinery'}
															</p>
														)}
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>

							{filteredMachinery && filteredMachinery.length === 0 && (
								<div className="text-center py-8 bg-blue-50 rounded-lg">
									<p className="text-blue-600 text-xl">No machinery matches your filters.</p>
								</div>
							)}

							{/* Pagination Controls */}
							<div className="flex justify-center mt-6 space-x-2">
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
								>
									Previous
								</button>
								<span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
									Page {currentPage} of {totalPages}
								</span>
								<button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
									className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
								>
									Next
								</button>
							</div>
						</>
					)}
				</div>
			</div>

			<ConfirmModal
				open={confirmModal.show}
				machinery={{ name: confirmModal.machineryName }}
				onClose={() => {
					setConfirmModal({ show: false, machineryId: null, machineryName: '' });
				}}
				onConfirm={handleAddMachinery(confirmModal.machineryId)}
				loading={loadingMachinery[confirmModal.machineryId]}

			/>
		</div>
	);
};

export default AddMachinery;

<style jsx>{`
  .text-blue-900 {
    color: #1e3a8a;
  }
  .text-blue-700 {
    color: #1d4ed8;
  }
  .bg-blue-600 {
    background-color: #2563eb;
  }
  .bg-blue-700 {
    background-color: #1d4ed8;
  }
  .bg-gray-400 {
    background-color: #9ca3af;
  }
  .text-gray-100 {
    color: #f3f4f6;
  }
  .text-red-600 {
    color: #dc2626;
  }
`}</style>