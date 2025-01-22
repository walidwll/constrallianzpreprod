import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Company from '@/models/Company';
import profileCompany from '@/models/ProfileCompany';
import SubContractorRequest from '@/models/SubContractorRequests';


export async function POST(request) {
    try {
        await connectDB(); 
        await SubContractorRequest.syncIndexes();
        const formData = await request.json();
        const { first_name, last_name, email, phone_number, password,confirmPassword,position, identity_number, identity_type, profile_addressligne1, profile_addressComplementaire, profile_zipcode, profile_city, profile_country,inviteId,company_id,role,isRP,addProject} = formData;
        console.log(formData);
        if ( !first_name || !last_name || !email || !phone_number || !password || !position || !identity_number || !identity_type || !profile_addressligne1 || !profile_zipcode || !profile_city || !profile_country || !role )
            { return NextResponse.json( { message: "All required fields must be filled" }, { status: 400 } ); }
        
        const subContractorRequest = await SubContractorRequest.findById(inviteId);
        console.log(subContractorRequest);
        if (!subContractorRequest) {
			return NextResponse.json({ message: 'Invite request not found' }, { status: 404 });
		}
        console.log(company_id);
        const company = await Company.findById(company_id)
                     .populate('profils')
                     .exec();
                     console.log(company);
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
        
        
        subContractorRequest.status = 'approved';
        await subContractorRequest.save();

        return NextResponse.json({ 
            message: 'signup request approved and profile created',
            profile: profile
        }, { status: 201 });
        
    } catch (error) {
        console.error('Error submitting signup request:', error);
        return NextResponse.json({ message: 'Error submitting signup request', error: error.message }, { status: 500 });
    }
}