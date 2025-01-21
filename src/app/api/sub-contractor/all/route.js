import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SubContractor from '@/models/SubContractor';

export async function GET() {
    try {
        await connectDB();
        
        const subContractors = await SubContractor.find()
            .select('name')
            .sort({ name: 1 });

        return NextResponse.json(subContractors);
    } catch (error) {
        console.error('Error fetching subcontractors:', error);
        return NextResponse.json(
            { message: 'Error fetching subcontractors' }, 
            { status: 500 }
        );
    }
}
