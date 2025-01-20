'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminReports } from '@/lib/store/features/contractorSlice';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PageLoader } from '@/components/LoadingComponent';
import { ReportPDF, AllReportsPDF } from '@/app/(pages)/user/reports/page';

export default function AdminReportsPage() {
	const [selectedMonth, setSelectedMonth] = useState('all');
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [currentTime, setCurrentTime] = useState('');
	const dispatch = useDispatch();
	const { data: reports, pagination, loading, error } = useSelector(state => state.contractor.adminReports);

	const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
	const months = [
		{ name: 'All Months', value: 'all' },
		{ name: 'January', value: 1 },
		{ name: 'February', value: 2 },
		{ name: 'March', value: 3 },
		{ name: 'April', value: 4 },
		{ name: 'May', value: 5 },
		{ name: 'June', value: 6 },
		{ name: 'July', value: 7 },
		{ name: 'August', value: 8 },
		{ name: 'September', value: 9 },
		{ name: 'October', value: 10 },
		{ name: 'November', value: 11 },
		{ name: 'December', value: 12 },
	];

	// Add debounced search effect
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchTerm);
		}, 500);

		return () => clearTimeout(timer);
	}, [searchTerm]);

	useEffect(() => {
		dispatch(fetchAdminReports({
			page: currentPage,
			limit: 5,
			month: selectedMonth === 'all' ? '' : selectedMonth,
			year: selectedYear === 'all' ? '' : selectedYear,
			search: debouncedSearch
		}));
	}, [selectedMonth, selectedYear, currentPage, debouncedSearch, dispatch]);

	useEffect(() => {
		const updateTime = () => {
			setCurrentTime(new Date().toLocaleTimeString());
		};
		
		// Initial update
		updateTime();
		
		// Update every second
		const interval = setInterval(updateTime, 1000);
		
		return () => clearInterval(interval);
	}, []);

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const handleSearch = () => {
		setCurrentPage(1);
		dispatch(fetchAdminReports({
			page: 1,
			limit: 5,
			month: selectedMonth === 'all' ? '' : selectedMonth,
			year: selectedYear === 'all' ? '' : selectedYear,
			search: searchTerm
		}));
	};

	const handleReset = () => {
		setSearchTerm('');
		setSelectedMonth('all');
		setSelectedYear(new Date().getFullYear().toString());
		setCurrentPage(1);
		dispatch(fetchAdminReports({
			page: 1,
			limit: 5
		}));
	};

	if (loading) return <PageLoader />;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
			<div className="max-w-7xl mx-auto">
				{/* Header Section */}
				<div className="bg-white rounded-xl shadow-sm p-6 mb-8">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div className="flex flex-col md:flex-row md:items-center gap-4">
							<h1 className="text-3xl font-bold text-gray-800">Reports</h1>
							{reports.length > 0 && (
								<PDFDownloadLink
									document={<AllReportsPDF reports={reports} />}
									fileName={`all-reports-${selectedYear}-${selectedMonth}.pdf`}
									className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
								>
									{({ loading }) => loading ? 'Preparing download...' : 'Download All'}
								</PDFDownloadLink>
							)}
						</div>

						{/* Add Search Input */}
						<div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
							<div className="flex gap-2">
								<input
									type="text"
									placeholder="Search projects..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
									className="px-4 py-2 border rounded-lg bg-white shadow-sm hover:border-blue-500 transition-colors w-full md:w-64"
								/>
								<button
									onClick={handleSearch}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									Search
								</button>
								<button
									onClick={handleReset}
									className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
								>
									Reset
								</button>
							</div>
							{/* Existing filters */}
							<select
								value={selectedMonth}
								onChange={(e) => setSelectedMonth(e.target.value)}
								className="px-4 py-2 border rounded-lg bg-white shadow-sm hover:border-blue-500 transition-colors"
							>
								{months.map((month, index) => (
									<option key={index} value={month.value}>{month.name}</option>
								))}
							</select>

							<select
								value={selectedYear}
								onChange={(e) => setSelectedYear(e.target.value)}
								className="px-4 py-2 border rounded-lg bg-white shadow-sm hover:border-blue-500 transition-colors"
							>
								<option value="all">All Years</option>
								{years.map((year, index) => (
									<option key={index} value={year}>{year}</option>
								))}
							</select>
						</div>
					</div>
				</div>

				 {/* Replace direct time display with state-based display */}
				<div className="mb-4 text-sm text-gray-600">
					Last updated: {currentTime}
				</div>

				{/* Reports Grid */}
				<div className="grid gap-8">
					{reports.length === 0 ? (
						<div className="bg-white rounded-xl shadow-sm p-12 text-center">
							<svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							<p className="text-xl text-gray-600">No reports found for the selected filters</p>
						</div>
					) : (
						reports.map((report, index) => (
							<div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
								{/* Project Header */}
								<div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl">
									<div className="flex justify-between items-center">
										<h2 className="text-2xl font-bold text-white">
											{report.projectId.name}
										</h2>
										<PDFDownloadLink
											document={<ReportPDF report={report} />}
											fileName={`${report.projectId.name}-${report.month}-${report.year}.pdf`}
											className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50"
										>
											Download PDF
										</PDFDownloadLink>
									</div>
									<div className="mt-2 text-blue-100">
										Period: {report.month}/{report.year}
									</div>
								</div>

								{/* Progress Section */}
								<div className="p-6 border-b">
									<div className="flex justify-between items-center mb-4">
										<div>
											<h3 className="text-lg font-semibold text-gray-800">Project Progress</h3>
											<p className="text-sm text-gray-500">Total Hours: {report.projectId.totalHours || 0}</p>
										</div>
										<div className="text-right">
											<span className="text-2xl font-bold text-blue-600">
												{((report.projectId.completedHours / (report.projectId.totalHours || 1)) * 100).toFixed(1)}%
											</span>
										</div>
									</div>
									<div className="relative w-full bg-gray-200 rounded-full h-2.5">
										<div
											className="absolute left-0 top-0 h-full bg-blue-600 rounded-full transition-all duration-300"
											style={{ width: `${Math.min((report.projectId.completedHours / (report.projectId.totalHours || 1)) * 100, 100)}%` }}
										></div>
									</div>
								</div>

								{/* Cost Summary Cards */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
									<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
										<h3 className="text-lg font-semibold text-blue-900 mb-3">Real-Time Costs</h3>
										<div className="space-y-2">
											<div className="flex justify-between">
												<span>Hours (30 days)</span>
												<span>{report.realTimeCosts?.totalWorkedHours || 0}</span>
											</div>
											<div className="flex justify-between">
												<span>Labour</span>
												<span>${report.realTimeCosts?.totalLabourCost?.toFixed(2) || 0}</span>
											</div>
											<div className="flex justify-between">
												<span>Machinery</span>
												<span>${report.realTimeCosts?.totalMachineryCost?.toFixed(2) || 0}</span>
											</div>
											<div className="flex justify-between font-semibold">
												<span>Total</span>
												<span>${report.realTimeCosts?.totalCost?.toFixed(2) || 0}</span>
											</div>
										</div>
									</div>

									<div className="p-4 bg-green-50 rounded">
										<h3 className="font-semibold">Monthly Stats</h3>
										<div className="mt-2 space-y-1">
											<p>Total Hours: {report.monthlyStats?.totalWorkedHours || 0}</p>
											<p>Avg. Rate: ${report.monthlyStats?.averageHourlyRate?.toFixed(2) || 0}/hr</p>
											<p>Labour Cost: ${report.totalLabourCost?.toFixed(2) || 0}</p>
											<p>Machinery Cost: ${report.totalMachineryCost?.toFixed(2) || 0}</p>
										</div>
									</div>

									<div className="p-4 bg-purple-50 rounded">
										<h3 className="font-semibold">Project Totals</h3>
										<div className="mt-2 space-y-1">
											<p>Historical: ${report.totalCost?.toFixed(2) || 0}</p>
											<p>Current: ${report.projectTotalCost?.toFixed(2) || 0}</p>
											<p>Employees: {report.totalEmployees || 0}</p>
											<p>Machinery: {report.machineryDetails?.length || 0}</p>
										</div>
									</div>
								</div>

								 {/* Update real-time cost section */}
								<div className="p-4 border-t">
									<div className="flex justify-between items-center">
										<span className="text-sm font-medium text-gray-600">
											Real-time Costs Updated
										</span>
										<span className="text-sm text-gray-500">
											 {report.realTimeCosts?.calculatedAt ? new Date(report.realTimeCosts.calculatedAt).toLocaleString() : ''}
										</span>
									</div>
								</div>
							</div>
						))
					)}
				</div>

				{/* Pagination */}
				{pagination?.totalPages > 1 && (
					<div className="mt-8 flex justify-center gap-2">
						<button
							onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
							disabled={currentPage === 1}
							className={`px-4 py-2 rounded ${currentPage === 1
								? 'bg-gray-200 text-gray-500'
								: 'bg-white text-blue-600 hover:bg-blue-50'
								}`}
						>
							Previous
						</button>

						{Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
							<button
								key={page}
								onClick={() => handlePageChange(page)}
								className={`px-4 py-2 rounded ${page === currentPage
									? 'bg-blue-600 text-white'
									: 'bg-white text-blue-600 hover:bg-blue-50'
									}`}
							>
								{page}
							</button>
						))}

						<button
							onClick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
							disabled={currentPage === pagination.totalPages}
							className={`px-4 py-2 rounded ${currentPage === pagination.totalPages
								? 'bg-gray-200 text-gray-500'
								: 'bg-white text-blue-600 hover:bg-blue-50'
								}`}
						>
							Next
						</button>
					</div>
				)}
			</div>
		</div>
	);
}