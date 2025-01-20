import connectDB from '@/lib/db';
import SubCompany from '@/models/SubCompany';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectDB();

    try {
        const { searchParams } = new URL(req.url);
        const subCompnayId = searchParams.get('id');
        const subCompany = await SubCompany.findOne({ _id: subCompnayId });

        if (!subCompany) {
            return NextResponse.json({ message: 'SubCompany not found' }, { status: 404 });
        }
        return NextResponse.json({subCompany}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching sub-companies' }, { status: 500 });
    }
}