import connectDB from '@/lib/db';
import SubActivity from '@/models/SubActivity';
import { NextResponse } from 'next/server';

export async function GET(request) {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id_Act = searchParams.get('id_Act');
    
    if (!id_Act ) {
            return new Response(JSON.stringify({ message: 'Invalid activity ID' }), { status: 400 });
        }
    try {

        const subactivities = await SubActivity.find({ id_Act });
        return NextResponse.json(subactivities, { status: 200 });
    } catch (error) {
        console.error('Error fetching sub-activities:', error);
        return NextResponse.json({ message: 'Error fetching sub-activities' }, { status: 500 });
    }
}