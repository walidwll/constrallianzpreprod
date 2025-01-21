import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import SubCompany from '@/models/SubCompany';

export async function POST(request) {
    try {
        await connectDB();

        const { employeeId, subCompanyId } = await request.json();
        const existingApplication = await Application.findOne({
            employeeId,
            status: { $in: ['pending', 'approved'] }
        });

        if (existingApplication) {
            return NextResponse.json(
                { message: 'You already have a pending or approved application' },
                { status: 400 }
            );
        }
        const subCompany = await SubCompany.findById(subCompanyId);
        if (!subCompany) {
            return NextResponse.json(
                { message: 'Company not found' },
                { status: 404 }
            );
        }
        const application = await Application.create({
            employeeId,
            subContractorId: subCompany.subContractorId,
            status: 'pending'
        });

        return NextResponse.json(
            { message: 'Application submitted successfully', application },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating application:', error);
        return NextResponse.json(
            { message: error.message || 'Error creating application' },
            { status: 500 }
        );
    }
}
