'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReports } from '@/lib/store/features/contractorSlice';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { PageLoader } from '@/components/LoadingComponent';
import debounce from 'lodash.debounce';

Font.register({
    family: 'Roboto',
    fonts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
    ]
});

const SubCompanyReportSection = ({ subCompanyReport }) => (
    <View style={styles.subCompanySection}>
        <Text style={styles.subCompanyTitle}>{subCompanyReport.subCompanyName}</Text>

        {/* SubCompany Summary */}
        <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Labour Cost:</Text>
                <Text style={styles.summaryValue}>${subCompanyReport.totalLabourCost.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Machinery Cost:</Text>
                <Text style={styles.summaryValue}>${subCompanyReport.totalMachineryCost.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Cost:</Text>
                <Text style={styles.summaryValue}>${subCompanyReport.totalCost.toFixed(2)}</Text>
            </View>
        </View>

        {/* Employee Details */}
        {subCompanyReport.employeeDetails.length > 0 && (
            <View style={styles.tableSection}>
                <Text style={styles.tableTitle}>Employee Details</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
                        <Text style={styles.headerCell}>Hours</Text>
                        <Text style={styles.headerCell}>Rate</Text>
                        <Text style={styles.headerCell}>Total</Text>
                    </View>
                    {subCompanyReport.employeeDetails.map((emp, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>{emp.name}</Text>
                            <Text style={styles.tableCell}>{emp.monthlyWorkedHours}</Text>
                            <Text style={styles.tableCell}>${emp.hourlyRate.toFixed(2)}</Text>
                            <Text style={styles.tableCell}>${emp.cost.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>
            </View>
        )}

        {/* Machinery Details */}
        {subCompanyReport.machineryDetails.length > 0 && (
            <View style={styles.tableSection}>
                <Text style={styles.tableTitle}>Machinery Details</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
                        <Text style={styles.headerCell}>Hours</Text>
                        <Text style={styles.headerCell}>Cost</Text>
                    </View>
                    {subCompanyReport.machineryDetails.map((machine, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>{machine.name}</Text>
                            <Text style={styles.tableCell}>{machine.workedHours}</Text>
                            <Text style={styles.tableCell}>${machine.cost.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>
            </View>
        )}
    </View>
);

export const ReportPDF = ({ report }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.headerRight}>
                    <Text style={styles.date}>Report Generated: {new Date().toLocaleDateString()}</Text>
                    <Text style={styles.period}>Period: {report.month}/{report.year}</Text>
                </View>
            </View>

            {/* Project Info */}
            <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{report.projectId.name}</Text>
                <View style={styles.projectStats}>
                    <Text>Progress: {((report.projectId.completedHours / (report.projectId.totalHours || 1)) * 100).toFixed(1)}%</Text>
                    <Text>Total Hours: {report.projectId.totalHours || 0}</Text>
                </View>
            </View>

            {/* Project Overview */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Project Overview</Text>
                <View style={styles.infoGrid}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Project Status:</Text>
                        <Text style={styles.value}>{report.projectId.isCompleted ? 'Completed' : 'In Progress'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Budget:</Text>
                        <Text style={styles.value}>${report.projectId.budget?.toFixed(2) || 0}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Progress:</Text>
                        <Text style={styles.value}>
                            {((report.projectId.completedHours / (report.projectId.totalHours || 1)) * 100).toFixed(1)}%
                        </Text>
                    </View>
                </View>
            </View>

            {/* Cost Summary */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cost Summary</Text>
                <View style={styles.costGrid}>
                    <View style={styles.costCard}>
                        <Text style={styles.cardTitle}>Real-Time Costs</Text>
                        <View style={styles.costRow}>
                            <Text>Labour:</Text>
                            <Text>${report.realTimeCosts?.totalLabourCost?.toFixed(2) || 0}</Text>
                        </View>
                        <View style={styles.costRow}>
                            <Text>Machinery:</Text>
                            <Text>${report.realTimeCosts?.totalMachineryCost?.toFixed(2) || 0}</Text>
                        </View>
                        <View style={[styles.costRow, styles.totalRow]}>
                            <Text>Total:</Text>
                            <Text>${report.realTimeCosts?.totalCost?.toFixed(2) || 0}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Cost Summary Table */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Financial Summary</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableCell, { flex: 2 }]}>Category</Text>
                        <Text style={styles.tableCell}>Real-Time</Text>
                        <Text style={styles.tableCell}>Monthly</Text>
                        <Text style={styles.tableCell}>Total</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 2 }]}>Labour Cost</Text>
                        <Text style={styles.tableCell}>${report.realTimeCosts?.totalLabourCost?.toFixed(2) || 0}</Text>
                        <Text style={styles.tableCell}>${report.totalLabourCost?.toFixed(2) || 0}</Text>
                        <Text style={styles.tableCell}>${report.projectTotalCost?.toFixed(2) || 0}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 2 }]}>Machinery Cost</Text>
                        <Text style={styles.tableCell}>${report.realTimeCosts?.totalMachineryCost?.toFixed(2) || 0}</Text>
                        <Text style={styles.tableCell}>${report.totalMachineryCost?.toFixed(2) || 0}</Text>
                        <Text style={styles.tableCell}>${report.totalCost?.toFixed(2) || 0}</Text>
                    </View>
                </View>
            </View>

            {/* Monthly Statistics */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Monthly Statistics</Text>
                <View style={styles.statsTable}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Total Hours Worked</Text>
                        <Text style={styles.tableCell}>{report.monthlyStats?.totalWorkedHours || 0}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Average Hourly Rate</Text>
                        <Text style={styles.tableCell}>${report.monthlyStats?.averageHourlyRate?.toFixed(2) || 0}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Total Labour Cost</Text>
                        <Text style={styles.tableCell}>${report.totalLabourCost?.toFixed(2) || 0}</Text>
                    </View>
                </View>
            </View>

            {/* Employee Summary */}
            {report.employeeDetails?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Employee Details</Text>
                    <View style={styles.employeeTable}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.headerCell}>Name</Text>
                            <Text style={styles.headerCell}>Hours</Text>
                            <Text style={styles.headerCell}>Rate</Text>
                            <Text style={styles.headerCell}>Total</Text>
                        </View>
                        {report.employeeDetails.map((emp, idx) => (
                            <View key={idx} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{emp.name}</Text>
                                <Text style={styles.tableCell}>{emp.monthlyWorkedHours}</Text>
                                <Text style={styles.tableCell}>${emp.hourlyRate}</Text>
                                <Text style={styles.tableCell}>${emp.monthlyEarnings?.toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Machinery Details Table */}
            {report.machineryDetails?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Machinery Details</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Name</Text>
                            <Text style={styles.tableCell}>Hours</Text>
                            <Text style={styles.tableCell}>Cost</Text>
                            <Text style={styles.tableCell}>Status</Text>
                        </View>
                        {report.machineryDetails.map((machine, idx) => (
                            <View key={idx} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { flex: 2 }]}>{machine.name}</Text>
                                <Text style={styles.tableCell}>{machine.workedHours || 'N/A'}</Text>
                                <Text style={styles.tableCell}>${machine.cost?.toFixed(2) || 0}</Text>
                                <Text style={styles.tableCell}>{machine.status ? 'Active' : 'Inactive'}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* SubCompany Reports */}
            {report.subCompanyReports?.map((subCompanyReport, index) => (
                <SubCompanyReportSection key={index} subCompanyReport={subCompanyReport} />
            ))}

            {/* Summary Footer */}
            <View style={styles.summarySection}>
                <Text style={styles.summaryTitle}>Project Summary</Text>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Project Cost:</Text>
                    <Text style={styles.summaryValue}>${report.projectTotalCost?.toFixed(2) || 0}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Hours:</Text>
                    <Text style={styles.summaryValue}>{report.projectId.totalHours || 0}</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Page 1 of 1</Text>
                <Text style={styles.footerText}>Generated by Site Management System</Text>
            </View>
        </Page>
    </Document>
);

export const SubCompanyReportPDF = ({ report, subCompanyReport }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.headerRight}>
                    <Text style={styles.date}>Report Generated: {new Date().toLocaleDateString()}</Text>
                    <Text style={styles.period}>Period: {report.month}/{report.year}</Text>
                </View>
            </View>

            {/* SubCompany Header */}
            <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{subCompanyReport.subCompanyName}</Text>
                <Text style={styles.projectSubtitle}>Project: {report.projectId.name}</Text>
            </View>

            {/* Cost Summary */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cost Summary</Text>
                <View style={styles.summaryBox}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Labour Cost:</Text>
                        <Text style={styles.summaryValue}>${subCompanyReport.totalLabourCost.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Machinery Cost:</Text>
                        <Text style={styles.summaryValue}>${subCompanyReport.totalMachineryCost.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Cost:</Text>
                        <Text style={styles.summaryValue}>${subCompanyReport.totalCost.toFixed(2)}</Text>
                    </View>
                </View>
            </View>

            {/* Employee Details */}
            {subCompanyReport.employeeDetails.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Employee Details</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
                            <Text style={styles.headerCell}>Hours</Text>
                            <Text style={styles.headerCell}>Rate</Text>
                            <Text style={styles.headerCell}>Total</Text>
                        </View>
                        {subCompanyReport.employeeDetails.map((emp, idx) => (
                            <View key={idx} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { flex: 2 }]}>{emp.name}</Text>
                                <Text style={styles.tableCell}>{emp.monthlyWorkedHours}</Text>
                                <Text style={styles.tableCell}>${emp.hourlyRate.toFixed(2)}</Text>
                                <Text style={styles.tableCell}>${emp.cost.toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Machinery Details */}
            {subCompanyReport.machineryDetails.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Machinery Details</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
                            <Text style={styles.headerCell}>Hours</Text>
                            <Text style={styles.headerCell}>Cost</Text>
                        </View>
                        {subCompanyReport.machineryDetails.map((machine, idx) => (
                            <View key={idx} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { flex: 2 }]}>{machine.name}</Text>
                                <Text style={styles.tableCell}>{machine.workedHours}</Text>
                                <Text style={styles.tableCell}>${machine.cost.toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Generated by Site Management System</Text>
            </View>
        </Page>
    </Document>
);

// Replace the existing AllReportsPDF component with this enhanced version
export const AllReportsPDF = ({ reports }) => (
    <Document>
        {reports.map((report, index) => (
            <Page key={index} size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <View style={styles.headerRight}>
                        <Text style={styles.date}>Report Generated: {new Date().toLocaleDateString()}</Text>
                        <Text style={styles.period}>Period: {report.month}/{report.year}</Text>
                    </View>
                </View>

                {/* Project Info and Overview - Same as ReportPDF */}
                <View style={styles.projectHeader}>
                    <Text style={styles.projectName}>{report.projectId.name}</Text>
                    <View style={styles.projectStats}>
                        <Text>Progress: {((report.projectId.completedHours / (report.projectId.totalHours || 1)) * 100).toFixed(1)}%</Text>
                        <Text>Total Hours: {report.projectId.totalHours || 0}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Project Overview</Text>
                    <View style={styles.infoGrid}>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Project Status:</Text>
                            <Text style={styles.value}>{report.projectId.isCompleted ? 'Completed' : 'In Progress'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Budget:</Text>
                            <Text style={styles.value}>${report.projectId.budget?.toFixed(2) || 0}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Progress:</Text>
                            <Text style={styles.value}>
                                {((report.projectId.completedHours / (report.projectId.totalHours || 1)) * 100).toFixed(1)}%
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Financial Summaries */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Financial Summary</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Category</Text>
                            <Text style={styles.tableCell}>Real-Time</Text>
                            <Text style={styles.tableCell}>Monthly</Text>
                            <Text style={styles.tableCell}>Total</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Labour Cost</Text>
                            <Text style={styles.tableCell}>${report.realTimeCosts?.totalLabourCost?.toFixed(2) || 0}</Text>
                            <Text style={styles.tableCell}>${report.totalLabourCost?.toFixed(2) || 0}</Text>
                            <Text style={styles.tableCell}>${report.projectTotalCost?.toFixed(2) || 0}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Machinery Cost</Text>
                            <Text style={styles.tableCell}>${report.realTimeCosts?.totalMachineryCost?.toFixed(2) || 0}</Text>
                            <Text style={styles.tableCell}>${report.totalMachineryCost?.toFixed(2) || 0}</Text>
                            <Text style={styles.tableCell}>${report.totalCost?.toFixed(2) || 0}</Text>
                        </View>
                    </View>
                </View>

                {/* Monthly Statistics */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Monthly Statistics</Text>
                    <View style={styles.statsTable}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Total Hours Worked</Text>
                            <Text style={styles.tableCell}>{report.monthlyStats?.totalWorkedHours || 0}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Average Hourly Rate</Text>
                            <Text style={styles.tableCell}>${report.monthlyStats?.averageHourlyRate?.toFixed(2) || 0}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Total Labour Cost</Text>
                            <Text style={styles.tableCell}>${report.totalLabourCost?.toFixed(2) || 0}</Text>
                        </View>
                    </View>
                </View>

                {/* Employee Details */}
                {report.employeeDetails?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Employee Details</Text>
                        <View style={styles.employeeTable}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.headerCell}>Name</Text>
                                <Text style={styles.headerCell}>Hours</Text>
                                <Text style={styles.headerCell}>Rate</Text>
                                <Text style={styles.headerCell}>Total</Text>
                            </View>
                            {report.employeeDetails.map((emp, idx) => (
                                <View key={idx} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{emp.name}</Text>
                                    <Text style={styles.tableCell}>{emp.monthlyWorkedHours}</Text>
                                    <Text style={styles.tableCell}>${emp.hourlyRate}</Text>
                                    <Text style={styles.tableCell}>${emp.monthlyEarnings?.toFixed(2)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Machinery Details */}
                {report.machineryDetails?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Machinery Details</Text>
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableCell, { flex: 2 }]}>Name</Text>
                                <Text style={styles.tableCell}>Hours</Text>
                                <Text style={styles.tableCell}>Cost</Text>
                                <Text style={styles.tableCell}>Status</Text>
                            </View>
                            {report.machineryDetails.map((machine, idx) => (
                                <View key={idx} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { flex: 2 }]}>{machine.name}</Text>
                                    <Text style={styles.tableCell}>{machine.workedHours || 'N/A'}</Text>
                                    <Text style={styles.tableCell}>${machine.cost?.toFixed(2) || 0}</Text>
                                    <Text style={styles.tableCell}>{machine.status ? 'Active' : 'Inactive'}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* SubCompany Reports */}
                {report.subCompanyReports?.map((subCompanyReport, index) => (
                    <SubCompanyReportSection key={index} subCompanyReport={subCompanyReport} />
                ))}

                {/* Summary Footer */}
                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>Project Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Project Cost:</Text>
                        <Text style={styles.summaryValue}>${report.projectTotalCost?.toFixed(2) || 0}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Hours:</Text>
                        <Text style={styles.summaryValue}>{report.projectId.totalHours || 0}</Text>
                    </View>
                </View>

                {/* Page Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Page {index + 1} of {reports.length}</Text>
                    <Text style={styles.footerText}>Generated by Site Management System</Text>
                </View>
            </Page>
        ))}
    </Document>
);

export default function Reports() {
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user?.user);
    const { reports, loading, error } = useSelector(state => state?.contractor);
    const years = Array.from({ length: 5 }, (_, i) =>
        (new Date().getFullYear() - i).toString()
    );
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

    const handleSearch = () => {
        if (user) {
            dispatch(fetchReports({
                contractorId: user?._id,
                month: selectedMonth === 'all' ? '' : selectedMonth,
                year: selectedYear === 'all' ? '' : selectedYear,
                search: searchTerm
            }));
        }
    };

    useEffect(() => {
        if (user) {
            dispatch(fetchReports({
                contractorId: user?._id,
                month: selectedMonth === 'all' ? '' : selectedMonth,
                year: selectedYear === 'all' ? '' : selectedYear,
                search: ''
            }));
        }
    }, [selectedMonth, selectedYear, dispatch, user?._id]);

    if (loading) return (
        <PageLoader />
    );

    if (error) return <div>Error: {error}</div>;

    // Ensure reports is an array
    const reportsData = Array.isArray(reports?.data) ? reports.data : [];

    // Convert selectedMonth to month name for display
    const selectedMonthName = months.find(m => m.value.toString() === selectedMonth)?.name || 'All Months';

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <h1 className="text-3xl font-bold text-gray-800">Monthly Reports</h1>
                            {reportsData.length > 0 && (
                                <PDFDownloadLink
                                    document={<AllReportsPDF reports={reportsData} />}
                                    fileName={`all-reports-${selectedYear}-${selectedMonth}.pdf`}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    {({ blob, url, loading, error }) =>
                                        loading ? 'Preparing download...' : 'Download All'
                                    }
                                </PDFDownloadLink>
                            )}
                        </div>

                        {/* Enhanced Filters */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Search by project name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-4 py-2 border rounded-lg bg-white shadow-sm hover:border-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Search
                                </button>
                            </div>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="px-4 py-2 border rounded-lg bg-white shadow-sm hover:border-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {months.map((month, index) => (
                                    <option key={index} value={month.value}>{month.name}</option>
                                ))}
                            </select>

                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="px-4 py-2 border rounded-lg bg-white shadow-sm hover:border-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Years</option>
                                {years.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Reports Grid */}
                <div className="grid gap-8">
                    {reportsData.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-xl text-gray-600">No reports found for the selected filters</p>
                        </div>
                    ) : (
                        reportsData.map((report, index) => (
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

                                {/* Progress Section - Fixed Overflow */}
                                <div className="p-6 border-b">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                        <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent overflow */}
                                            <h3 className="text-lg font-semibold text-gray-800 truncate">Project Progress</h3>
                                            <p className="text-sm text-gray-500">Total Hours: {report.projectId.totalHours || 0}</p>
                                        </div>
                                        <div className="text-right shrink-0"> {/* Added shrink-0 to prevent shrinking */}
                                            <span className="text-2xl font-bold text-blue-600">
                                                {((report.projectId.completedHours / (report.projectId.totalHours || 1)) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden"> {/* Added overflow-hidden */}
                                        <div
                                            className="absolute left-0 top-0 h-full bg-blue-600 rounded-full transition-all duration-300"
                                            style={{ width: `${Math.min((report.projectId.completedHours / (report.projectId.totalHours || 1)) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Cost Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
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

                                    {/* Add Monthly Stats and Project Totals with similar styling */}
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
                                            <p>Employees: {report.totalEmployees}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Sections */}
                                {report.employeeDetails?.length > 0 && (
                                    <div className="p-6 border-t space-y-6">
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold text-gray-800">Employee Details</h3>
                                                <span className="text-sm text-gray-500">
                                                    Total Employees: {report.employeeDetails.length}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {report.employeeDetails.map((emp, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <span className="text-blue-600 font-semibold">
                                                                    {emp.name.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{emp.name}</p>
                                                                <p className="text-sm text-gray-500">Employee</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600">Hours Worked</span>
                                                                <span className="font-medium">{emp.monthlyWorkedHours}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600">Hourly Rate</span>
                                                                <span className="font-medium">${emp.hourlyRate}/hr</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm pt-2 border-t">
                                                                <span className="text-gray-600">Total Earnings</span>
                                                                <span className="font-semibold text-blue-600">
                                                                    ${emp.monthlyEarnings?.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SubCompany Reports Sections */}
                                {report.subCompanyReports?.map((subCompany, scIndex) => (
                                    <div key={scIndex} className="p-6 border-t">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-semibold text-blue-900">
                                                {subCompany.subCompanyName}
                                            </h3>
                                            <PDFDownloadLink
                                                document={<SubCompanyReportPDF report={report} subCompanyReport={subCompany} />}
                                                fileName={`${subCompany.subCompanyName}-${report.month}-${report.year}.pdf`}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                {({ blob, url, loading, error }) =>
                                                    loading ? 'Preparing...' : 'Download SubCompany Report'
                                                }
                                            </PDFDownloadLink>
                                        </div>

                                        {/* Rest of the existing SubCompany section content */}
                                        <h3 className="text-xl font-semibold text-blue-900 mb-4">
                                            {subCompany.subCompanyName}
                                        </h3>

                                        {/* SubCompany Summary */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <p className="text-sm text-blue-600">Labour Cost</p>
                                                <p className="text-lg font-semibold">
                                                    ${subCompany.totalLabourCost.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <p className="text-sm text-green-600">Machinery Cost</p>
                                                <p className="text-lg font-semibold">
                                                    ${subCompany.totalMachineryCost.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="bg-purple-50 p-4 rounded-lg">
                                                <p className="text-sm text-purple-600">Total Cost</p>
                                                <p className="text-lg font-semibold">
                                                    ${subCompany.totalCost.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Employee Details */}
                                        {subCompany.employeeDetails.length > 0 && (
                                            <div className="mt-6">
                                                <h4 className="text-lg font-semibold mb-3">Employee Details</h4>
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Name
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Hours
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Rate
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Total Cost
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {subCompany.employeeDetails.map((employee, empIdx) => (
                                                                <tr key={empIdx} className={empIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                        {employee.name}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {employee.monthlyWorkedHours}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        ${employee.hourlyRate.toFixed(2)}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        ${employee.cost.toFixed(2)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* Machinery Details */}
                                        {subCompany.machineryDetails.length > 0 && (
                                            <div className="mt-6">
                                                <h4 className="text-lg font-semibold mb-3">Machinery Details</h4>
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Name
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Hours
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Cost
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {subCompany.machineryDetails.map((machine, machIdx) => (
                                                                <tr key={machIdx} className={machIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                        {machine.name}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {machine.workedHours}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        ${machine.cost.toFixed(2)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#333',
        backgroundColor: '#fff'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        borderBottom: 2,
        borderColor: '#2563eb',
        paddingBottom: 20
    },
    headerLeft: { flex: 1 },
    headerRight: { textAlign: 'right' },
    companyName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: 5
    },
    reportType: {
        fontSize: 16,
        color: '#64748b'
    },
    projectHeader: {
        marginBottom: 30,
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 4
    },
    projectName: {
        fontSize: 20,
        fontWeight: 'medium',
        marginBottom: 10
    },
    section: {
        marginBottom: 25,
        padding: 15,
        backgroundColor: '#fff',
        border: 1,
        borderColor: '#e2e8f0',
        borderRadius: 4
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'medium',
        marginBottom: 15,
        color: '#1e40af'
    },
    costGrid: {
        flexDirection: 'row',
        gap: 20
    },
    costCard: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f8fafc',
        borderRadius: 4
    },
    costRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderColor: '#e2e8f0'
    },
    totalRow: {
        marginTop: 10,
        borderTopWidth: 2,
        borderColor: '#2563eb',
        fontWeight: 'bold'
    },
    statsTable: {
        width: '100%'
    },
    employeeTable: {
        width: '100%'
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        padding: 8,
        fontWeight: 'bold'
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold'
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#e2e8f0',
        padding: 8
    },
    tableCell: {
        flex: 1
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        color: '#94a3b8',
        borderTopWidth: 1,
        borderColor: '#e2e8f0',
        paddingTop: 10
    },
    table: {
        width: '100%',
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        borderBottomWidth: 1,
        borderColor: '#2563eb',
        padding: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#e2e8f0',
        padding: 8,
    },
    tableCell: {
        flex: 1,
        fontSize: 10,
        padding: 4,
    },
    infoGrid: {
        marginTop: 10,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        flex: 1,
        fontWeight: 'medium',
        color: '#64748b',
    },
    value: {
        flex: 2,
        color: '#0f172a',
    },
    summarySection: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f8fafc',
        borderRadius: 4,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    summaryLabel: {
        fontWeight: 'medium',
        color: '#64748b',
    },
    summaryValue: {
        fontWeight: 'bold',
        color: '#0f172a',
    },
    subCompanySection: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f8fafc',
        borderRadius: 4,
        marginBottom: 15,
    },
    subCompanyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 10,
        borderBottom: 1,
        borderColor: '#2563eb',
        paddingBottom: 5,
    },
    summaryBox: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 4,
        marginBottom: 10,
    },
    tableSection: {
        marginTop: 10,
    },
    tableTitle: {
        fontSize: 14,
        fontWeight: 'medium',
        color: '#475569',
        marginBottom: 5,
    },
    projectSubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 5,
    },
});
