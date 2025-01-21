import connectDB from '../db.js';
import { SubCompany, Employee, Machinery, SubCompanyReport } from '../../models/index.js';

// Add this helper function at the top
function calculateAverageRating(ratings, fields) {
    if (!ratings || !Array.isArray(ratings) || ratings.length === 0) {
        return 0;
    }

    const validRatings = ratings.filter(rating => 
        fields.every(field => typeof rating[field] === 'number' && !isNaN(rating[field]))
    );

    if (validRatings.length === 0) {
        return 0;
    }

    return validRatings.reduce((sum, rating) => {
        const fieldAverage = fields.reduce((fieldSum, field) => {
            return fieldSum + (rating[field] || 0);
        }, 0) / fields.length;
        return sum + fieldAverage;
    }, 0) / validRatings.length;
}

async function calculateSubCompanyStats(subCompanyId, month, year) {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        // Get employees and their statistics
        const employees = await Employee.find({ subCompanyId })
            .populate('projectDetails')
            .populate('workedHoursDetails')
            .populate('rating');

        const employeeStats = employees.map(employee => {
            const monthlyWork = employee.workedHoursDetails?.filter(detail =>
                detail?.timestamp >= startDate && detail?.timestamp <= endDate
            ) || [];

            const workedHours = monthlyWork.reduce((sum, detail) => 
                sum + (Number(detail?.workedHours) || 0), 0);

            const earnings = monthlyWork.reduce((sum, detail) => 
                sum + ((Number(detail?.workedHours) || 0) * (Number(detail?.hourlyRate) || 0)), 0);

            const averageRating = calculateAverageRating(
                employee.rating,
                ['quality', 'technical', 'punctuality', 'safety']
            );

            return {
                employeeId: employee._id,
                name: employee.name || 'Unknown',
                totalProjects: employee.projectDetails?.length || 0,
                totalWorkedHours: workedHours,
                totalEarnings: earnings,
                averageRating: Number(averageRating.toFixed(2))
            };
        });

        // Get machinery and their statistics
        const subCompany = await SubCompany.findById(subCompanyId);
        const machinery = await Machinery.find({ subContractorId: subCompany.subContractorId })
            .populate('costDetails')
            .populate('rating');

        const machineryStats = machinery.map(machine => {
            const monthlyWork = machine.costDetails?.filter(detail =>
                detail?.timestamp >= startDate && detail?.timestamp <= endDate
            ) || [];

            const workedHours = monthlyWork.reduce((sum, detail) => 
                sum + (Number(detail?.totalHours) || 0), 0);

            const earnings = monthlyWork.reduce((sum, detail) => 
                sum + (Number(detail?.cost) || 0), 0);

            const averageRating = calculateAverageRating(
                machine.rating,
                ['performance', 'durability', 'costEfficiency', 'reliability']
            );

            return {
                machineryId: machine._id,
                name: machine.name || 'Unknown',
                totalProjects: machine.costDetails?.length || 0,
                totalWorkedHours: workedHours,
                totalEarnings: earnings,
                averageRating: Number(averageRating.toFixed(2))
            };
        });

        const totalEmployeeRating = employeeStats.reduce((sum, emp) => sum + (emp.averageRating || 0), 0);
        const totalMachineryRating = machineryStats.reduce((sum, mach) => sum + (mach.averageRating || 0), 0);

        // Calculate total statistics
        const totalStats = {
            totalEmployees: employees.length,
            totalMachinery: machinery.length,
            totalProjects: [...new Set([
                ...employees.flatMap(e => e.projectDetails?.map(p => p.projectId) || []),
                ...machinery.flatMap(m => m.costDetails?.map(c => c.projectId) || [])
            ])].length,
            totalRevenue: Number([
                ...employeeStats.map(e => e.totalEarnings),
                ...machineryStats.map(m => m.totalEarnings)
            ].reduce((sum, val) => sum + (val || 0), 0).toFixed(2)),
            averageEmployeeRating: employees.length ? 
                Number((totalEmployeeRating / employees.length).toFixed(2)) : 0,
            averageMachineryRating: machinery.length ? 
                Number((totalMachineryRating / machinery.length).toFixed(2)) : 0
        };

        return { employeeStats, machineryStats, totalStats };
    } catch (error) {
        console.error(`Error calculating stats for subCompany ${subCompanyId}:`, error);
        throw error;
    }
}

export async function generateSubCompanyReports() {
    const currentDate = new Date();
    console.log(`Starting subcompany report generation at: ${currentDate.toLocaleString()}`);

    try {
        await connectDB();
        const previousMonth = new Date();
        previousMonth.setMonth(previousMonth.getMonth() - 1);
        const month = previousMonth.getMonth() + 1;
        const year = previousMonth.getFullYear();

        // Get all subcompanies
        const subCompanies = await SubCompany.find({});
        const results = { success: [], failed: [] };

        for (const subCompany of subCompanies) {
            try {
                // Check if report already exists
                const existingReport = await SubCompanyReport.findOne({
                    subCompanyId: subCompany._id,
                    month,
                    year
                });

                if (existingReport) {
                    console.log(`Report already exists for subCompany ${subCompany._id}`);
                    continue;
                }

                // Calculate statistics
                const stats = await calculateSubCompanyStats(subCompany._id, month, year);

                // Create new report
                const report = await SubCompanyReport.create({
                    subCompanyId: subCompany._id,
                    month,
                    year,
                    ...stats
                });

                results.success.push({
                    subCompanyId: subCompany._id,
                    reportId: report._id
                });

            } catch (error) {
                console.error(`Error processing subCompany ${subCompany._id}:`, error);
                results.failed.push({
                    subCompanyId: subCompany._id,
                    error: error.message
                });
            }
        }

        return {
            success: true,
            timestamp: currentDate,
            results
        };

    } catch (error) {
        console.error('Error in subcompany report generation:', error);
        return {
            success: false,
            error: error.message,
            timestamp: currentDate
        };
    }
}
