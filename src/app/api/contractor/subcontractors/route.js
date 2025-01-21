import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Contractor from '@/models/Contractor';
import SubCompany from '@/models/SubCompany';
import Company from '@/models/Company';

export async function GET(request) {
    try {
        await connectDB();

        const contractorId = request.nextUrl.searchParams.get('contractorId');
        if (!contractorId) {
            return NextResponse.json({ message: 'Contractor ID is required' }, { status: 400 });
        }
        const contractor = await Contractor.findById(contractorId);
        if (!contractor) {
            return NextResponse.json({ message: 'Contractor not found' }, { status: 404 });
        }
        const company = await Company.findOne({ contractors: contractorId });
        if (!company || !company._id) {
            return NextResponse.json({ message: 'Company not found or invalid ID' }, { status: 404 });
        }
        const companyId = company._id.toString();
        const projects = await Project.find({ companyId: companyId });
        const subCompanyIds = new Set();
        projects.forEach(project => {
            project.subContractorIds.forEach(id => {
                subCompanyIds.add(id.toString());
            });
        });
        const subCompanies = await SubCompany.find({
            _id: { $in: Array.from(subCompanyIds) }
        }).populate('subContractorId');

        const subcontractors = subCompanies
            .map(company => company.subContractorId)
            .filter(Boolean);

        return NextResponse.json({
            subcontractors,
        });

    } catch (error) {
        console.error('Error fetching contractor statistics:', error);
        return NextResponse.json({ message: 'Error fetching contractor statistics' }, { status: 500 });
    }
}