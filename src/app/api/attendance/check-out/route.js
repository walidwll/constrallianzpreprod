import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import TimeRecord from '@/models/TimeRecord';
import Employee from '@/models/Employee';
import Contractor from '@/models/Contractor';
import Project from '@/models/Project';
import Company from '@/models/Company';  // Add this import

export async function POST(request) {
    try {
        await connectDB();
        const { employeeId, supervisorId } = await request.json();

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

        const timeRecord = await TimeRecord.findOne({
            employeeId,
            supervisorId,
            active: true
        }).populate('projectId');

        if (!timeRecord) {
            return NextResponse.json({
                message: 'No active check-in found with this supervisor'
            }, { status: 404 });
        }

        timeRecord.checkOutTime = new Date();
        timeRecord.active = false;
        await timeRecord.save();

        const workedHours = Math.ceil(
            (timeRecord.checkOutTime - timeRecord.checkInTime) / (1000 * 60 * 60)
        );

        // Update employee records
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return NextResponse.json({
                message: 'Employee not found'
            }, { status: 404 });
        }

        const activeProject = employee.projectDetails.find(
            p => p.projectId.equals(timeRecord.projectId._id)
        );

        if (activeProject) {
            // Add entry to Employee's workedHoursDetails
            employee.workedHoursDetails.push({
                projectId: timeRecord.projectId._id,
                workedHours,
                hourlyRate: activeProject.hourlyRate,
                timestamp: new Date()
            });

            // Update Employee's overall workedHour
            employee.workedHour = (employee.workedHour || 0) + workedHours;
            await employee.save();

            // Update Project's hours
            await Project.findByIdAndUpdate(
                timeRecord.projectId._id,
                {
                    $inc: {
                        completedHours: workedHours,
                        totalHours: workedHours
                    }
                }
            );
        }

        return NextResponse.json({
            message: 'Check-out successful',
            workedHours
        }, { status: 200 });
    } catch (error) {
        console.error('Error during check-out:', error);
        return NextResponse.json({
            message: error.message || 'Error during check-out'
        }, { status: 500 });
    }
}