import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import InviteRequest from '@/models/InviteRequest';
import { generateInviteLink } from '@/lib/jwt';
import { sendInviteEmail } from '@/lib/mail';


export async function POST(request) {
    try {
        await connectDB(); 
        const formData = await request.json();
        const {first_name,last_name,email,role,invitedBy,isRP,addProject} = formData;
        if( !first_name || !last_name || !email || !role || !invitedBy ){
            return NextResponse.json( { message: "All required fields must be filled" }, { status: 400 } );
        }
        const newinviteRequest = await InviteRequest.create({
            first_name,
            last_name,
            email,
            role,
            invitedBy,
            isRP,
            addProject
          });

          // Generate the invite link
        const inviteLink = await generateInviteLink(newinviteRequest);

          // Send the invite email
         await sendInviteEmail(email, inviteLink);

          return NextResponse.json({ message: 'Invite request submitted successfully', data: newinviteRequest }, { status: 201 });
    } catch (error) {
        console.error('Error submitting invite request:', error);
        return NextResponse.json({ message: 'Error submitting invite request', error: error.message }, { status: 500 });
    }
}