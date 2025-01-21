import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Company from '@/models/Company';
import Machinery from '@/models/Machinery';

export async function GET(request) {
    try {
        await connectDB();
        const contractorId = request.nextUrl.searchParams.get('contractorId');
        const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
        const pageSize = parseInt(request.nextUrl.searchParams.get('pageSize')) || 10;

        // Find company associated with contractor
        const company = await Company.findOne({ profils: contractorId });
        if (!company) {
            return NextResponse.json({ message: 'Company not found' }, { status: 404 });
        }

        // Find all projects for this company
        const projects = await Project.find({ companyId: company._id });
        
        // Get unique machinery IDs from all projects
        const machineryIds = [...new Set(projects.flatMap(project => project.machineryId))];

        // Find all machinery in these projects
        const machinery = await Machinery.find({ _id: { $in: machineryIds } });
        const paginatedMachinery = machinery.slice((page - 1) * pageSize, page * pageSize);

        return NextResponse.json({
            data: paginatedMachinery,
            pagination: {
                total: machinery.length,
                totalPages: Math.ceil(machinery.length / pageSize),
                currentPage: page
            }
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Error fetching machinery statistics' }, { status: 500 });
    }
}
