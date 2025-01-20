import Machinery from "@/models/Machinery";
import MachineryRequest from "@/models/MachineryRequest";
import connectDB from "@/lib/db";
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const filters = {};

        // Basic filters
        const name = searchParams.get('name');
        if (name) filters.name = { $regex: name, $options: 'i' };

        const category = searchParams.get('category');
        if (category) filters.category = category;

        const type = searchParams.get('type');
        if (type) filters.type = type;

        // Status filters
        const status = searchParams.get('status');
        if (status !== null && status !== '') {
            filters.status = status === 'true';
        }

        const isActive = searchParams.get('isActive');
        if (isActive !== null && isActive !== '') {
            filters.isActive = isActive === 'true';
        }
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        // Individual rating filters
        const minPerformance = searchParams.get('minPerformance');
        const minDurability = searchParams.get('minDurability');
        const minCostEfficiency = searchParams.get('minCostEfficiency');
        const minReliability = searchParams.get('minReliability');

        let machinery;
        const aggregatePipeline = [
            { $match: filters },
            {
                $addFields: {
                    avgPerformance: { $avg: "$rating.performance" },
                    avgDurability: { $avg: "$rating.durability" },
                    avgCostEfficiency: { $avg: "$rating.costEfficiency" },
                    avgReliability: { $avg: "$rating.reliability" }
                }
            }
        ];

        if (minPerformance) aggregatePipeline.push({ $match: { avgPerformance: { $gte: parseFloat(minPerformance) } } });
        if (minDurability) aggregatePipeline.push({ $match: { avgDurability: { $gte: parseFloat(minDurability) } } });
        if (minCostEfficiency) aggregatePipeline.push({ $match: { avgCostEfficiency: { $gte: parseFloat(minCostEfficiency) } } });
        if (minReliability) aggregatePipeline.push({ $match: { avgReliability: { $gte: parseFloat(minReliability) } } });

        aggregatePipeline.push(
            { $skip: skip },
            { $limit: limit }
        );

        machinery = await Machinery.aggregate(aggregatePipeline);

        const totalMachinery = await Machinery.countDocuments(filters);

        return NextResponse.json({ machinery, totalMachinery, currentPage: page, totalPages: Math.ceil(totalMachinery / limit) }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const { machineryId, projectId } = await request.json();


        const existingRequest = await MachineryRequest.findOne({
            machineryId,
            projectId,
            status: { $ne: 'rejected' }
        });

        if (existingRequest) {
            return NextResponse.json({ message: 'A request already exists' }, { status: 400 });
        }

        const newRequest = new MachineryRequest({
            projectId,
            machineryId,
            status: 'pending',
        });
        console.log(newRequest);
        await newRequest.save();

        return NextResponse.json({ message: 'Machinery request created successfully', request: newRequest }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
