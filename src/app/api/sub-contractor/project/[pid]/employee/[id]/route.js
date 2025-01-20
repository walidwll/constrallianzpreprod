import { NextResponse } from "next/server";
import Project from "@/models/Project";
import Employee from "@/models/Employee";
import connectDB from "@/lib/db";
import EmployeeRequest from "@/models/EmployeeRequest";

export async function POST(req, { params }) {
    await connectDB();

    try {
        const { id: employeeId, pid: projectId } = params;

        if (!projectId || !employeeId) {
            return NextResponse.json({ message: 'Project ID and Employee ID are required' }, { status: 400 });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
        }

        if (!project.employeesId.includes(employeeId)) {
            const existingRequests = await EmployeeRequest.find({ ProjectId: projectId, EmployeeId: employeeId });
            const hasPendingOrApprovedRequest = existingRequests.some(request => request.status !== 'rejected');
            if (hasPendingOrApprovedRequest) {
                return NextResponse.json({ message: 'Employee request already exists' }, { status: 400 });
            }

            const employeeRequest = new EmployeeRequest({
                ProjectId: projectId,
                EmployeeId: employeeId,
                status: 'pending'
            });
            await employeeRequest.save();

        } else {
            return NextResponse.json({ message: 'Employee is already part of the project' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Employee added to project successfully', project });
    } catch (error) {
        console.error('Error adding employee to project:', error);
        return NextResponse.json(
            { message: 'Error adding employee to project', error: error.message },
            { status: 500 }
        );
    }
}
