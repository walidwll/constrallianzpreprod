import { verifyToken, verifyTokenInite } from '@/lib/jwt';
import SubContractorRequest from '@/models/SubContractorRequests';
import dbConnect from "@/lib/db";
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ message: 'Token is required' }, { status: 400 });
    }

    const decoded = await verifyTokenInite(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    const invite = await SubContractorRequest.findById(decoded._id);
    if (!invite) {
      return NextResponse.json({ message: 'Invitation not found' }, { status: 404 });
    }

    const response = NextResponse.json({ invite }, { status: 200 });
    response.cookies.set('invitetoken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400
    });
    return response;
  } catch (error) {
    console.error('Error validating token:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
