import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Machinery from '@/models/Machinery';
import Project from '@/models/Project';

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const subcontractorId = searchParams.get('subcontractorId');
        let page = parseInt(searchParams.get('page') || '1');
        let limit = parseInt(searchParams.get('limit') || '10');
        const searchQuery = searchParams.get('search') || '';

        if (isNaN(page) || page < 1) {
            page = 1;
        }
        if (isNaN(limit) || limit < 1) {
            limit = 10;
        }
        const skip = Math.max((page - 1) * limit, 0);

        if (!subcontractorId || subcontractorId === undefined) {
            return NextResponse.json(
                { message: 'Subcontractor ID is required' },
                { status: 400 }
            );
        }

        const filter = {
            subContractorId: subcontractorId,
            isActive: { $ne: false },
            ...(searchQuery && {
                $or: [
                    { name: { $regex: searchQuery, $options: 'i' } },
                    { category: { $regex: searchQuery, $options: 'i' } },
                    { model: { $regex: searchQuery, $options: 'i' } },
                ],
            }),
        };

        const machinery = await Machinery.find(filter)
            .populate('projectId')
            .skip(skip)
            .limit(limit);

        const total = await Machinery.countDocuments(filter);

        return NextResponse.json({ machinery, total }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        debugger
        await connectDB();
        let { name, category, model, type, subcontractorId, hourlyRate } = await request.json();

        if (!name || !category || !model || !type || !hourlyRate || !subcontractorId) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const machinery = new Machinery({
            name,
            category,
            model,
            hourlyRate,
            type,
            subContractorId: subcontractorId,
            projectId: null,
        });

        await machinery.save();
        return NextResponse.json(machinery, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await connectDB();
        let { id, updates } = await request.json();
        if (updates.projectId === "") {
            updates.projectId = null;
        }

        if (updates.projectId) {
            const project = await Project.findOne({ _id: updates.projectId, companyId: updates.subContractorId });
            if (!project) {
                return NextResponse.json(
                    { message: 'Project does not belong to your company' },
                    { status: 400 }
                );
            }
        }

        const machinery = await Machinery.findByIdAndUpdate(id, updates, { new: true }).populate('projectId');

        if (!machinery) {
            return NextResponse.json(
                { message: 'Machinery not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(machinery, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectDB();
        const { id } = await request.json();

        const machinery = await Machinery.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!machinery) {
            return NextResponse.json({ message: 'Machinery not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Machinery deactivated successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}