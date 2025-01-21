import connectDB from "@/lib/db";
import SubCompany from "@/models/SubCompany";
import mongoose from 'mongoose';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ message: 'Invalid company ID' }), { status: 400 });
        }

        const company = await SubCompany.findOne({ subContractorId: id })
            .populate({
                path: 'employeesId'
            });

        // Alternative Option 2: Using findById directly
        // const company = await SubCompany.findById(id)
        //     .populate({
        //         path: 'employeesId'
        //     });

        if (!company) {
            return new Response(JSON.stringify({ message: 'Company not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(company), { status: 200 });

    } catch (error) {
        console.error('Error fetching company details:', error);
        return new Response(JSON.stringify({
            message: 'Error fetching company details',
            error: error.message
        }), { status: 500 });
    }
}