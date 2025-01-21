import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import Contractor from '@/models/Contractor';
import Company from '@/models/Company';

export async function POST(request) {
    await dbConnect();

    try {
        const data = await request.json();
        const { projectId, name, description, contractorId, budget } = data;
        debugger
        if (!projectId || !name || !description || !contractorId || !budget) {
            return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
        }

        // Check if project ID already exists
        const existingProject = await Project.findOne({ projectId });
        if (existingProject) {
            return new Response(JSON.stringify({ message: 'Project ID already exists' }), { status: 400 });
        }

        // First try to get companyId from contractor
        let companyId;
        const contractor = await Contractor.findById(contractorId);

        if (contractor && contractor.companyId) {
            companyId = contractor.companyId;
        } else {
            // If not found in contractor, search in companies
            const company = await Company.findOne({ profils: contractorId });
            if (!company) {
                return new Response(JSON.stringify({ message: 'No associated company found for this contractor' }), { status: 404 });
            }
            companyId = company._id;
        }

        const newProject = new Project({
            ...data,
            companyId
        });
        await newProject.save();

        return new Response(JSON.stringify(newProject), { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return new Response(JSON.stringify({ message: 'Error creating project', error: error.message }), { status: 500 });
    }
}

export async function PUT(request) {
    await dbConnect();

    try {
        const data = await request.json();
        const { projectId, employeeIds } = data;

        if (!projectId || !employeeIds || !Array.isArray(employeeIds)) {
            return new Response(JSON.stringify({ message: 'Missing required fields or invalid data' }), { status: 400 });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return new Response(JSON.stringify({ message: 'Project not found' }), { status: 404 });
        }

        project.employeesId.push(...employeeIds);
        await project.save();

        return new Response(JSON.stringify(project), { status: 200 });
    } catch (error) {
        console.error('Error updating project:', error);
        return new Response(JSON.stringify({ message: 'Error updating project', error: error.message }), { status: 500 });
    }
}