import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import TimeRecord from '@/models/TimeRecord';
import Employee from '@/models/Employee';
import Contractor from '@/models/Contractor';
import Project from '@/models/Project';
import Company from '@/models/Company';

export async function POST(request) {
    try {
        await connectDB();
        const { employeeId, supervisorId } = await request.json();
        debugger
        // Check if user already has an active check-in
        const existingActiveCheckIn = await TimeRecord.findOne({
            employeeId,
            active: true
        });

        if (existingActiveCheckIn) {
            return NextResponse.json({
                message: 'You already have an active check-in session',
                activeSession: existingActiveCheckIn
            }, { status: 400 });
        }

        // Verify supervisor exists and is a supervisor
        const supervisor = await Contractor.findOne({
            _id: supervisorId,
            role: 'supervisor'
        });

        if (!supervisor) {
            return NextResponse.json({
                message: 'Invalid supervisor QR code'
            }, { status: 400 });
        }

        // Get employee and their active project
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return NextResponse.json({
                message: 'Employee not found'
            }, { status: 404 });
        }

        const activeProject = employee.projectDetails.find(p => p.isActive);
        if (!activeProject) {
            return NextResponse.json({
                message: 'No active project found for employee'
            }, { status: 400 });
        }

        // Modified supervisor verification and project check
        const project = await Project.findById(activeProject.projectId);
        if (!project) {
            return NextResponse.json({
                message: 'Project not found'
            }, { status: 404 });
        }

        const company = await Company.findById(project.companyId);
        if (!company) {
            return NextResponse.json({
                message: 'Company not found'
            }, { status: 404 });
        }

        const isSupervisorAuthorized = company.contractors.some(
            contractorId => contractorId.toString() === supervisor._id.toString()
        );

        if (!isSupervisorAuthorized) {
            return NextResponse.json({
                message: 'Supervisor is not authorized for this project'
            }, { status: 403 });
        }

        const newTimeRecord = new TimeRecord({
            employeeId,
            supervisorId,
            projectId: activeProject.projectId,
            checkInTime: new Date(),
            date: new Date().toISOString().split('T')[0],
            active: true
        });

        await newTimeRecord.save();

        return NextResponse.json({
            message: 'Check-in successful',
            record: newTimeRecord
        }, { status: 200 });
    } catch (error) {
        console.error('Error during check-in:', error);
        return NextResponse.json({
            message: error.message || 'Error during check-in'
        }, { status: 500 });
    }
}
