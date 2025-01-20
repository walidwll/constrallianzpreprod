import connectDB from '@/lib/db';
import SubCompany from '@/models/SubCompany';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectDB();

    try {
        const { searchParams } = new URL(req.url);
        const subContractorId = searchParams.get('id');
        const subCompanies = await SubCompany.find({ subContractorId: subContractorId });
        return NextResponse.json(subCompanies, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching sub-companies' }, { status: 500 });
    }
}