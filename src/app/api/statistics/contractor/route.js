import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SubContractor from '@/models/SubContractor';
import Machinery from '@/models/Machinery';
import Project from '@/models/Project';
import SubCompany from '@/models/SubCompany';
import Company from '@/models/Company';
import mongoose from 'mongoose';
import profileCompany from '@/models/ProfileCompany';

export async function GET(request) {
    try {
        await connectDB();

        const contractorId = request.nextUrl.searchParams.get('contractorId');
        if (!contractorId || !mongoose.Types.ObjectId.isValid(contractorId)) {
            return NextResponse.json({ message: 'Valid Contractor ID is required' }, { status: 400 });
        }

        const contractor = await profileCompany.findById(contractorId);
        if (!contractor) {
            return NextResponse.json({ message: 'Contractor not found' }, { status: 404 });
        }

        const company = await Company.findOne({ profils: contractorId });
        if (!company || !company._id) {
            return NextResponse.json({ message: 'Company not found or invalid ID' }, { status: 404 });
        }

        const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
        const pageSize = parseInt(request.nextUrl.searchParams.get('pageSize')) || 10;
        const skip = (page - 1) * pageSize;

        // Get projects with populated data
        const projects = await Project.find(
            { companyId: company._id },
            'projectId name isCompleted budget totalCost employeesId machineryId costReport'
        )
            .populate('employeesId')
            .populate('machineryId');

        // First get all relevant SubCompanies based on project's employees and machinery
        const subCompanies = await SubCompany.find({
            $or: [
                { employeesId: { $in: projects.flatMap(p => p.employeesId) } },
                { machineryId: { $in: projects.flatMap(p => p.machineryId) } }
            ]
        }).populate('employeesId');

        // Get all subcontractors from these subcompanies
        const subContractors = await SubContractor.find({
            _id: { $in: subCompanies.map(sc => sc.subContractorId) }
        });

        // Get all machinery associated with these subcontractors
        const machinery = await Machinery.find({
            $or: [
                { subContractorId: { $in: subContractors.map(sc => sc._id) } },
                { _id: { $in: projects.flatMap(p => p.machineryId) } }
            ]
        });

        // Get all employees from the subcompanies
        const employees = subCompanies.flatMap(sc => sc.employeesId || []);

        // Get associated subcontractors for each employee and machinery
        const employeeSubContractors = await SubCompany.aggregate([
            {
                $match: {
                    employeesId: { $in: employees.map(e => e._id) }
                }
            },
            {
                $lookup: {
                    from: 'subcontractors',
                    localField: 'subContractorId',
                    foreignField: '_id',
                    as: 'subContractor'
                }
            },
            {
                $unwind: '$subContractor'
            },
            {
                $group: {
                    _id: '$subContractor._id',
                    name: { $first: '$subContractor.name' },
                    email: { $first: '$subContractor.email' },
                    employeeCount: { $sum: { $size: '$employeesId' } }
                }
            }
        ]);

        const machinerySubContractors = await SubCompany.aggregate([
            {
                $match: {
                    machineryId: { $in: machinery.map(m => m._id) }
                }
            },
            {
                $lookup: {
                    from: 'subcontractors',
                    localField: 'subContractorId',
                    foreignField: '_id',
                    as: 'subContractor'
                }
            },
            {
                $unwind: '$subContractor'
            },
            {
                $group: {
                    _id: '$subContractor._id',
                    name: { $first: '$subContractor.name' },
                    email: { $first: '$subContractor.email' },
                    machineryCount: { $sum: { $size: '$machineryId' } }
                }
            }
        ]);

        const stats = {
            employeeCount: employees.length,
            machineryCount: machinery.length,
            subcontractorCount: subContractors.length,
            projectCount: projects.length,
            employeeStats: {
                activeCount: employees.filter(e => e.isActive).length,
                inactiveCount: employees.filter(e => !e.isActive).length,
                byProject: projects.reduce((acc, p) => {
                    acc[p.name] = p.employeesId.length;
                    return acc;
                }, {})
            },
            machineryStats: {
                activeCount: machinery.filter(m => m.isActive).length,
                inactiveCount: machinery.filter(m => !m.isActive).length,
                byCategory: machinery.reduce((acc, m) => {
                    acc[m.category] = (acc[m.category] || 0) + 1;
                    return acc;
                }, {})
            },
            employees: employees.map(e => ({
                id: e._id,
                name: e.name,
                role: e.role,
                isActive: e.isActive,
                workedHour: e.workedHour
            })),
            machinery: machinery.map(m => ({
                id: m._id,
                name: m.name,
                category: m.category,
                model: m.model,
                isActive: m.isActive
            })),
            projects: projects.map(p => ({
                id: p._id,
                name: p.name,
                isCompleted: p.isCompleted,
                budget: p.budget,
                totalCost: p.totalCost
            })),
            subContractors: {
                total: subContractors.length,
                withEmployees: employeeSubContractors,
                withMachinery: machinerySubContractors,
            },
        };

        const paginatedStats = {
            ...stats,
            pagination: {
                employees: {
                    total: employees.length,
                    totalPages: Math.ceil(employees.length / pageSize),
                    currentPage: page,
                    data: employees.slice(skip, skip + pageSize)
                },
                machinery: {
                    total: machinery.length,
                    totalPages: Math.ceil(machinery.length / pageSize),
                    currentPage: page,
                    data: machinery.slice(skip, skip + pageSize)
                }
            }
        };

        return NextResponse.json(paginatedStats);
    } catch (error) {
        console.error('Error in contractor statistics:', error);
        return NextResponse.json({ message: 'Error fetching contractor statistics' }, { status: 500 });
    }
}