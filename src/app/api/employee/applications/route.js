import dbConnect from '@/lib/db';
import Application from '@/models/Application';

export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');

        if (!employeeId) {
            return new Response(JSON.stringify({ message: 'Employee ID is required' }), { status: 400 });
        }

        const applications = await Application.find({ employeeId })
            .populate('subContractorId')
            .populate('employeeId')
            .exec();

        if (!applications || applications.length === 0) {
            return new Response(JSON.stringify({ message: 'No applications found' }), { status: 404 });
        }

        return new Response(JSON.stringify(applications), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }), { status: 500 });
    }
}