import Machinery from "@/models/Machinery";
import MachineryRequest from "@/models/MachineryRequest";
import connectDB from "@/lib/db";
import { NextResponse } from 'next/server';
import Project from "@/models/Project";

export async function GET(request) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const subContractorId = searchParams.get('subContractorId');
		const machineryName = searchParams.get('machineryName');
		const status = searchParams.get('status');

		if (!subContractorId) {
			return NextResponse.json(
				{ message: 'subContractorId is required' },
				{ status: 400 }
			);
		}

		const subContractorMachinery = await Machinery.find({ subContractorId });
		const machineryIds = subContractorMachinery.map(m => m._id);

		let query = { machineryId: { $in: machineryIds } };

		if (status && ['pending', 'approved', 'rejected'].includes(status)) {
			query.status = status;
		}

		let machineryRequests = await MachineryRequest.find(query)
			.populate('machineryId')
			.populate('projectId');

		if (machineryName) {
			machineryRequests = machineryRequests.filter(request =>
				request.machineryId?.name?.toLowerCase().includes(machineryName.toLowerCase())
			);
		}

		return NextResponse.json(
			{ message: 'Machinery requests fetched successfully', requests: machineryRequests },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: error.message || 'Error fetching machinery requests' },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
    try {
        await connectDB();
        const { requestId, status } = await request.json();

        if (!requestId || !status) {
            return NextResponse.json(
                { message: 'requestId and status are required' },
                { status: 400 }
            );
        }

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json(
                { message: 'Invalid status. Must be "approved" or "rejected".' },
                { status: 400 }
            );
        }

        const machineryRequest = await MachineryRequest.findById(requestId).populate('machineryId');
        if (!machineryRequest) {
            return NextResponse.json(
                { message: 'Machinery request not found' },
                { status: 404 }
            );
        }

        if (machineryRequest.status !== 'pending') {
            return NextResponse.json(
                { message: `Cannot update status. Current status is "${machineryRequest.status}".` },
                { status: 400 }
            );
        }

        if (status === 'approved') {
            const project = await Project.findById(machineryRequest.projectId);
            if (!project) {
                return NextResponse.json(
                    { message: 'Project not found' },
                    { status: 404 }
                );
            }

            const machinery = await Machinery.findById(machineryRequest.machineryId._id);
            if (!machinery) {
                return NextResponse.json(
                    { message: 'Machinery not found' },
                    { status: 404 }
                );
            }

            machinery.projectId = project._id;
            machinery.status = true;
            machinery.costDetails.push({
                projectId: project._id,
                isActive: true,
                timestamp: new Date()
            });
            await machinery.save();

            if (!Array.isArray(project.machineryId)) {
                project.machineryId = [];
            }

            if (!project.machineryId.includes(machineryRequest.machineryId._id)) {
                project.machineryId.push(machineryRequest.machineryId._id);
                await project.save();
            }
        }

        machineryRequest.status = status;
        await machineryRequest.save();

        return NextResponse.json(
            { message: `Machinery request ${status} successfully`, request: machineryRequest },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating machinery request status:', error);
        return NextResponse.json(
            { message: error.message || 'Error updating machinery request status' },
            { status: 500 }
        );
    }
}
