
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SubContractor from '@/models/SubContractor';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page')) || 1;
		const limit = parseInt(searchParams.get('limit')) || 5;

		await connectDB();

		const skip = (page - 1) * limit;
		const [data, totalCount] = await Promise.all([
			SubContractor.find()
				.select('name role isActive email')
				.skip(skip)
				.limit(limit),
			SubContractor.countDocuments()
		]);

		return NextResponse.json({
			data,
			currentPage: page,
			totalPages: Math.ceil(totalCount / limit),
			totalItems: totalCount
		});
	} catch (error) {
		return NextResponse.json(
			{ message: 'Error fetching employees' },
			{ status: 500 }
		);
	}
}