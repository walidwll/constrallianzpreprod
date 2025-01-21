import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Employee from '@/models/Employee';
import SubContractor from '@/models/SubContractor';
import Machinery from '@/models/Machinery';
import Contractor from '@/models/Contractor';
import SubCompany from '@/models/SubCompany';
import { Project } from '@/models';

export async function GET() {
    try {
        await connectDB();

        const [
            employeeCount,
            subcontractorCount,
            contractorCount,
            machineryCount,
            allEmployees,
            allMachinery,
            subContractors,
            projects
        ] = await Promise.all([
            Employee.countDocuments(),
            SubContractor.countDocuments(),
            Contractor.countDocuments(),
            Machinery.countDocuments(),
            Employee.find().select('name role isActive email workedHour rating'),
            Machinery.find()
                .select('name category model isActive subContractorId rating')
                .populate('subContractorId', 'name'),
            SubContractor.find().select('name'),
            Project.find().select('isCompleted budget totalCost')
        ]);


        const employeeStats = {
            activeCount: allEmployees.filter(e => e.isActive).length,
            inactiveCount: allEmployees.filter(e => !e.isActive).length
        };

        // Update machinery statistics to use allMachinery
        const machineryStats = {
            activeCount: allMachinery.filter(m => m.isActive).length,
            inactiveCount: allMachinery.filter(m => !m.isActive).length,
            byCategory: allMachinery.reduce((acc, m) => {
                acc[m.category] = (acc[m.category] || 0) + 1;
                return acc;
            }, {})
        };

        // Project statistics
        const projectStats = {
            total: projects.length,
            completed: projects.filter(p => p.isCompleted).length,
            ongoing: projects.filter(p => !p.isCompleted).length,
            totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
            totalCost: projects.reduce((sum, p) => sum + (p.totalCost || 0), 0)
        };

        // Calculate machinery per subcontractor
        const machineryBySubcontractor = allMachinery.reduce((acc, machine) => {
            const subContractorName = machine.subContractorId?.name || 'Unassigned';
            acc[subContractorName] = (acc[subContractorName] || 0) + 1;
            return acc;
        }, {});

        // Calculate rating statistics from all employee ratings
        const ratingStats = allEmployees.reduce((acc, emp) => {
            if (Array.isArray(emp.rating)) {
                emp.rating.forEach(rating => {
                    ['quality', 'technical', 'punctuality', 'safety'].forEach(key => {
                        if (rating[key] > 0) {
                            if (!acc[key]) acc[key] = [];
                            acc[key].push(rating[key]);
                        }
                    });
                });
            }
            return acc;
        }, {});

        // Calculate average ratings and distribution
        const ratingMetrics = Object.entries(ratingStats).reduce((acc, [key, ratings]) => {
            const total = ratings.reduce((sum, r) => sum + r, 0);
            const count = ratings.length;
            const distribution = ratings.reduce((dist, r) => {
                dist[r] = (dist[r] || 0) + 1;
                return dist;
            }, {});

            acc[key] = {
                average: count ? (total / count).toFixed(1) : 0,
                totalRated: count,
                distribution: {
                    1: ((distribution[1] || 0) / count * 100).toFixed(1),
                    2: ((distribution[2] || 0) / count * 100).toFixed(1),
                    3: ((distribution[3] || 0) / count * 100).toFixed(1),
                    4: ((distribution[4] || 0) / count * 100).toFixed(1),
                    5: ((distribution[5] || 0) / count * 100).toFixed(1)
                }
            };
            return acc;
        }, {});

        // Add machinery ratings calculation similar to employee ratings
        const machineryRatingStats = allMachinery.reduce((acc, machine) => {
            if (Array.isArray(machine.rating)) {
                machine.rating.forEach(rating => {
                    ['performance', 'durability', 'costEfficiency', 'reliability'].forEach(key => {
                        if (rating[key] > 0) {
                            if (!acc[key]) acc[key] = [];
                            acc[key].push(rating[key]);
                        }
                    });
                });
            }
            return acc;
        }, {});

        // Calculate machinery rating metrics
        const machineryRatingMetrics = Object.entries(machineryRatingStats).reduce((acc, [key, ratings]) => {
            const total = ratings.reduce((sum, r) => sum + r, 0);
            const count = ratings.length;
            const distribution = ratings.reduce((dist, r) => {
                dist[r] = (dist[r] || 0) + 1;
                return dist;
            }, {});

            acc[key] = {
                average: count ? (total / count).toFixed(1) : 0,
                totalRated: count,
                distribution: {
                    1: ((distribution[1] || 0) / count * 100).toFixed(1),
                    2: ((distribution[2] || 0) / count * 100).toFixed(1),
                    3: ((distribution[3] || 0) / count * 100).toFixed(1),
                    4: ((distribution[4] || 0) / count * 100).toFixed(1),
                    5: ((distribution[5] || 0) / count * 100).toFixed(1)
                }
            };
            return acc;
        }, {});

        // Fetch all subcompanies with their resources
        const subCompanies = await SubCompany.find()
            .populate({
                path: 'employeesId',
                select: 'rating name',
                populate: {
                    path: 'rating',
                    options: { sort: { 'createdAt': 1 } }
                }
            })
            .populate({
                path: 'machineryId',
                select: 'rating name',
                populate: {
                    path: 'rating',
                    options: { sort: { 'createdAt': 1 } }
                }
            });

        // Process time-series rating data
        const timeSeriesData = subCompanies.map(company => {
            const employeeRatings = [];
            const machineryRatings = [];

            // Process employee ratings
            company.employeesId.forEach(employee => {
                employee.rating.forEach(rating => {
                    const avgRating = (rating.quality + rating.technical + rating.punctuality + rating.safety) / 4;
                    employeeRatings.push({
                        timestamp: rating.createdAt,
                        rating: avgRating,
                        name: employee.name
                    });
                });
            });

            // Process machinery ratings
            company.machineryId.forEach(machine => {
                machine.rating.forEach(rating => {
                    const avgRating = (rating.performance + rating.durability + rating.costEfficiency + rating.reliability) / 4;
                    machineryRatings.push({
                        timestamp: rating.createdAt,
                        rating: avgRating,
                        name: machine.name
                    });
                });
            });

            return {
                companyId: company._id,
                name: company.name,
                subContractorId: company.subContractorId?._id || null,
                employeeRatings: employeeRatings.sort((a, b) => a.timestamp - b.timestamp),
                machineryRatings: machineryRatings.sort((a, b) => a.timestamp - b.timestamp)
            };
        });

        return NextResponse.json({
            employeeCount,
            subcontractorCount,
            contractorCount,
            machineryCount,
            employeeStats,
            machineryStats,
            projectStats,
            machineryBySubcontractor,
            ratings: ratingMetrics,
            machineryRatings: machineryRatingMetrics,
            timeSeriesRatings: timeSeriesData
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return NextResponse.json({ message: 'Error fetching statistics' }, { status: 500 });
    }
}