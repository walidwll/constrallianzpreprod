import connectDB from '@/lib/db';
import profileCompany from '@/models/ProfileCompany';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectDB();

    try {
        const { searchParams } = new URL(req.url);
        const compnayId = searchParams.get('id');
        const companyProfiles = await profileCompany.find({companyId: compnayId});
        if (!companyProfiles) {
            return NextResponse.json({ message: 'Company Profiles not found' }, { status: 404 });
        }
        return NextResponse.json({companyProfiles}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching sub-companies' }, { status: 500 });
    }
}