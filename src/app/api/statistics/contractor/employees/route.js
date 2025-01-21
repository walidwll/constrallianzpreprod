import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Company from '@/models/Company';
import Employee from '@/models/Employee';

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

        // Get unique employee IDs from all projects
        const employeeIds = [...new Set(projects.flatMap(project => project.employeesId))];

        // Find all employees in these projects
        const employees = await Employee.find({ _id: { $in: employeeIds } });
        const paginatedEmployees = employees.slice((page - 1) * pageSize, page * pageSize);

        return NextResponse.json({
            data: paginatedEmployees,
            pagination: {
                total: employees.length,
                totalPages: Math.ceil(employees.length / pageSize),
                currentPage: page
            }
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Error fetching employee statistics' }, { status: 500 });
    }
}