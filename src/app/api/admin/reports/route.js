import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { calculateRealTimeCosts } from '../../statistics/reports/route';
import { Project, Report } from '@/models';


export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET(request) {
    try {
        try {
            await connectDB();
        } catch (dbError) {
            console.error('Database connection error:', dbError);
            return NextResponse.json({
                message: 'Database connection failed',
                error: dbError.message,
                stack: process.env.NODE_ENV === 'development' ? dbError.stack : undefined
            }, { status: 500 });
        }

        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page')) || 1;
        const limit = parseInt(url.searchParams.get('limit')) || 5;
        const month = url.searchParams.get('month');
        const year = url.searchParams.get('year');
        const search = url.searchParams.get('search');

        let query = {};

        if (month && month !== 'all') {
            query.month = parseInt(month);
        }

        if (year && year !== 'all') {
            query.year = parseInt(year);
        }

        let projectIds = [];
        if (search) {
            const matchingProjects = await Project.find({
                name: { $regex: search, $options: 'i' }
            });
            projectIds = matchingProjects.map(project => project._id);
            query.projectId = { $in: projectIds };
        }

        // Verify model registration
        const models = {
            Report: mongoose.models.Report,
            Project: mongoose.models.Project,
            SubContractor: mongoose.models.SubContractor,
            Employee: mongoose.models.Employee
        };

        // Check if any model is missing
        const missingModels = Object.entries(models)
            .filter(([, model]) => !model)
            .map(([name]) => name);

        if (missingModels.length > 0) {
            return NextResponse.json({
                message: 'Model registration error',
                error: `Missing models: ${missingModels.join(', ')}`,
                mongooseModels: Object.keys(mongoose.models)
            }, { status: 500 });
        }

        // Get total count for pagination
        const total = await Report.countDocuments(query);
        const totalPages = Math.ceil(total / limit);
        const skip = (page - 1) * limit;

        // Get paginated reports with population
        const reports = await Report.find(query)
            .populate('projectId')
            .populate({
                path: 'subCompanyReports',
                populate: [
                    {
                        path: 'subCompanyId',
                        populate: {
                            path: 'subContractorId',
                            model: 'SubContractor'
                        }
                    },
                    {
                        path: 'employeeDetails.employeeId',
                        model: 'Employee'
                    },
                    {
                        path: 'machineryDetails.machineryId',
                        populate: {
                            path: 'subContractorId',
                            model: 'SubContractor'
                        }
                    }
                ]
            })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Add real-time cost calculation
        const reportsWithRealTime = await Promise.all(reports.map(async (report) => {
            const realTimeCosts = await calculateRealTimeCosts(report.projectId._id);
            return {
                ...report.toObject(),
                realTimeCosts,
                projectTotalCost: report.totalCost + (realTimeCosts?.totalCost || 0)
            };
        }));

        return NextResponse.json({
            data: reportsWithRealTime,
            pagination: {
                currentPage: page,
                totalPages,
                totalReports: total,
                limit
            },
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Detailed error in admin reports:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            mongooseModels: Object.keys(mongoose.models),
            mongooseConnectionState: mongoose.connection.readyState
        });

        return NextResponse.json({
            message: 'Error fetching reports',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            mongooseState: {
                connectionState: mongoose.connection.readyState,
                models: Object.keys(mongoose.models)
            }
        }, { status: 500 });
    }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
    return NextResponse.json({}, {
        status: 200,
        headers: {
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}

export async function POST() {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}