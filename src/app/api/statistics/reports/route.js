import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Report from '@/models/Report';
import Project from '@/models/Project';
import Company from '@/models/Company';
import mongoose from 'mongoose';
import profileCompany from '@/models/ProfileCompany';

export async function calculateRealTimeCosts(projectId) {
    try {
        const project = await Project.findById(projectId)
            .populate({
                path: 'employeesId',
                populate: {
                    path: 'projectDetails workedHoursDetails',
                }
            })
            .populate({
                path: 'machineryId',
                populate: {
                    path: 'costDetails',
                }
            });

        if (!project) {
            throw new Error('Project not found');
        }

        // Calculate employee costs - without date restrictions
        let totalLabourCost = 0;
        let totalWorkedHours = 0;
        let employeeDetails = [];

        if (project.employeesId && project.employeesId.length > 0) {
            for (const employee of project.employeesId) {
                const projectDetail = employee.projectDetails?.find(
                    detail => detail.projectId?.toString() === projectId.toString() && detail.isActive
                );

                if (!projectDetail) continue;

                // Get all work entries for this project
                const workEntries = employee.workedHoursDetails?.filter(entry =>
                    entry.projectId?.toString() === projectId.toString()
                ) || [];

                const employeeHours = workEntries.reduce((sum, entry) =>
                    sum + (Number(entry.workedHours) || 0), 0);

                const hourlyRate = Number(projectDetail.hourlyRate) || 0;
                const employeeCost = employeeHours * hourlyRate;

                if (employeeHours > 0) {
                    employeeDetails.push({
                        employeeId: employee._id,
                        name: employee.name,
                        totalWorkedHours: employeeHours,
                        hourlyRate: hourlyRate,
                        cost: employeeCost
                    });

                    totalWorkedHours += employeeHours;
                    totalLabourCost += employeeCost;
                }
            }
        }

        // Calculate machinery costs
        let totalMachineryCost = 0;
        let machineryDetails = [];

        if (project.machineryId && project.machineryId.length > 0) {
            for (const machinery of project.machineryId) {
                // Find the cost detail for this project
                const projectCostDetail = machinery.costDetails?.find(
                    detail => detail.projectId?.toString() === projectId.toString()
                );

                if (!projectCostDetail) continue;

                // Use machinery's hourly rate
                const hourlyRate = Number(machinery.hourlyRate) || 0;

                // Calculate total hours from work history
                const machineHours = projectCostDetail.workHistory?.reduce((sum, entry) => {
                    return sum + (Number(entry.hours) || 0);
                }, 0) || 0;

                // Calculate cost
                const machineCost = machineHours * hourlyRate;

                if (machineHours > 0) {
                    machineryDetails.push({
                        machineryId: machinery._id,
                        name: machinery.name,
                        totalWorkedHours: machineHours,
                        hourlyRate: hourlyRate,
                        cost: Number(machineCost.toFixed(2)),
                        isActive: projectCostDetail.isActive,
                        totalHours: projectCostDetail.totalHours || 0
                    });

                    totalMachineryCost += machineCost;
                }
            }
        }

        // Calculate hours for the past 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        let totalWorkedHoursLast30Days = 0;

        // Calculate employee hours for past 30 days
        if (project.employeesId && project.employeesId.length > 0) {
            for (const employee of project.employeesId) {
                const workEntries = employee.workedHoursDetails?.filter(entry =>
                    entry.projectId?.toString() === projectId.toString() &&
                    new Date(entry.timestamp) >= thirtyDaysAgo
                ) || [];

                const employeeHours = workEntries.reduce((sum, entry) =>
                    sum + (Number(entry.workedHours) || 0), 0);

                totalWorkedHoursLast30Days += employeeHours;
            }
        }

        // Calculate machinery hours for past 30 days
        if (project.machineryId && project.machineryId.length > 0) {
            for (const machinery of project.machineryId) {
                const projectCostDetail = machinery.costDetails?.find(
                    detail => detail.projectId?.toString() === projectId.toString()
                );

                if (projectCostDetail) {
                    const recentWorkHistory = projectCostDetail.workHistory?.filter(
                        entry => new Date(entry.date) >= thirtyDaysAgo
                    ) || [];

                    const machineHours = recentWorkHistory.reduce((sum, entry) =>
                        sum + (Number(entry.hours) || 0), 0);

                    totalWorkedHoursLast30Days += machineHours;
                }
            }
        }

        // Ensure precise calculations with 2 decimal places
        totalMachineryCost = Number(totalMachineryCost.toFixed(2));
        totalLabourCost = Number(totalLabourCost.toFixed(2));
        const totalCost = Number((totalLabourCost + totalMachineryCost).toFixed(2));
        const averageHourlyRate = totalWorkedHours > 0
            ? Number((totalLabourCost / totalWorkedHours).toFixed(2))
            : 0;

        return {
            totalCost,
            totalLabourCost,
            totalMachineryCost,
            totalWorkedHours: totalWorkedHoursLast30Days,
            totalWorkedHours: totalWorkedHours,
            averageHourlyRate,
            employeeCount: employeeDetails.length,
            employeeDetails,
            machineryDetails,
            calculatedAt: new Date()
        };
    } catch (error) {
        console.error(`Error calculating costs for project ${projectId}:`, error);
        throw error;
    }
}

export async function GET(request) {
    try {
        await connectDB();

        const url = new URL(request.url);
        const contractorId = url.searchParams.get('contractorId');
        const month = url.searchParams.get('month');
        const year = url.searchParams.get('year');
        const search = url.searchParams.get('search');

        if (!contractorId) {
            return NextResponse.json({ message: 'Contractor ID is required' }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(contractorId)) {
            return NextResponse.json({ message: 'Invalid Contractor ID format' }, { status: 400 });
        }

        const profile = await profileCompany.findById(contractorId);
        if (!profile) {
            return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
        }

        const company = await Company.findOne({ profils: contractorId });
        if (!company || !company._id) {
            return NextResponse.json({ message: 'Company not found or invalid ID' }, { status: 404 });
        }

        const companyId = company._id;

        // First find projects matching the search term
        let projectQuery = { companyId: companyId };
        if (search) {
            projectQuery.name = { $regex: search, $options: 'i' };
        }

        const projects = await Project.find(projectQuery);
        const projectIds = projects.map(project => project._id);

        let reportQuery = { projectId: { $in: projectIds } };

        if (month && month !== 'all') {
            const monthNumber = parseInt(month);
            if (!isNaN(monthNumber)) {
                reportQuery.month = monthNumber;
            } else {
                return NextResponse.json({ message: 'Invalid month provided' }, { status: 400 });
            }
        }

        if (year && year !== 'all') {
            reportQuery.year = parseInt(year);
        }

        const reports = await Report.find(reportQuery)
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
                        model: 'Machinery'
                    }
                ]
            });

        // Add real-time costs to each report
        const reportsWithRealTime = await Promise.all(
            reports.map(async (report) => {
                try {
                    const realTimeCosts = await calculateRealTimeCosts(report.projectId._id);
                    return {
                        ...report.toObject(),
                        realTimeCosts,
                        projectTotalCost: report.totalCost + realTimeCosts.totalCost
                    };
                } catch (error) {
                    console.error(`Error processing report for project ${report.projectId._id}:`, error);
                    return report.toObject();
                }
            })
        );

        return NextResponse.json({
            data: reportsWithRealTime,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json(
            { message: 'Error fetching reports', error: error.message },
            { status: 500 }
        );
    }
}

export async function OPTIONS(request) {
    return NextResponse.json({}, { status: 200 });
}