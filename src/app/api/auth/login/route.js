import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Employee from '@/models/Employee';
import Contractor from '@/models/Contractor';
import SubContractor from '@/models/SubContractor';
import { signToken } from '@/lib/jwt';
import profileCompany from '@/models/ProfileCompany';

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();
    let user;
    let role;

    user = await Employee.findOne({ email }).select('+password');
    if (user) {
      if (!user.isActive) {
        return NextResponse.json(
          { message: 'Your account is pending verification. Please wait for account activation.' },
          { status: 403 }
        );
      }
      role = 'Employee';
    } else {
      //user = await Contractor.findOne({ email }).select('+password');
      user = await profileCompany.findOne({ email }).select('+password');
      if (user) {
        role = 'Contractor';
      } else {
        user = await SubContractor.findOne({ email }).select('+password');
        if (user) {
          if (!user.isActive) {
            return NextResponse.json(
              { message: 'Your account is pending verification. Please wait for account activation.' },
              { status: 403 }
            );
          }
          role = 'Sub-Contractor';
        }
      }
    }

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
      role
    });

    const response = NextResponse.json(
      {
        message: 'Logged in successfully',
        role
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
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