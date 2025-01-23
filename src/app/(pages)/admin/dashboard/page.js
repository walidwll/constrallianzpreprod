'use client';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchCompanies, fetchStatistics, fetchPaginatedEmployees, fetchPaginatedMachinery, fetchPaginatedSubContractors, fetchAllSubContractors } from '@/lib/store/features/companySlice';
import { logoutAdmin } from '@/lib/store/features/authSlice';
import Link from 'next/link';
import {
    Menu,
    Building2,
    LogOut,
    KeyRound,
    Plus
} from 'lucide-react';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns'; 
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    TimeScale,
);

export default function Dashboard() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const { companies, loading, error, totalPages, statistics, paginatedData } = useSelector((state) => state.companies);
    const allSubContractors = useSelector((state) => state.companies.allSubContractors);
    const [activeTab, setActiveTab] = useState('employees');
    const [selectedSubContractor, setSelectedSubContractor] = useState('all');

    useEffect(() => {
        dispatch(fetchStatistics())
    }, [])

    useEffect(() => {
        dispatch(fetchAllSubContractors());
    }, [dispatch]);

    const handlePageChange = (type, newPage) => {
        setPaginationState(prev => ({
            ...prev,
            [type]: { ...prev[type], page: newPage }
        }));

        if (type === 'employees') {
            dispatch(fetchPaginatedEmployees({
                page: newPage,
                limit: paginationState[type].limit
            }));
        } else if (type === 'machinery') {
            dispatch(fetchPaginatedMachinery({
                page: newPage,
                limit: paginationState[type].limit
            }));
        } else if (type === 'subcontractors') {
            dispatch(fetchPaginatedSubContractors({
                page: newPage,
                limit: paginationState[type].limit
            }));
        }
    };

    const [paginationState, setPaginationState] = useState({
        employees: { page: 1, limit: 5 },
        machinery: { page: 1, limit: 5 },
        subcontractors: { page: 1, limit: 5 }
    });

    useEffect(() => {
        dispatch(fetchCompanies({ page: currentPage, limit: 4 }));
    }, [dispatch, currentPage]);

    useEffect(() => {
        setPaginationState(prev => ({
            ...prev,
            [activeTab]: { ...prev[activeTab], page: 1 }
        }));

        if (activeTab === 'employees') {
            dispatch(fetchPaginatedEmployees({
                page: 1,
                limit: paginationState[activeTab].limit
            }));
        } else if (activeTab === 'machinery') {
            dispatch(fetchPaginatedMachinery({
                page: 1,
                limit: paginationState[activeTab].limit
            }));
        } else if (activeTab === 'subcontractors') {
            dispatch(fetchPaginatedSubContractors({
                page: 1,
                limit: paginationState[activeTab].limit
            }));
        }
    }, [activeTab, dispatch]);

    const logout = async () => {
        const resultAction = await dispatch(logoutAdmin());
        if (logoutAdmin.fulfilled.match(resultAction)) {
            window.location.href = '/admin/login';
        }
    };

    const handleAddCompany = () => {
        router.push('/admin/add-company');
    };

    function getRoleColor(role) {
        switch (role) {
            case 'director':
                return 'bg-blue-500';
            case 'production':
                return 'bg-green-500';
            case 'supervisor':
                return 'bg-purple-500';
            default:
                return 'bg-gray-500';
        }
    }

    function getRoleIcon(role) {
        switch (role) {
            case 'director':
                return '👔';
            case 'production':
                return '🎬';
            case 'supervisor':
                return '🛠️';
            default:
                return '👤';
        }
    }

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    font: { size: 14 }
                }
            },
            title: {
                display: true,
                font: { size: 16, weight: 'bold' }
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };



    const personnelData = {
        labels: ['Employees', 'Subcontractors', 'Contractors'],
        datasets: [{
            data: [
                statistics?.employeeCount || 0,
                statistics?.subcontractorCount || 0,
                statistics?.contractorCount || 0
            ],
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(236, 72, 153, 0.8)'
            ],
            borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(236, 72, 153, 1)'
            ],
            borderWidth: 2
        }]
    };

    const resourceData = {
        labels: ['Employees', 'Machinery'],
        datasets: [{
            data: [statistics?.employeeCount || 0, statistics?.machineryCount || 0],
            backgroundColor: [
                'rgba(99, 102, 241, 0.8)',
                'rgba(236, 72, 153, 0.8)'
            ],
            borderColor: [
                'rgba(99, 102, 241, 1)',
                'rgba(236, 72, 153, 1)'
            ],
            borderWidth: 2
        }]
    };


    const fixedCompanyRow = (company, contractor) => (
        <tr key={`${company._id}-${contractor._id}`}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {company.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {contractor.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(contractor.role)} text-white`}>
                    {getRoleIcon(contractor.role)} {contractor.role}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                <a href={`mailto:${contractor.email}`} className="text-blue-600 hover:text-blue-900">
                    {contractor.email}
                </a>
            </td>
        </tr>
    );

    const renderDataTables = () => (
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
            <div className="overflow-x-auto">
                <div className="flex gap-2 md:gap-4 mb-6 whitespace-nowrap">
                    <button
                        onClick={() => setActiveTab('employees')}
                        className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base flex-shrink-0 transition-colors ${activeTab === 'employees'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Employees ({paginatedData?.employees?.totalItems || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('machinery')}
                        className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base flex-shrink-0 transition-colors ${activeTab === 'machinery'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Machinery ({paginatedData?.machinery?.totalItems || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('subcontractors')}
                        className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base flex-shrink-0 transition-colors ${activeTab === 'subcontractors'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        SubContractors ({paginatedData?.subcontractors?.totalItems || 0})
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                {activeTab === 'employees' ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedData?.employees?.data?.map(employee => (
                                <tr key={employee._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{employee.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{employee.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${employee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {employee.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{employee.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : activeTab === 'machinery' ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedData?.machinery?.data?.map(machine => (
                                <tr key={machine._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{machine.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{machine.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{machine.model}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${machine.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {machine.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedData?.subcontractors?.data?.map(subcontractor => (
                                <tr key={subcontractor._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{subcontractor.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{subcontractor.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${subcontractor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {subcontractor.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{subcontractor.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <div className="mt-4 flex justify-center gap-2">
                <button
                    onClick={() => handlePageChange(activeTab, paginationState[activeTab].page - 1)}
                    disabled={paginationState[activeTab].page === 1}
                    className="px-4 py-2 border rounded-md bg-white disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2">
                    Page {paginatedData[activeTab]?.currentPage || 1} of {
                        paginatedData[activeTab]?.totalPages || 1
                    }
                </span>
                <button
                    onClick={() => handlePageChange(activeTab, paginationState[activeTab].page + 1)}
                    disabled={
                        paginationState[activeTab].page >= (paginatedData[activeTab]?.totalPages || 1)
                    }
                    className="px-4 py-2 border rounded-md bg-white disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );

    useEffect(() => {
        dispatch(fetchPaginatedEmployees({
            page: paginationState.employees.page,
            limit: paginationState.employees.limit
        }));
        dispatch(fetchPaginatedMachinery({
            page: paginationState.machinery.page,
            limit: paginationState.machinery.limit
        }));
        dispatch(fetchPaginatedSubContractors({
            page: paginationState.subcontractors.page,
            limit: paginationState.subcontractors.limit
        }));
    }, []);

    const getFilteredTimeSeriesData = () => {
        if (!statistics?.timeSeriesRatings) return { employees: [], machinery: [] };

        if (selectedSubContractor === 'all') {
            // Combine all ratings but keep them separated by type
            const allData = statistics.timeSeriesRatings.reduce((acc, company) => {
                acc.employees.push(...company.employeeRatings.map(r => ({
                    x: new Date(r.timestamp),
                    y: r.rating
                })));
                acc.machinery.push(...company.machineryRatings.map(r => ({
                    x: new Date(r.timestamp),
                    y: r.rating
                })));
                return acc;
            }, { employees: [], machinery: [] });

            // Sort by date
            allData.employees.sort((a, b) => a.x - b.x);
            allData.machinery.sort((a, b) => a.x - b.x);

            return allData;
        }

        // For specific subcontractor, keep company names
        const filtered = statistics.timeSeriesRatings.filter(
            company => company.subContractorId === selectedSubContractor
        );

        return {
            employees: filtered.flatMap(company => 
                company.employeeRatings.map(r => ({
                    x: new Date(r.timestamp),
                    y: r.rating,
                    name: `${company.name} - ${r.name}`
                }))
            ).sort((a, b) => a.x - b.x),
            machinery: filtered.flatMap(company => 
                company.machineryRatings.map(r => ({
                    x: new Date(r.timestamp),
                    y: r.rating,
                    name: `${company.name} - ${r.name}`
                }))
            ).sort((a, b) => a.x - b.x)
        };
    };

    const renderAnalytics = () => (
        <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Personnel Distribution</h3>
                    <div className="aspect-square">
                        <Pie data={personnelData} options={pieOptions} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Resources Distribution</h3>
                    <div className="aspect-square">
                        <Pie data={resourceData} options={pieOptions} />
                    </div>
                </div>
            </div>

            {renderPerformanceAnalytics()}
        </div>
    );

    const renderPerformanceAnalytics = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Employee Performance Overview</h3>
                <div className="h-[400px]">
                    <Line
                        data={{
                            labels: ['Quality', 'Technical', 'Punctuality', 'Safety'],
                            datasets: [{
                                label: 'Average Rating',
                                data: Object.entries(statistics?.ratings || {}).map(([_, data]) =>
                                    parseFloat(data?.average || 0).toFixed(1)
                                ),
                                borderColor: 'rgba(59, 130, 246, 1)',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                fill: true,
                                tension: 0.4,
                                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 6,
                                pointHoverRadius: 8
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            const category = context.label.toLowerCase();
                                            const totalRated = statistics?.ratings?.[category]?.totalRated || 0;
                                            return [
                                                `Average Rating: ${context.formattedValue} out of 5`,
                                                `Based on ${totalRated} ratings`
                                            ];
                                        }
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: 5,
                                    title: {
                                        display: true,
                                        text: 'Rating (Out of 5)',
                                        font: { size: 14 }
                                    }
                                }
                            }
                        }}
                    />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {Object.entries(statistics?.ratings || {}).map(([category, data]) => (
                        <div key={category} className="bg-gray-50 p-2 rounded text-center">
                            <h4 className="font-semibold capitalize text-sm">{category}</h4>
                            <p className="text-xl font-bold text-blue-600">
                                {parseFloat(data.average).toFixed(1)}
                            </p>
                            <p className="text-xs text-gray-600">
                                {data.totalRated} ratings
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Machinery Performance Overview</h3>
                <div className="h-[400px]">
                    <Line
                        data={{
                            labels: ['Performance', 'Durability', 'Cost Efficiency', 'Reliability'],
                            datasets: [{
                                label: 'Average Rating',
                                data: Object.entries(statistics?.machineryRatings || {}).map(([_, data]) =>
                                    parseFloat(data?.average || 0).toFixed(1)
                                ),
                                borderColor: 'rgba(236, 72, 153, 1)',
                                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                                fill: true,
                                tension: 0.4,
                                pointBackgroundColor: 'rgba(236, 72, 153, 1)',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 6,
                                pointHoverRadius: 8
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            const category = context.label.toLowerCase().replace(/\s+/g, '');
                                            const totalRated = statistics?.machineryRatings?.[category]?.totalRated || 0;
                                            return [
                                                `Average Rating: ${context.formattedValue} out of 5`,
                                                `Based on ${totalRated} ratings`
                                            ];
                                        }
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: 5,
                                    title: {
                                        display: true,
                                        text: 'Rating (Out of 5)',
                                        font: { size: 14 }
                                    }
                                }
                            }
                        }}
                    />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {Object.entries(statistics?.machineryRatings || {}).map(([category, data]) => (
                        <div key={category} className="bg-gray-50 p-2 rounded text-center">
                            <h4 className="font-semibold capitalize text-sm">{category}</h4>
                            <p className="text-xl font-bold text-blue-600">
                                {parseFloat(data.average).toFixed(1)}
                            </p>
                            <p className="text-xs text-gray-600">
                                {data.totalRated} ratings
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderTimeSeriesChart = () => {
        const data = getFilteredTimeSeriesData();

        return (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-700">Resource Ratings Over Time</h3>
                    <select
                        value={selectedSubContractor}
                        onChange={(e) => setSelectedSubContractor(e.target.value)}
                        className="ml-4 px-4 py-2 border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All SubContractors</option>
                        {allSubContractors?.map(sc => (
                            <option key={sc._id} value={sc._id}>
                                {sc.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="h-[500px]">
                    <Line
                        data={{
                            datasets: [
                                {
                                    label: selectedSubContractor === 'all' ? 'All Employees' : 'Employees',
                                    data: data.employees,
                                    borderColor: 'rgba(59, 130, 246, 1)',
                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                    pointRadius: 2,
                                    tension: 0.4
                                },
                                {
                                    label: selectedSubContractor === 'all' ? 'All Machinery' : 'Machinery',
                                    data: data.machinery,
                                    borderColor: 'rgba(236, 72, 153, 1)',
                                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                                    pointRadius: 2,
                                    tension: 0.4
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    type: 'time',
                                    time: {
                                        unit: 'day',
                                        displayFormats: {
                                            day: 'MMM d, yyyy'
                                        }
                                    },
                                    title: {
                                        display: true,
                                        text: 'Date'
                                    }
                                },
                                y: {
                                    beginAtZero: true,
                                    max: 5,
                                    title: {
                                        display: true,
                                        text: 'Average Rating'
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        usePointStyle: true
                                    }
                                },
                                tooltip: {
                                    callbacks: {
                                        title: (context) => {
                                            return new Date(context[0].parsed.x).toLocaleDateString();
                                        },
                                        label: (context) => {
                                            const point = context.raw;
                                            const label = selectedSubContractor === 'all' 
                                                ? `Rating: ${point.y.toFixed(1)}`
                                                : `${point.name} - Rating: ${point.y.toFixed(1)}`;
                                            return label;
                                        }
                                    }
                                }
                            }
                        }}
                    />
                </div>
                {(data.employees.length === 0 && data.machinery.length === 0) && (
                    <div className="text-center text-gray-500 mt-4">
                        No rating data available for this selection
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
            <div className="container mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-row justify-between items-center py-4">
                    <div className="flex items-center space-x-2">
                        <Building2 className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                        <h1 className="text-xl md:text-3xl font-extrabold text-gray-800 truncate">
                            Admin Dashboard
                        </h1>
                    </div>
                </div>

                <div className="mb-8">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : companies.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No companies registered yet.</p>
                            <button
                                onClick={handleAddCompany}
                                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                            >
                                Add New Company
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto bg-white rounded-lg shadow">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Company
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contractor
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {companies?.flatMap(company =>
                                            company?.contractors?.map(contractor =>
                                                fixedCompanyRow(company, contractor)
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 flex justify-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 border rounded-md bg-white">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
                {renderDataTables()}
                {renderAnalytics()}
                {renderTimeSeriesChart()}
            </div>
        </div >
    );
}