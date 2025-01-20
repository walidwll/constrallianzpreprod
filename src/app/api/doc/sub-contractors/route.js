import connectDB from "@/lib/db";
import { SubCompany } from "@/models";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const search = searchParams.get('search') || '';
        const skip = (page - 1) * limit;

        // Create search query
        const searchQuery = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { 'subContractorId.name': { $regex: search, $options: 'i' } },
                { 'subContractorId.email': { $regex: search, $options: 'i' } }
            ]
        } : {};

        const total = await SubCompany.countDocuments(searchQuery);
        const totalPages = Math.ceil(total / limit);

        // Ensure page is within valid range
        const validPage = Math.max(1, Math.min(page, totalPages));
        const validSkip = (validPage - 1) * limit;

        const documents = await SubCompany.find(searchQuery)
            .populate('subContractorId')
            .skip(validSkip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return NextResponse.json({
            documents,
            currentPage: validPage,
            totalPages,
            totalDocuments: total
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
