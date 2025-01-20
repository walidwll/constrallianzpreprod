import { NextResponse } from "next/server";
import Company from "@/models/Company";
import dbConnect from "@/lib/db";

export async function GET(request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
        }

        const company = await Company.findOne({ profils: { $in: [userId] } })
                     .populate('profils')
                     .lean()  
                     .exec();
        if (!company) {
            return new Response(JSON.stringify({ message: 'Company not found' }), { status: 404 });
        }
        return new Response(JSON.stringify(company), { status: 200 });

    } catch (error) {
        console.error('Error fetching company:', error);
        return new Response(JSON.stringify({ message: 'Error fetching company', error: error.message }), { status: 500 });
    }
}