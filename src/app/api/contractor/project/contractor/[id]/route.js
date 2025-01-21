import { NextResponse } from 'next/server';
import Project from '@/models/Project';
import Contractor from '@/models/Contractor';
import Company from '@/models/Company';
import connectDB from '@/lib/db';
import profileCompany from '@/models/ProfileCompany';

export async function GET(request, { params }) {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const isCompleted = searchParams.get('isCompleted') === 'true';
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 6;

    try {
        const profile = await profileCompany.findById(id);
        if (!profile || !profile?.companyId) {
            // If not found in contractor model, look in companies
            const company = await Company.findOne({ profils: id });
            if (!company) {
                return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
            }
            // Get all projects for this company
            const projectCount = await Project.countDocuments({
                companyId: company._id,
                isCompleted
            });

            const projects = await Project.find({
                companyId: company._id,
                isCompleted
            })
                .populate('employeesId')
                .skip((page - 1) * pageSize)
                .limit(pageSize);

            return NextResponse.json({
                projects,
                totalPages: Math.ceil(projectCount / pageSize)
            });
        }

        // If contractor found, use their companyId
        const projectCount = await Project.countDocuments({
            companyId: profile.companyId,
            isCompleted
        });

        const projects = await Project.find({
            companyId: profile.companyId,
            isCompleted
        })
            .populate('employeesId')
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        if (!projects.length) {
            return NextResponse.json({
                message: 'No projects found',
                projects: [],
                totalPages: 0
            }, { status: 200 });
        }

        return NextResponse.json({
            projects,
            totalPages: Math.ceil(projectCount / pageSize)
        });

    } catch (error) {
        console.error('Error fetching projects by ID:', error);
        return NextResponse.json(
            { message: `Error fetching projects: ${error.message}` },
            { status: 500 }
        );
    }
}