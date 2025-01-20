//route for the company request creation and approval by the admin
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import JoinRequest from '@/models/JoinRequest';

export async function POST(request) {
    try {
        await connectDB(); 
        const formData = await request.json();

        // Validate required fields
        const { companyName, director, production, supervisor } = formData;
        if (!companyName || !director || !production || !supervisor) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        // Create new join request
        const newJoinRequest = await JoinRequest.create({
            companyName,
            director,
            production,
            supervisor,
        });

        // Return success response with created data
        return NextResponse.json({ message: 'Join request submitted successfully', data: newJoinRequest }, { status: 201 });
    } catch (error) {
        console.error('Error submitting join request:', error);
        return NextResponse.json({ message: 'Error submitting join request', error: error.message }, { status: 500 });
    }
}