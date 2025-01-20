import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SubCompany from '@/models/SubCompany';
import Project from '@/models/Project'; // Added import

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const subcontractorId = searchParams.get('subcontractorId');

        if (!subcontractorId) {
            return NextResponse.json(
                { message: 'Subcontractor ID is required' },
                { status: 400 }
            );
        }

        // Fetch projects where companyId matches the subcontractor's company
        const projects = await Project.find({ companyId: subcontractorId });

        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
