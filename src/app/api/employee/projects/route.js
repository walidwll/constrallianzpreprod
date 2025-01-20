import Project from '@/models/Project';
import dbConnect from '@/lib/db';

export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');

        if (!employeeId) {
            return new Response(JSON.stringify({ message: 'Employee ID is required' }), { status: 400 });
        }
        const projects = await Project.find({
            employeesId: { $in: [employeeId] }
        }).lean();

        return new Response(JSON.stringify(projects), { status: 200 });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}