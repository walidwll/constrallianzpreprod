import connectDB from '@/lib/db';
import Activity from '@/models/Activity';
import { NextResponse } from 'next/server';

export async function GET() {
    await connectDB();
    try {
        const activities = await Activity.find();
        return NextResponse.json(activities, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching activities' }, { status: 500 });
    }
}