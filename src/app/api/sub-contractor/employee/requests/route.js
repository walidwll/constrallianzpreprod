import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import SubCompany from '@/models/SubCompany';
import Employee from '@/models/Employee';
import mongoose from 'mongoose';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const subContractorId = searchParams.get('subContractorId');

        if (!subContractorId) {
            return NextResponse.json(
                { message: 'subContractorId is required' },
                { status: 400 }
            );
        }

        const applications = await Application.find({ subContractorId }).populate('employeeId');

        return NextResponse.json(
            { message: 'Applications fetched successfully', applications },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json(
            { message: error.message || 'Error fetching applications' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();

        const { applicationId, status } = await request.json();

        if (!applicationId || !status) {
            return NextResponse.json(
                { message: 'applicationId and status are required' },
                { status: 400 }
            );
        }

        const application = await Application.findById(applicationId).populate('employeeId');

        if (!application) {
            return NextResponse.json(
                { message: 'Application not found' },
                { status: 404 }
            );
        }

        if (application.status !== 'pending') {
            return NextResponse.json(
                { message: `Cannot update status. Current status is "${application.status}".` },
                { status: 400 }
            );
        }

        if (status === 'approved') {
            const subCompany = await SubCompany.findOne({
                subContractorId: application.subContractorId
            });

            if (!subCompany) {
                return NextResponse.json(
                    { message: 'SubCompany not found' },
                    { status: 404 }
                );
            }

            if (!Array.isArray(subCompany.employees)) {
                subCompany.employees = [];
            }

            await Employee.findByIdAndUpdate(
                application.employeeId._id,
                {
                    $set: {
                        subCompanyId: subCompany._id,
                        isActive: true,
                    }
                }
            );

            if (!subCompany.employees.includes(application.employeeId._id)) {
                subCompany.employees.push(application.employeeId._id);
                await subCompany.save();
            }
        }

        application.status = status;
        await application.save();

        return NextResponse.json(
            { message: `Application ${status} successfully`, application },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating application status:', error);
        return NextResponse.json(
            { message: error.message || 'Error updating application status' },
            { status: 500 }
        );
    }
}