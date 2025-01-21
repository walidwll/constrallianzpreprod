import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contractor from '@/models/Contractor';
import SubContractor from '@/models/SubContractor';
import Employee from '@/models/Employee';
import Admin from '@/models/Admin';
import { verifyToken } from '@/lib/jwt';
import profileCompany from '@/models/ProfileCompany';

export async function GET(request) {
    try {
        await connectDB();

        const tokenObj = request.cookies.get('token') || request.cookies.get('adminToken');

        if (!tokenObj) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = tokenObj.value;

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        let user;
        if (decoded.role === 'Contractor') {
            user = await profileCompany.findById(decoded.userId);
        } else if (decoded.role === 'Sub-Contractor') {
            user = await SubContractor.findById(decoded.userId);
        } else if (decoded.role === 'Employee') {
            user = await Employee.findById(decoded.userId);
        } else if (decoded.role === 'admin') {
            user = await Admin.findById(decoded.userId);
        }

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching user data' }, { status: 500 });
    }
}