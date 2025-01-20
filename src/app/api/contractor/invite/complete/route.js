import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Company from '@/models/Company';
import profileCompany from '@/models/ProfileCompany';
import SubContractor from '@/models/SubContractor';
import { Employee } from '@/models';
import Admin from '@/models/Admin';
import InviteRequest from '@/models/InviteRequest';


// Define the isEmailTaken function
async function isEmailTaken(email) {
	const existingContractor = await profileCompany.findOne({ email });
	const existingSubContractor = await SubContractor.findOne({ email });
	const existingEmployee = await Employee.findOne({ email });
	const existingAdmin = await Admin.findOne({ email });

	return !!(existingContractor || existingSubContractor || existingEmployee || existingAdmin);
}


export async function POST(request) {
    try {
        await connectDB(); 
        const formData = await request.json();
        const { first_name, last_name, email, phone_number, password,confirmPassword,position, identity_number, identity_type, profile_addressligne1, profile_addressComplementaire, profile_zipcode, profile_city, profile_country,inviteId,invitedBy,role,isRP,addProject} = formData;
        if ( !first_name || !last_name || !email || !phone_number || !password || !position || !identity_number || !identity_type || !profile_addressligne1 || !profile_zipcode || !profile_city || !profile_country || !role )
            { return NextResponse.json( { message: "All required fields must be filled" }, { status: 400 } ); }
        
        const inviteRequest = await InviteRequest.findById(inviteId);
        if (!inviteRequest) {
			return NextResponse.json({ message: 'Invite request not found' }, { status: 404 });
		}

       // if (await isEmailTaken(email)) {
       //     return NextResponse.json(
       //         { message: `Email ${email} is already registered` },
       //         { status: 400 }
       //     );
       // }

        const company = await Company.findOne({ profils: { $in: [invitedBy] } })
                     .populate('profils') 
                     .exec();
        if (!company) {
            return new Response(JSON.stringify({ message: 'Company not found' }), { status: 404 });
        }

        
        const profile = await profileCompany.create({
            first_name,
            last_name, 
            email, 
            phone_number, 
            password,
            position, 
            identity_number, 
            identity_type, 
            profile_addressligne1,
            profile_addressComplementaire, 
            profile_zipcode, profile_city, 
            profile_country,
            role,
            isRP,
            companyId:company._id,
        });

        company.profils.push(profile._id);
        await company.save();

        inviteRequest.status = 'accepted';
        await inviteRequest.save();

        return NextResponse.json({ 
            message: 'signup request approved and profile created',
            profile: profile
        }, { status: 201 });
        
    } catch (error) {
        console.error('Error submitting signup request:', error);
        return NextResponse.json({ message: 'Error submitting signup request', error: error.message }, { status: 500 });
    }
}