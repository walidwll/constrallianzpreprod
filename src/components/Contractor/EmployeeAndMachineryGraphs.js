import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

const EmployeeAndMachineryGraphs = ({ statistics }) => {
    if (!statistics) return null;

    const { employeeCount, machineryCount, projectCount, subcontractorCount } = statistics;

    const resourceData = {
        labels: ['Employees', 'Machinery'],
        datasets: [{
            data: [employeeCount, machineryCount],
            backgroundColor: ['#10B981', '#8B5CF6'],
            borderColor: ['#059669', '#6D28D9'],
            borderWidth: 2,
            hoverOffset: 4,
        }]
    };

    const projectData = {
        labels: ['Projects', 'Subcontractors'],
        datasets: [{
            label: 'Count',
            data: [projectCount, subcontractorCount],
            backgroundColor: ['#F59E0B', '#EC4899'],
            borderColor: ['#D97706', '#DB2777'],
            borderWidth: 2,
            borderRadius: 8,
            hoverOffset: 4,
        }]
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Resource Distribution</h3>
                <div className="relative h-[300px] w-full">
                    <Pie
                        data={resourceData}
                        options={{
                            maintainAspectRatio: false,
                            layout: {
                                padding: 20
                            },
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        padding: 20,
                                        font: {
                                            size: 14,
                                            weight: 'bold'
                                        },
                                        usePointStyle: true,
                                    }
                                },
                                tooltip: {
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    padding: 12,
                                    titleFont: {
                                        size: 14,
                                        weight: 'bold'
                                    },
                                    bodyFont: {
                                        size: 13
                                    },
                                    displayColors: true,
                                }
                            }
                        }}
                    />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Employees</p>
                        <p className="text-2xl font-bold text-green-600">{employeeCount}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Machinery</p>
                        <p className="text-2xl font-bold text-purple-600">{machineryCount}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Project Overview</h3>
                <div className="relative h-[300px] w-full">
                    <Bar
                        data={projectData}
                        options={{
                            maintainAspectRatio: false,
                            layout: {
                                padding: 20
                            },
                            plugins: {
                                legend: {
                                    display: false
                                },
                                tooltip: {
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    padding: 12,
                                    titleFont: {
                                        size: 14,
                                        weight: 'bold'
                                    },
                                    bodyFont: {
                                        size: 13
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        display: true,
                                        color: 'rgba(0,0,0,0.1)',
                                    },
                                    ticks: {
                                        font: {
                                            size: 12,
                                            weight: 'bold'
                                        }
                                    }
                                },
                                x: {
                                    grid: {
                                        display: false
                                    },
                                    ticks: {
                                        font: {
                                            size: 12,
                                            weight: 'bold'
                                        }
                                    }
                                }
                            }
                        }}
                    />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Projects</p>
                        <p className="text-2xl font-bold text-amber-600">{projectCount}</p>
                    </div>
                    <div className="text-center p-3 bg-pink-50 rounded-lg">
                        <p className="text-sm text-gray-600">Subcontractors</p>
                        <p className="text-2xl font-bold text-pink-600">{subcontractorCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeAndMachineryGraphs;