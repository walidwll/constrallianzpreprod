import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import TimeRecord from '@/models/TimeRecord';

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');

        const activeRecord = await TimeRecord.findOne({
            employeeId,
            checkOutTime: null
        }).select('checkInTime subContractorId');

        if (!activeRecord) {
            return NextResponse.json({ isCheckedIn: false });
        }

        return NextResponse.json({
            isCheckedIn: true,
            checkInTime: activeRecord.checkInTime,
            subContractorId: activeRecord.subContractorId
        });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}