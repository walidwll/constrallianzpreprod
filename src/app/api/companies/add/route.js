import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Company from '@/models/Company';
import Contractor from '@/models/Contractor';
import SubContractor from '@/models/SubContractor';
import Employee from '@/models/Employee';
import Admin from '@/models/Admin';

export async function isEmailTaken(email) {
    const existingContractor = await Contractor.findOne({ email });
    const existingSubContractor = await SubContractor.findOne({ email });
    const existingEmployee = await Employee.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });

    return !!(existingContractor || existingSubContractor || existingEmployee || existingAdmin);
}

export async function POST(request) {
    try {
        await connectDB();
        const { companyName, director, production, supervisor } = await request.json();

        // Check for duplicate emails
        const emails = [director.email, production.email, supervisor.email];

        for (const email of emails) {
            if (await isEmailTaken(email)) {
                return NextResponse.json(
                    { message: `Email ${email} is already registered` },
                    { status: 400 }
                );
            }
        }

        // Create contractors
        const directorContractor = await Contractor.create({ ...director, role: 'director' });
        const productionContractor = await Contractor.create({ ...production, role: 'production' });
        const supervisorContractor = await Contractor.create({ ...supervisor, role: 'supervisor' });

        // Create company
        const company = await Company.create({
            name: companyName,
            contractors: [directorContractor._id, productionContractor._id, supervisorContractor._id],
        });

        return NextResponse.json({ message: 'Company created successfully', company }, { status: 201 });
    } catch (error) {
        console.error('Error creating company:', error);
        return NextResponse.json({ message: 'Error creating company' }, { status: 500 });
    }
}