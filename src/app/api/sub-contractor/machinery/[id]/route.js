import Machinery from '@/models/Machinery';
import SubCompany from '@/models/SubCompany';
import connectDB from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        
        const machinery = await Machinery.findById(id)
            .populate({
                path: 'rating.reviewedBy',
                select: 'name email',
                options: { strictPopulate: false }
            })
            .populate('subContractorId', 'name email')
            .lean();

        if (!machinery) {
            return NextResponse.json({ message: 'Machinery not found' }, { status: 404 });
        }

        // Find SubCompany using subContractorId from machinery
        const subCompany = await SubCompany.findOne({ 
            subContractorId: machinery.subContractorId._id 
        }).select('name').lean();

        const machineryWithSubCompany = {
            ...machinery,
            subCompanyName: subCompany?.name || 'Not Assigned'
        };

        return NextResponse.json(machineryWithSubCompany);
    } catch (error) {
        console.error('Error fetching machinery:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const machinery = await Machinery.findById(id);
        if (!machinery) {
            return NextResponse.json({ message: 'Machinery not found' }, { status: 404 });
        }

        if (body.rating && Array.isArray(body.rating)) {
            const newRatings = body.rating.map(rating => {
                // Validate required numeric fields
                const requiredFields = ['performance', 'durability', 'costEfficiency', 'reliability'];
                for (const field of requiredFields) {
                    if (typeof rating[field] !== 'number' || rating[field] < 0 || rating[field] > 5) {
                        throw new Error(`Invalid ${field} rating. Must be a number between 0 and 5`);
                    }
                }

                // Create new rating document following the schema
                const newRating = {
                    performance: Number(rating.performance),
                    durability: Number(rating.durability),
                    costEfficiency: Number(rating.costEfficiency),
                    reliability: Number(rating.reliability),
                    review: rating.review || '',
                    reviewedBy: rating.reviewedBy
                };

                return newRating;
            });

            // Initialize rating array if it doesn't exist
            if (!Array.isArray(machinery.rating)) {
                machinery.rating = [];
            }

            // Add new ratings to the existing array
            machinery.rating = [...machinery.rating, ...newRatings];

            // Save the updated machinery
            const updatedMachinery = await machinery.save();

            // Populate the reviewedBy field
            await updatedMachinery.populate({
                path: 'rating.reviewedBy',
                select: 'name email role'
            });

            return NextResponse.json(updatedMachinery);
        }

        return NextResponse.json({ message: 'No rating data provided' }, { status: 400 });
    } catch (error) {
        console.error('Rating update error:', error);
        return NextResponse.json({
            message: error.message || 'Failed to update machinery rating',
            error: error.toString()
        }, { status: 500 });
    }
}


