import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, KeyRound, Plus, Menu, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {  fetchContractorStatistics, fetchEmployeeStatistics, fetchMachineryStatistics } from '@/lib/store/features/contractorSlice';
import SubcontractorList from './SubcontractorList';
import EmployeeAndMachineryGraphs from './EmployeeAndMachineryGraphs';
import { Bar, Pie } from 'react-chartjs-2';

const ContractorDashboard = ({ user, logout, projects }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { statistics, employeeStatistics, machineryStatistics, loading, error, subcontractors } = useSelector((state) => state.contractor);
    const [employeePage, setEmployeePage] = useState(1);
    const [machineryPage, setMachineryPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (user) {
            dispatch(fetchContractorStatistics({ contractorId: user._id }));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (user) {
            dispatch(fetchEmployeeStatistics({
                contractorId: user._id,
                page: employeePage,
                pageSize: itemsPerPage
            }));
        }
    }, [dispatch, user, employeePage]);

    useEffect(() => {
        if (user) {
            dispatch(fetchMachineryStatistics({
                contractorId: user._id,
                page: machineryPage,
                pageSize: itemsPerPage
            }));
        }
    }, [dispatch, user, machineryPage]);

    const handleAddProject = () => {
        router.push('/admin/add-company');
    };
    const renderCharts = () => {
        if (!statistics) return null;

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-800">Employee Distribution</h3>
                    <div className="relative h-[300px] w-full">
                        <Pie
                            data={{
                                labels: ['Active', 'Inactive'],
                                datasets: [{
                                    data: [statistics.employeeStats.activeCount, statistics.employeeStats.inactiveCount],
                                    backgroundColor: ['#10B981', '#EF4444'],
                                    borderWidth: 2
                                }]
                            }}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: {
                                            padding: 20,
                                            font: {
                                                size: 14
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-800">Machinery by Category</h3>
                    <div className="relative h-[300px] w-full">
                        <Bar
                            data={{
                                labels: Object.keys(statistics.machineryStats.byCategory),
                                datasets: [{
                                    data: Object.values(statistics.machineryStats.byCategory),
                                    backgroundColor: ['#60A5FA', '#34D399', '#F472B6', '#FBBF24'],
                                    borderWidth: 0,
                                    borderRadius: 8
                                }]
                            }}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: {
                                            display: false
                                        }
                                    },
                                    x: {
                                        grid: {
                                            display: false
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const isEmployeesLoading = employeeStatistics.loading;
    const isMachineryLoading = machineryStatistics.loading;

    const renderLists = () => {
        if (!employeeStatistics.pagination || !machineryStatistics.pagination) return null;

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Employees Table */}
                <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-800 px-4">Project Employees</h3>
                    {isEmployeesLoading ? (
                        <div className="flex justify-center items-center h-48">Loading employees...</div>
                    ) : (
                        <div className="overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Role</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {employeeStatistics?.data?.map((employee, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${employee.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {employee.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* Employee Pagination */}
                    <div className="mt-4 flex justify-center items-center space-x-4">
                        <button
                            onClick={() => setEmployeePage(p => Math.max(1, p - 1))}
                            disabled={employeePage === 1}
                            className="px-3 py-1 border rounded-md bg-white disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {employeePage} of {employeeStatistics.pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setEmployeePage(p => Math.min(employeeStatistics.pagination.totalPages, p + 1))}
                            disabled={employeePage === employeeStatistics.pagination.totalPages}
                            className="px-3 py-1 border rounded-md bg-white disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Machinery Table */}
                <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-800 px-4">Project Machinery</h3>
                    {isMachineryLoading ? (
                        <div className="flex justify-center items-center h-48">Loading machinery...</div>
                    ) : (
                        <div className="overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {machineryStatistics?.data?.map((machine, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{machine.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{machine.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${machine.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {machine.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="mt-4 flex justify-center items-center space-x-4">
                        <button
                            onClick={() => setMachineryPage(p => Math.max(1, p - 1))}
                            disabled={machineryPage === 1}
                            className="px-3 py-1 border rounded-md bg-white disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {machineryPage} of {machineryStatistics.pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setMachineryPage(p => Math.min(machineryStatistics.pagination.totalPages, p + 1))}
                            disabled={machineryPage === machineryStatistics.pagination.totalPages}
                            className="px-3 py-1 border rounded-md bg-white disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 lg:p-8">
            <div className="container mx-auto max-w-7xl">
                <div className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-green-800">Dashboard</h1>
            
                    </div>

                    {/* New Stats Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-gray-100 rounded-lg">
                                <p className="text-xl font-bold">{statistics?.employeeCount}</p>
                                <p>Employees</p>
                            </div>
                            <div className="p-4 bg-gray-100 rounded-lg">
                                <p className="text-xl font-bold">{statistics?.machineryCount}</p>
                                <p>Machinery</p>
                            </div>
                            {/* <div className="p-4 bg-gray-100 rounded-lg">
                                <p className="text-xl font-bold">{statistics?.subcontractorCount}</p>
                                <p>Subcontractors</p>
                            </div> */}
                            <div className="p-4 bg-gray-100 rounded-lg">
                                <p className="text-xl font-bold">{statistics?.projectCount}</p>
                                <p>Projects</p>
                            </div>
                        </div>
                    </div>
                    {/* <div className="mb-8">
                        <SubcontractorList subcontractors={subcontractors} loading={loading} error={error} />
                    </div> */}

                    <div className="mb-8">
                        <EmployeeAndMachineryGraphs statistics={statistics} />
                    </div>

                    {renderCharts()}
                    {renderLists()}

                </div>
            </div>
        </div>
    );
};

export default ContractorDashboard;