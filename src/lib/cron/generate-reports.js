import mongoose from 'mongoose';
import connectDB from '@/lib/db.js';
import { Project, Employee, Report, SubCompany, Machinery } from '@/models/index.js';

async function calculateSubCompanyCosts(subCompanyId, projectId, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Get subcompany and its subcontractor
    const subCompany = await SubCompany.findById(subCompanyId);
    if (!subCompany) return null;

    // Get employees for this subCompany
    const employees = await Employee.find({ subCompanyId });

    // Get machinery through subcontractor
    const machinery = await Machinery.find({
        subContractorId: subCompany.subContractorId,
        projectId: projectId
    });

    let employeeDetails = [];
    let totalLabourCost = 0;
    let totalWorkedHours = 0;

    // Calculate employee costs
    for (const employee of employees) {
        const monthlyWorkEntries = employee.workedHoursDetails.filter(detail =>
            detail.projectId.equals(projectId) &&
            detail.timestamp >= startDate &&
            detail.timestamp <= endDate
        );

        const monthlyHours = monthlyWorkEntries.reduce((acc, detail) => acc + (detail.workedHours || 0), 0);
        const monthlyCost = monthlyWorkEntries.reduce((acc, detail) => {
            const rate = detail.hourlyRate || 0;
            return acc + ((detail.workedHours || 0) * rate);
        }, 0);

        if (monthlyHours > 0) {
            employeeDetails.push({
                employeeId: employee._id,
                name: employee.name,
                monthlyWorkedHours: monthlyHours,
                monthlyEarnings: monthlyCost,
                hourlyRate: monthlyCost / monthlyHours,
                cost: monthlyCost
            });

            totalLabourCost += monthlyCost;
            totalWorkedHours += monthlyHours;
        }
    }

    let machineryDetails = [];
    let totalMachineryCost = 0;

    // Calculate machinery costs
    for (const machine of machinery) {
        const monthlyCostEntries = machine.costDetails.filter(detail =>
            detail.projectId.equals(projectId) &&
            detail.timestamp >= startDate &&
            detail.timestamp <= endDate
        );

        const monthlyCost = monthlyCostEntries.reduce((acc, detail) => acc + (detail.cost || 0), 0);
        const monthlyHours = monthlyCostEntries.reduce((acc, detail) => acc + (detail.hours || 0), 0);

        if (monthlyCost > 0) {
            machineryDetails.push({
                machineryId: machine._id,
                name: machine.name,
                workedHours: monthlyHours,
                cost: monthlyCost
            });

            totalMachineryCost += monthlyCost;
        }
    }

    return {
        subCompanyId,
        subCompanyName: subCompany.name,
        employeeDetails,
        machineryDetails,
        totalLabourCost,
        totalMachineryCost,
        totalCost: totalLabourCost + totalMachineryCost,
        totalWorkedHours,
        totalEmployees: employeeDetails.length,
        averageHourlyRate: totalWorkedHours > 0 ? totalLabourCost / totalWorkedHours : 0
    };
}

async function generateMonthlyReports() {
    const currentDate = new Date();
    console.log(`Starting report generation at: ${currentDate.toLocaleString()}`);

    try {
        await connectDB();
        const previousMonth = new Date();
        previousMonth.setMonth(previousMonth.getMonth() - 1);
        const month = previousMonth.getMonth() + 1;
        const year = previousMonth.getFullYear();

        const projects = await Project.find({});

        for (const project of projects) {
            try {
                const existingReport = await Report.findOne({
                    projectId: project._id,
                    month,
                    year
                });

                if (existingReport) {
                    console.log(`Report exists for project ${project._id}`);
                    continue;
                }

                // Get all unique subCompanies involved in this project
                const employees = await Employee.find({
                    _id: { $in: project.employeesId }
                }).distinct('subCompanyId');

                const subCompanyReports = await Promise.all(
                    employees.map(subCompanyId =>
                        calculateSubCompanyCosts(subCompanyId, project._id, month, year)
                    )
                );

                // Filter out subCompanies with no activity
                const activeSubCompanyReports = subCompanyReports.filter(
                    report => report.totalCost > 0
                );

                const totalLabourCost = activeSubCompanyReports.reduce(
                    (sum, report) => sum + report.totalLabourCost, 0
                );
                const totalMachineryCost = activeSubCompanyReports.reduce(
                    (sum, report) => sum + report.totalMachineryCost, 0
                );
                const totalWorkedHours = activeSubCompanyReports.reduce(
                    (sum, report) => sum + report.totalWorkedHours, 0
                );
                const totalEmployees = activeSubCompanyReports.reduce(
                    (sum, report) => sum + report.totalEmployees, 0
                );

                const report = new Report({
                    projectId: project._id,
                    month,
                    year,
                    subCompanyReports: activeSubCompanyReports,
                    totalLabourCost,
                    totalMachineryCost,
                    totalCost: totalLabourCost + totalMachineryCost,
                    totalEmployees,
                    monthlyStats: {
                        totalWorkedHours,
                        averageHourlyRate: totalWorkedHours > 0
                            ? totalLabourCost / totalWorkedHours
                            : 0
                    }
                });

                await report.save();
                console.log(`Generated report for project ${project._id}`);

            } catch (error) {
                console.error(`Error processing project ${project._id}:`, error);
                continue;
            }
        }

        return { success: true, timestamp: currentDate };
    } catch (error) {
        console.error('Error in report generation:', error);
        return { success: false, error: error.message, timestamp: currentDate };
    }
}

export { generateMonthlyReports };