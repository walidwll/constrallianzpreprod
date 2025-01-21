import { verifyToken, verifyTokenInite } from '@/lib/jwt';
import InviteRequest from '@/models/InviteRequest';
import dbConnect from "@/lib/db";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return new Response(JSON.stringify({ message: 'Token is required' }), { status: 400 });
    }
    const decoded = await verifyTokenInite(token);
    if (!decoded) {
      return new Response(JSON.stringify({ message: 'Invalid or expired token' }), { status: 401 });
    }
    const invite = await InviteRequest.findById(decoded._id);
    if (!invite) {
      return new Response(JSON.stringify({ message: 'Invitation not found:' }), { status: 404 });
    }
    return new Response(JSON.stringify({ invite }), { status: 200 });
  } catch (error) {
    console.error('Error validating token:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}
