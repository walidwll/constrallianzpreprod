import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import Machinery from "@/models/Machinery";

export async function POST(request, { params }) {
	try {
		await connectDB();
		const { projectId, hours } = await request.json();
		const { id } = params;

		const machinery = await Machinery.findById(id);
		if (!machinery) {
			return NextResponse.json({ message: 'Machinery not found' }, { status: 404 });
		}

		let existingProjectIndex = machinery.costDetails.findIndex(
			detail => detail.projectId.toString() === projectId
		);

		let updateOperation;
		if (existingProjectIndex === -1) {
			updateOperation = {
				$push: {
					costDetails: {
						projectId,
						totalHours: parseFloat(hours),
						isActive: true,
						workHistory: [{
							hours: parseFloat(hours),
							date: new Date()
						}]
					}
				}
			};
		} else {
			updateOperation = {
				$inc: {
					[`costDetails.${existingProjectIndex}.totalHours`]: parseFloat(hours)
				},
				$push: {
					[`costDetails.${existingProjectIndex}.workHistory`]: {
						hours: parseFloat(hours),
						date: new Date()
					}
				}
			};
		}

		const updatedMachinery = await Machinery.findByIdAndUpdate(
			id,
			updateOperation,
			{
				new: true,
				runValidators: false
			}
		);

		return NextResponse.json({
			message: 'Hours added successfully',
			machinery: updatedMachinery
		});
	} catch (error) {
		console.error('Error adding hours:', error);
		return NextResponse.json({
			message: error.message || 'Failed to add hours'
		}, { status: 500 });
	}
}