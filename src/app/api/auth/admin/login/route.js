import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { signToken } from '@/lib/jwt';

export async function POST(request) {
    try {
        await connectDB();

        const { email, password } = await request.json();

        const user = await Admin.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = await signToken({
            userId: user._id,
            role: "admin"
        });

        const response = NextResponse.json(
            {
                message: 'Logged in successfully',
                role: "admin"
            },
            { status: 200 }
        );

        response.cookies.set('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { message: 'Error logging in' },
            { status: 500 }
        );
    }
}