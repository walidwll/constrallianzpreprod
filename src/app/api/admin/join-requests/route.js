
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import JoinRequest from '@/models/JoinRequest';

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const pageSize = parseInt(searchParams.get('pageSize')) || 10;

        const totalRequests = await JoinRequest.countDocuments();
        const totalPages = Math.ceil(totalRequests / pageSize);

        const joinRequests = await JoinRequest.find()
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort({ createdAt: -1 });

        return NextResponse.json({
            data: joinRequests,
            pagination: {
                totalRequests,
                totalPages,
                currentPage: page,
                pageSize,
            },
        });
    } catch (error) {
        console.error('Error fetching join requests:', error);
        return NextResponse.json({ message: 'Error fetching join requests' }, { status: 500 });
    }
}