import connectDB from "@/lib/db";
import Employee from "@/models/Employee";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const employee = await Employee.findById(id)
            .populate({
                path: 'rating.reviewedBy',
                select: 'name email',
                options: { strictPopulate: false }
            })
            .populate({
                path: 'subCompanyId',
                select: 'name',
                options: { strictPopulate: false }
            })
            .exec();
        if (!employee) {
            return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
        }
        return NextResponse.json(employee);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const employee = await Employee.findById(id);
        if (!employee) {
            return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
        }

        if (body.addHours) {
            const newWorkedHours = (employee.workedHour || 0) + Number(body.addHours);
            employee.workedHour = newWorkedHours;

            const projects = await Project.find({ employeesId: id });
            for (const project of projects) {
                const currentHours = Number(project.completedHours) || 0;
                const newHours = currentHours + Number(body.addHours);
                await Project.findByIdAndUpdate(
                    project._id,
                    { $set: { completedHours: newHours.toString() } }
                );
            }
        }
        if (body.rating && Array.isArray(body.rating)) {
            const newRatings = body.rating.map(rating => ({
                quality: rating.quality,
                technical: rating.technical,
                punctuality: rating.punctuality,
                safety: rating.safety,
                review: rating.review || '',
                reviewedBy: rating.reviewedBy,
            }));

            if (!Array.isArray(employee.rating)) {
                employee.rating = [];
            }

            employee.rating.push(...newRatings);
        }

        const updatedEmployee = await employee.save();
        await updatedEmployee.populate({
            path: 'rating.reviewedBy',
            select: 'name email'
        });

        return NextResponse.json(updatedEmployee);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        if (!id) {
            return new Response('Employee ID is required', { status: 400 });
        }
        const body = await request.json();
        const { name, email, phone } = body;

        if (!name || !email || !phone) {
            return new Response('Name, email and phone are required', { status: 400 });
        }
        const employee = await Employee.findById(id);

        if (!employee) {
            return new Response('Employee not found', { status: 404 });
        }

        employee.name = name;
        employee.email = email;
        employee.phone = phone;

        await employee.save();

        return new Response(JSON.stringify(employee), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error updating employee:', error);
        return new Response('Error updating employee', { status: 500 });
    }
}