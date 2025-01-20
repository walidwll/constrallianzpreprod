import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { SubCompanyReport, SubCompany } from '@/models/index.js';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const subContractorId = searchParams.get('subContractorId');
        const month = searchParams.get('month');
        const year = searchParams.get('year');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        if (!subContractorId) {
            return NextResponse.json(
                { message: 'SubContractor ID is required' }, 
                { status: 400 }
            );
        }

        // Find subcompany associated with the subcontractor
        const subCompany = await SubCompany.findOne({ subContractorId });
        if (!subCompany) {
            return NextResponse.json(
                { message: 'SubCompany not found' }, 
                { status: 404 }
            );
        }

        // Build query with proper type conversion
        const query = { 
            subCompanyId: subCompany._id,
            ...(month && { month: parseInt(month) }),
            ...(year && { year: parseInt(year) })
        };

        const skip = (page - 1) * limit;
        
        // Get total count
        const total = await SubCompanyReport.countDocuments(query);

        // Get reports with population and proper sorting
        const reports = await SubCompanyReport.find(query)
            .sort({ year: -1, month: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Process reports to add comparison data
        const processedReports = await Promise.all(reports.map(async (report) => {
            // Get previous month's report for comparison
            const previousMonth = report.month === 1 ? 12 : report.month - 1;
            const previousYear = report.month === 1 ? report.year - 1 : report.year;
            
            const previousReport = await SubCompanyReport.findOne({
                subCompanyId: subCompany._id,
                month: previousMonth,
                year: previousYear
            }).lean();

            // Calculate changes if previous report exists
            const monthlyComparison = previousReport ? {
                revenueChange: calculatePercentageChange(
                    previousReport.totalStats.totalRevenue,
                    report.totalStats.totalRevenue
                ),
                employeeChange: calculatePercentageChange(
                    previousReport.totalStats.totalEmployees,
                    report.totalStats.totalEmployees
                ),
                machineryChange: calculatePercentageChange(
                    previousReport.totalStats.totalMachinery,
                    report.totalStats.totalMachinery
                )
            } : {
                revenueChange: 0,
                employeeChange: 0,
                machineryChange: 0
            };

            return { ...report, monthlyComparison };
        }));

        return NextResponse.json({
            reports: processedReports,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                perPage: limit
            }
        });

    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json(
            { message: 'Error fetching reports', error: error.message },
            { status: 500 }
        );
    }
}

function calculatePercentageChange(previous, current) {
    if (!previous) return 0;
    return Number(((current - previous) / previous * 100).toFixed(2));
}

