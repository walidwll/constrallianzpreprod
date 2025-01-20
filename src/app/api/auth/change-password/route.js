import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Employee from '@/models/Employee';
import Contractor from '@/models/Contractor';
import SubContractor from '@/models/SubContractor';
import Admin from '@/models/Admin';
import { verifyToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        await connectDB();

        const tokenObj = request.cookies.get('token') || request.cookies.get('adminToken');
        if (!tokenObj) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = tokenObj.value;
        const { previousPassword, newPassword } = await request.json();
        const decoded = await verifyToken(token);
        let user;
        if (decoded.role === 'Employee') {
            user = await Employee.findById(decoded.userId).select('+password');
        } else if (decoded.role === 'Contractor') {
            user = await Contractor.findById(decoded.userId).select('+password');
        } else if (decoded.role === 'Sub-Contractor') {
            user = await SubContractor.findById(decoded.userId).select('+password');
        } else if (decoded.role === 'admin') {
            user = await Admin.findById(decoded.userId).select('+password');
        }

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        const isPasswordValid = await bcrypt.compare(previousPassword, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Incorrect previous password' },
                { status: 400 }
            );
        }
        user.password = newPassword;
        await user.save();

        return NextResponse.json(
            { message: 'Password changed successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json(
            { message: 'Error changing password' },
            { status: 500 }
        );
    }
}