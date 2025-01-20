import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SubContractor from '@/models/SubContractor';
import Employee from '@/models/Employee';
import SubCompany from '@/models/SubCompany';

export async function POST(request) {
    try {
        await connectDB();

        const { subContractorId, employeeId } = await request.json();
        const subContractor = await SubContractor.findById(subContractorId);
        if (!subContractor) {
            return NextResponse.json(
                { message: 'SubContractor not found' },
                { status: 404 }
            );
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return NextResponse.json(
                { message: 'Employee not found' },
                { status: 404 }
            );
        }

        const subCompany = await SubCompany.findOne({ subContractorId });
        if (!subCompany) {
            return NextResponse.json(
                { message: 'SubCompany not found' },
                { status: 404 }
            );
        }
 
        subCompany.employeesId.push(employeeId);
        await subCompany.save();

        return NextResponse.json(
            { message: 'Employee added successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error adding employee:', error);
        return NextResponse.json(
            { message: error.message || 'Error adding employee' },
            { status: 500 }
        );
    }
}