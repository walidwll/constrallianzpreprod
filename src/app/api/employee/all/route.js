import Employee from "@/models/Employee";
import connectDB from "@/lib/db";
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const filters = {};

        // Name filter
        const name = searchParams.get('name');
        if (name) {
            filters.name = { $regex: name, $options: 'i' };
        }

        // Email filter
        const email = searchParams.get('email');
        if (email) {
            filters.email = { $regex: email, $options: 'i' };
        }

        // Active status filter
        const isActive = searchParams.get('isActive');
        if (isActive !== null && isActive !== '') {
            filters.isActive = isActive === 'true';
        }

        // Hourly rate filter
        const minHourlyRate = searchParams.get('minHourlyRate');
        const maxHourlyRate = searchParams.get('maxHourlyRate');
        if (minHourlyRate || maxHourlyRate) {
            filters.hourlyRate = {};
            if (minHourlyRate) filters.hourlyRate.$gte = parseFloat(minHourlyRate);
            if (maxHourlyRate) filters.hourlyRate.$lte = parseFloat(maxHourlyRate);
        }

        // Worked hours filter
        const minWorkedHours = searchParams.get('minWorkedHours');
        if (minWorkedHours) {
            filters.workedHour = { $gte: parseFloat(minWorkedHours) };
        }

        // Rating filter
        const rating = searchParams.get('rating');
        if (rating) {
            const employees = await Employee.aggregate([
                {
                    $match: filters
                },
                {
                    $addFields: {
                        avgRating: {
                            $avg: [
                                '$rating.quality',
                                '$rating.technical',
                                '$rating.punctuality',
                                '$rating.safety'
                            ]
                        }
                    }
                },
                {
                    $match: {
                        avgRating: { $gte: parseFloat(rating) }
                    }
                }
            ]);
            return NextResponse.json(employees, { status: 200 });
        }

        const employees = await Employee.find(filters);
        return NextResponse.json(employees, { status: 200 });

    } catch (error) {
        console.error('Error fetching employees:', error);
        return NextResponse.json({ message: error.message || 'Error fetching employees' }, { status: 500 });
    }
}

