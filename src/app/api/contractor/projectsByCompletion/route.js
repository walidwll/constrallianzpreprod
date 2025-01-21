
import { NextResponse } from 'next/server';
import Project from '@/models/Project';
import Contractor from '@/models/Contractor';
import SubContractor from '@/models/SubContractor';
import Employee from '@/models/Employee';
import connectDB from '@/lib/db';

export async function GET(req) {
    await connectDB();

    try {
        const { searchParams } = new URL(req.url);
        const isCompleted = searchParams.get('isCompleted') === 'true';
        const page = parseInt(searchParams.get('page')) || 1;
        const pageSize = parseInt(searchParams.get('pageSize')) || 6;

        const query = { isCompleted };
        const totalProjects = await Project.countDocuments(query);
        const totalPages = Math.ceil(totalProjects / pageSize);

        const projects = await Project.find(query)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate({
                path: 'companyId',
                populate: {
                    path: 'profils',
                    model: Contractor
                }
            })
            .populate({
                path: 'subContractorIds',
                model: SubContractor,
                options: { strictPopulate: false }
            })
            .populate({
                path: 'employeesId',
                model: Employee,
                options: { strictPopulate: false }
            });

        return NextResponse.json({ projects, totalPages });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ message: `Error fetching projects: ${error.message}` }, { status: 500 });
    }
}