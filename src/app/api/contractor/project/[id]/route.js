import { NextResponse } from "next/server";
import Project from "@/models/Project";
import SubContractor from "@/models/SubContractor";
import Employee from "@/models/Employee";
import connectDB from "@/lib/db";
import SubCompany from "@/models/SubCompany";
import Company from "@/models/Company";
import Machinery from "@/models/Machinery";

export async function GET(req, { params }) {
    await connectDB();

    try {
        const { id: projectId } = params;
        if (!projectId) {
            return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
        }

        const project = await Project.findById(projectId)
            .populate({
                path: 'companyId',
                model: Company,
                populate: {
                    path: 'profils',
                    model: 'Contractor'
                }
            })
            .populate({
                path: 'employeesId',
                model: Employee,
                options: { strictPopulate: false }
            })
            .populate({
                path: 'machineryId',
                model: Machinery,
                options: { strictPopulate: false }
            });

        if (!project) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }

        const projectData = project.toObject();

        return NextResponse.json(projectData);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { message: 'Error fetching project', error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    await connectDB();
    try {
        const { id: projectId } = params;
        if (!projectId) {
            return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }

        // Update employee project details
        await Employee.updateMany(
            { 'projectDetails.projectId': projectId },
            { 
                $set: { 
                    'projectDetails.$.isActive': false 
                }
            }
        );

        // Update machinery project details
        await Machinery.updateMany(
            { 'costDetails.projectId': projectId },
            { 
                $set: { 
                    'costDetails.$.isActive': false 
                }
            }
        );

        // Update project status
        const updatedProject = await Project.findByIdAndUpdate(
            projectId, 
            { isCompleted: true }, 
            { new: true }
        ).populate(['employeesId', 'machineryId']);

        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { message: 'Error updating project', error: error.message },
            { status: 500 }
        );
    }
}



