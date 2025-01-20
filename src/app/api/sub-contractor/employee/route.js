import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Employee from '@/models/Employee';
import SubCompany from '@/models/SubCompany';
import mongoose from 'mongoose';

export async function GET(request) {
    await connectDB();
    try {
        const { searchParams } = new URL(request.url);
        const filters = {};

        const userRole = searchParams.get('userRole');
        const subContractorId = searchParams.get('subContractorId');

        if (userRole === 'Sub-Contractor' && !subContractorId) {
            return NextResponse.json({ message: 'SubContractor ID is required' }, { status: 400 });
        }

        // Name and email filter
        const searchTerm = searchParams.get('name');
        if (searchTerm) {
            filters.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        // Active status filter
        const isActive = searchParams.get('isActive');
        if (isActive !== null && isActive !== '') {
            filters.isActive = isActive === 'true';
        }

        // Worked hours filter
        const minWorkedHours = searchParams.get('minWorkedHours');
        if (minWorkedHours) {
            filters.workedHour = { $gte: parseFloat(minWorkedHours) };
        }

        // Individual rating filters
        const quality = searchParams.get('quality');
        const technical = searchParams.get('technical');
        const punctuality = searchParams.get('punctuality');
        const safety = searchParams.get('safety');

        const ratingFilters = [];
        const hasRatingFilter = quality || technical || punctuality || safety;

        // Ensure employee has ratings if any rating filter is applied
        if (hasRatingFilter) {
            ratingFilters.push({ 'rating.0': { $exists: true } });
        }

        if (quality) ratingFilters.push({ 'rating.quality': { $gte: parseInt(quality) } });
        if (technical) ratingFilters.push({ 'rating.technical': { $gte: parseInt(technical) } });
        if (punctuality) ratingFilters.push({ 'rating.punctuality': { $gte: parseInt(punctuality) } });
        if (safety) ratingFilters.push({ 'rating.safety': { $gte: parseInt(safety) } });

        if (ratingFilters.length > 0) {
            filters.$and = ratingFilters;
        }

        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        if (userRole === 'Sub-Contractor') {
            const subcompany = await SubCompany.findOne({ subContractorId });
            if (!subcompany) {
                return NextResponse.json({ message: 'Subcompany not found' }, { status: 404 });
            }

            filters._id = { $in: subcompany.employeesId.map(id => new mongoose.Types.ObjectId(id)) };
        }

        let employeesQuery = Employee.find(filters);

        // Get total count
        const totalEmployees = await employeesQuery.clone().countDocuments();

        // Apply pagination
        const employees = await employeesQuery
            .skip(skip)
            .limit(limit)
            .exec();

        return NextResponse.json({
            employees,
            totalEmployees,
            totalPages: Math.ceil(totalEmployees / limit),
            currentPage: page,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching employees:', error);
        return NextResponse.json({
            message: 'Error fetching employees',
            error: error.message
        }, { status: 500 });
    }
}