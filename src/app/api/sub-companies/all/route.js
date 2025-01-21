import connectDB from '@/lib/db';
import SubCompany from '@/models/SubCompany';
import { NextResponse } from 'next/server';

export async function GET() {
    await connectDB();
    try {
        const subCompanies = await SubCompany.find();
        return NextResponse.json(subCompanies, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching sub-companies' }, { status: 500 });
    }
}