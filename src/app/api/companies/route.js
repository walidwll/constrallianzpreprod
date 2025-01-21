import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Company from '@/models/Company';
import mongoose from 'mongoose';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        await connectDB();

        const totalItems = await Company.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        const companies = await Company.find()
            .populate('profils', 'name role email _id') 
            .skip(skip)
            .limit(limit)
            .lean()  
            .exec(); 

        return NextResponse.json({
            companies,
            currentPage: page,
            totalPages,
            totalItems
        }, { status: 200 });

    } catch (error) {
        console.error('API Error:', {
            message: error.message,
            stack: error.stack,
            mongoState: mongoose.connection.readyState
        });
        
        return NextResponse.json({ 
            message: 'Error fetching companies',
            error: error.message
        }, { status: 500 });
    }
}