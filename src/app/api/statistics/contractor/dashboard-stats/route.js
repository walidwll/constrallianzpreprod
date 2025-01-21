
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Employee from '@/models/Employee';
import SubContractor from '@/models/SubContractor';
import Machinery from '@/models/Machinery';
import Project from '@/models/Project';
import Company from '@/models/Company';
import SubCompany from '@/models/SubCompany';

export async function GET(request) {
    try {
        await connectDB();
        const contractorId = request.nextUrl.searchParams.get('contractorId');

        const company = await Company.findOne({ profils: contractorId });
        if (!company) {
            return NextResponse.json({ message: 'Company not found' }, { status: 404 });
        }

        const projects = await Project.find({ companyId: company._id });
        const subcontractorIds = new Set(
            projects.flatMap(p => p.subContractorIds)
        );

        const subCompanies = await SubCompany.find({
            subContractorId: { $in: Array.from(subcontractorIds) }
        });

        const employeeCount = await Employee.countDocuments({
            subCompanyId: { $in: subCompanies.map(sc => sc._id) }
        });

        const machineryCount = await Machinery.countDocuments({
            subContractorId: { $in: Array.from(subcontractorIds) }
        });

        return NextResponse.json({
            employeeCount,
            machineryCount,
            subcontractorCount: subcontractorIds.size,
            projectCount: projects.length
        });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching dashboard stats' }, { status: 500 });
    }
}