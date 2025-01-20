'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubCompanyReports } from '@/lib/store/features/subContractorSlice';
import { Star, Loader2, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, ClipboardX, AlertCircle } from 'lucide-react';
import { 
    Document, 
    Page, 
    Text, 
    View, 
    PDFDownloadLink, 
    StyleSheet, 
    Font 
} from '@react-pdf/renderer';

// Register fonts for PDF generation
Font.register({
    family: 'Roboto',
    fonts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
    ]
});

const Rating = ({ value }) => {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-5 w-5 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                        }`}
                />
            ))}
        </div>
    );
};

const StatCard = ({ title, value }) => (
    <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-sm text-gray-600">{title}</p>
        <div className="text-lg font-semibold mt-1">
            {typeof value === 'object' ? value : <span>{value}</span>}
        </div>
    </div>
);

const ComparisonBadge = ({ value, label }) => {
    const isPositive = value >= 0;
    return (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
            isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(value)}% {label}
        </div>
    );
};

// Add this new component for cost summary
const CostSummaryCard = ({ title, costs }) => (
    <div className="bg-white rounded-lg shadow p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">{title}</h4>
        <div className="space-y-2">
            {Object.entries(costs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-600">{key}:</span>
                    <span className={`font-semibold ${
                        key === 'Total' ? 'text-blue-600 text-lg' : 'text-gray-800'
                    }`}>
                        ${value.toFixed(2)}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

// Update the DetailedTable component to include totals
const DetailedTable = ({ data, type, itemsPerPage = 5 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    // Calculate totals
    const totals = data.reduce((acc, item) => ({
        projects: acc.projects + item.totalProjects,
        hours: acc.hours + item.totalWorkedHours,
        earnings: acc.earnings + item.totalEarnings,
    }), { projects: 0, hours: 0, earnings: 0 });

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((item) => (
                            <tr key={type === 'employee' ? item.employeeId : item.machineryId}>
                                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.totalProjects}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.totalWorkedHours}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${item.totalEarnings.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Rating value={item.averageRating} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Totals Row */}
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Total Projects</p>
                        <p className="text-lg font-semibold">{totals.projects}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Total Hours</p>
                        <p className="text-lg font-semibold">{totals.hours}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Total Earnings</p>
                        <p className="text-lg font-semibold text-blue-600">${totals.earnings.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

// Add this new component for the empty state
const EmptyState = () => (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <ClipboardX className="w-8 h-8 text-blue-600" /> {/* Import ClipboardX from lucide-react */}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h3>
        <p className="text-gray-500 max-w-sm mx-auto mb-6">
            There are no reports available for the selected time period. Reports are generated monthly based on company activity.
        </p>
        <div className="flex flex-col items-center gap-2 text-sm text-gray-600">
            <p>Try:</p>
            <ul className="list-disc text-left pl-4">
                <li>Selecting a different month</li>
                <li>Choosing another year</li>
                <li>Waiting for the next report generation cycle</li>
            </ul>
        </div>
    </div>
);

const Reports = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth?.user?.user);
    const { 
        subcompanyReports, 
        reportsLoading, 
        reportsError, 
        reportsPagination 
    } = useSelector(state => state.subContractor);
    const [filters, setFilters] = useState({
        month: '',
        year: new Date().getFullYear(),
        page: 1
    });

    useEffect(() => {
        if (user?._id) {
            dispatch(fetchSubCompanyReports({ 
                subContractorId: user?._id,
                month: filters.month || undefined, 
                year: filters.year,
                page: filters.page,
                limit: 10
            }));
        }
    }, [dispatch, user, filters]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= reportsPagination?.pages) {
            setFilters(prev => ({ ...prev, page: newPage }));
        }
    };

    const renderReportCard = (report) => {
        const totalCosts = {
            'Employee Earnings': report.employeeStats.reduce((sum, emp) => sum + emp.totalEarnings, 0),
            'Machinery Costs': report.machineryStats.reduce((sum, mach) => sum + mach.totalEarnings, 0),
            'Total': report.totalStats.totalRevenue
        };

        return (
            <div key={report._id} className="bg-white rounded-lg shadow-md mb-6">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        Report for {new Date(report.year, report.month - 1).toLocaleString('default', {
                            month: 'long',
                            year: 'numeric'
                        })}
                    </h2>
                    <div className="flex gap-3">
                        <ComparisonBadge 
                            value={report.monthlyComparison.revenueChange}
                            label="Revenue" 
                        />
                        <ComparisonBadge 
                            value={report.monthlyComparison.employeeChange}
                            label="Employees" 
                        />
                    </div>
                </div>

                <div className="p-4">
                    <div className="space-y-6">
                        {/* Add Cost Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <CostSummaryCard title="Cost Overview" costs={totalCosts} />
                            {/* ... existing StatCards ... */}
                        </div>

                        {/* Overall Statistics */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Overall Statistics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard title="Total Employees" value={report.totalStats.totalEmployees} />
                                <StatCard title="Total Machinery" value={report.totalStats.totalMachinery} />
                                <StatCard title="Total Projects" value={report.totalStats.totalProjects} />
                                <StatCard title="Total Revenue" value={`$${report.totalStats.totalRevenue.toFixed(2)}`} />
                                <StatCard title="Avg. Employee Rating" value={<Rating value={report.totalStats.averageEmployeeRating} />} />
                                <StatCard title="Avg. Machinery Rating" value={<Rating value={report.totalStats.averageMachineryRating} />} />
                            </div>
                        </div>

                        {/* Employee Statistics */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold">Employee Statistics</h3>
                                <PDFDownloadLink
                                    document={<EmployeeDetailsPDF data={report.employeeStats} month={report.month} year={report.year} />}
                                    fileName={`employee-details-${report.month}-${report.year}.pdf`}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {({ loading }) => (loading ? 'Preparing...' : 'Download Employee Details')}
                                </PDFDownloadLink>
                            </div>
                            <DetailedTable data={report.employeeStats} type="employee" />
                        </div>

                        {/* Machinery Statistics */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold">Machinery Statistics</h3>
                                <PDFDownloadLink
                                    document={<MachineryDetailsPDF data={report.machineryStats} month={report.month} year={report.year} />}
                                    fileName={`machinery-details-${report.month}-${report.year}.pdf`}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {({ loading }) => (loading ? 'Preparing...' : 'Download Machinery Details')}
                                </PDFDownloadLink>
                            </div>
                            <DetailedTable data={report.machineryStats} type="machinery" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Company Reports</h1>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <select
                        value={filters.month}
                        onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
                        className="w-full md:w-48 border rounded-md p-2 bg-white"
                    >
                        <option value="">All Months</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.year}
                        onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                        className="w-full md:w-48 border rounded-md p-2 bg-white"
                    >
                        {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            {/* Loading State */}
            {reportsLoading && (
                <div className="flex justify-center items-center py-12">
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <span className="mt-2 text-gray-600">Loading reports...</span>
                    </div>
                </div>
            )}

            {/* Error State */}
            {reportsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        <span>Error: {reportsError}</span>
                    </div>
                </div>
            )}

            {/* No Reports State */}
            {!reportsLoading && !reportsError && (!subcompanyReports || subcompanyReports.length === 0) && (
                <EmptyState />
            )}

            {/* Reports List */}
            {!reportsLoading && !reportsError && subcompanyReports && subcompanyReports.length > 0 && (
                <>
                    {subcompanyReports.map(renderReportCard)}
                    
                    {/* Pagination */}
                    {reportsPagination && (
                        <div className="flex justify-center gap-2 mt-6">
                            <button
                                onClick={() => handlePageChange(filters.page - 1)}
                                disabled={filters.page === 1}
                                className="flex items-center px-3 py-2 rounded bg-white border shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span className="ml-1">Previous</span>
                            </button>
                            <span className="flex items-center px-4">
                                Page {filters.page} of {reportsPagination.pages}
                            </span>
                            <button
                                onClick={() => handlePageChange(filters.page + 1)}
                                disabled={filters.page === reportsPagination.pages}
                                className="flex items-center px-3 py-2 rounded bg-white border shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                            >
                                <span className="mr-1">Next</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const EmployeeDetailsPDF = ({ data, month, year }) => {
    const totals = data.reduce((acc, item) => ({
        projects: acc.projects + item.totalProjects,
        hours: acc.hours + item.totalWorkedHours,
        earnings: acc.earnings + item.totalEarnings,
    }), { projects: 0, hours: 0, earnings: 0 });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Employee Details Report</Text>
                    <Text style={styles.subtitle}>
                        {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </Text>
                </View>

                {/* Summary Section */}
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Summary</Text>
                    <View style={styles.summaryGrid}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Total Projects</Text>
                            <Text style={styles.summaryValue}>{totals.projects}</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Total Hours</Text>
                            <Text style={styles.summaryValue}>{totals.hours}</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Total Earnings</Text>
                            <Text style={styles.summaryValue}>${totals.earnings.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Existing table code... */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
                        <Text style={styles.headerCell}>Projects</Text>
                        <Text style={styles.headerCell}>Hours</Text>
                        <Text style={styles.headerCell}>Earnings</Text>
                        <Text style={styles.headerCell}>Rating</Text>
                    </View>
                    {data.map((employee, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>{employee.name}</Text>
                            <Text style={styles.tableCell}>{employee.totalProjects}</Text>
                            <Text style={styles.tableCell}>{employee.totalWorkedHours}</Text>
                            <Text style={styles.tableCell}>${employee.totalEarnings.toFixed(2)}</Text>
                            <Text style={styles.tableCell}>{employee.averageRating.toFixed(1)}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

const MachineryDetailsPDF = ({ data, month, year }) => {
    const totals = data.reduce((acc, item) => ({
        projects: acc.projects + item.totalProjects,
        hours: acc.hours + item.totalWorkedHours,
        earnings: acc.earnings + item.totalEarnings,
    }), { projects: 0, hours: 0, earnings: 0 });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Machinery Details Report</Text>
                    <Text style={styles.subtitle}>
                        {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </Text>
                </View>

                {/* Summary Section */}
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Summary</Text>
                    <View style={styles.summaryGrid}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Total Projects</Text>
                            <Text style={styles.summaryValue}>{totals.projects}</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Total Hours</Text>
                            <Text style={styles.summaryValue}>{totals.hours}</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Total Earnings</Text>
                            <Text style={styles.summaryValue}>${totals.earnings.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
                        <Text style={styles.headerCell}>Projects</Text>
                        <Text style={styles.headerCell}>Hours</Text>
                        <Text style={styles.headerCell}>Earnings</Text>
                        <Text style={styles.headerCell}>Rating</Text>
                    </View>
                    {data.map((machine, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>{machine.name}</Text>
                            <Text style={styles.tableCell}>{machine.totalProjects}</Text>
                            <Text style={styles.tableCell}>{machine.totalWorkedHours}</Text>
                            <Text style={styles.tableCell}>${machine.totalEarnings.toFixed(2)}</Text>
                            <Text style={styles.tableCell}>{machine.averageRating.toFixed(1)}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: 20,
        padding: 10,
        borderBottom: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    table: {
        marginTop: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1e40af',
        padding: 12,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    headerCell: {
        flex: 1,
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#e2e8f0',
        padding: 10,
        backgroundColor: '#fff',
    },
    tableCell: {
        flex: 1,
        fontSize: 10,
        color: '#1e293b',
    },
    summaryContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f8fafc',
        borderRadius: 4,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1e40af',
    },
    summaryGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryItem: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 4,
        margin: 5,
    },
    summaryLabel: {
        fontSize: 10,
        color: '#64748b',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: '#e2e8f0',
    },
    footerText: {
        fontSize: 8,
        color: '#94a3b8',
    },
});

export default Reports;