import connectDB from '@/lib/db';
import SubCompany from '@/models/SubCompany';
import SubContractor from '@/models/SubContractor';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectDB();

    try {
        const { searchParams } = new URL(req.url);
        const subCompnayId = searchParams.get('id');
        const subCompanyProfiles = await SubContractor.find({companyId: subCompnayId});
        if (!subCompanyProfiles) {
            return NextResponse.json({ message: 'subCompanyProfiles not found' }, { status: 404 });
        }
        return NextResponse.json({subCompanyProfiles}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching sub-companies' }, { status: 500 });
    }
}