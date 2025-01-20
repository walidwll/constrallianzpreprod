//route for the company request creation and approval by the admin
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import JoinRequest from '@/models/JoinRequest';


export async function POST(request) {
    try {
        await connectDB(); 
        const formData = await request.json();

        const { companyName, companyCIF, company_addressligne1, company_addressComplementaire, company_zipcode, company_city, company_country, disponibility, director } = formData;
        const { first_name, last_name, email, phone_number, password,confirmPassword,position, identity_number, identity_type, profile_addressligne1, profile_addressComplementaire, profile_zipcode, profile_city, profile_country, } = director;
        if ( !companyName || !companyCIF || !company_addressligne1 || !company_zipcode || !company_city || !company_country || !disponibility 
            || !first_name || !last_name || !email || !phone_number || !password || !position || !identity_number || !identity_type || !profile_addressligne1 || !profile_zipcode || !profile_city || !profile_country )
            { return NextResponse.json( { message: "All required fields must be filled" }, { status: 400 } ); }
        
            const newJoinRequest = await JoinRequest.create({
                companyName,
                companyCIF,
                company_addressligne1,
                company_addressComplementaire,
                company_zipcode,
                company_city,
                company_country,
                disponibility,
                director: {
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
                  profile_zipcode,
                  profile_city,
                  profile_country
                  }
              });
        
        // Return success response with created data
        return NextResponse.json({ message: 'Join request submitted successfully', data: newJoinRequest }, { status: 201 });
    } catch (error) {
        console.error('Error submitting join request:', error);
        return NextResponse.json({ message: 'Error submitting join request', error: error.message }, { status: 500 });
    }
}