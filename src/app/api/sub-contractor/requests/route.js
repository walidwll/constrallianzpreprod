//route to get and  approve subcontracotr request and make it active
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SubContractorRequest from '@/models/SubContractorRequests';
import SubContractor from '@/models/SubContractor';
import { sendMail } from '@/lib/mail';

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const status = searchParams.get('status');

        const query = status ? { status } : {};
        const skip = (page - 1) * limit;

        const requests = await SubContractorRequest.find(query)
            .populate('SubContractorId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await SubContractorRequest.countDocuments(query);

        return NextResponse.json({
            requests,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const { requestId, status } = await request.json();

        const subRequest = await SubContractorRequest.findById(requestId)
            .populate('SubContractorId');

        if (!subRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        subRequest.status = status;
        await subRequest.save();

        if (status === 'approved') {
            await SubContractor.findByIdAndUpdate(
                subRequest.SubContractorId._id,
                { isActive: true }
            );

            // Send email
            await sendMail({
                to: subRequest.SubContractorId.email,
                subject: 'Account Approved - Site Management Platform',
                html: `
                    <h1>Welcome to Site Management Platform</h1>
                    <p>Your account has been approved. You can now log in to the platform.</p>
                `
            });
        }

        return NextResponse.json({ request: subRequest });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}