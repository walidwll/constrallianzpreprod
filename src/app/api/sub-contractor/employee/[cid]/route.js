import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import EmployeeRequest from '@/models/EmployeeRequest';
import Employee from '@/models/Employee';
import Project from '@/models/Project';

export async function GET(request, { params }) {
	const { cid } = params;

	await connectDB();

	try {
		const employees = await Employee.find({})
			.populate({
				path: 'subCompanyId',
				populate: {
					path: 'subContractorId',
					match: { _id: cid },
				},
			});

		const employeeIds = employees
			.filter(emp => emp.subCompanyId && emp.subCompanyId.subContractorId)
			.map(emp => emp._id);

		const requests = await EmployeeRequest.find({ EmployeeId: { $in: employeeIds } })
			.populate('EmployeeId')
			.populate('ProjectId');

		return NextResponse.json({ requests }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}

export async function POST(request, { params }) {
	const { requestId, status, hourlyRate } = await request.json();

	await connectDB();

	try {
		const updatedRequest = await EmployeeRequest.findByIdAndUpdate(
			requestId,
			{ status },
			{ new: true }
		);
		
		if (!updatedRequest) {
			return NextResponse.json({ message: 'Request not found' }, { status: 404 });
		}

		if (status === 'approved') {
			await Project.findByIdAndUpdate(
				updatedRequest.ProjectId,
				{ $addToSet: { employeesId: updatedRequest.EmployeeId } }
			);

			await Employee.findByIdAndUpdate(
				updatedRequest.EmployeeId,
				{
					$addToSet: {
						projectDetails: {
							projectId: updatedRequest.ProjectId,
							hourlyRate: hourlyRate,
							isActive: true
						}
					}
				}
			);
		}

		return NextResponse.json({ request: updatedRequest }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}
