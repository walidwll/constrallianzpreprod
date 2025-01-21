import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import JoinRequest from '@/models/JoinRequest';
import Contractor from '@/models/Contractor';
import profileCompany from '@/models/ProfileCompany';
import Company from '@/models/Company';
import { sendMail } from '@/lib/mail';
// Import other necessary models
import SubContractor from '@/models/SubContractor';
import Employee from '@/models/Employee';
import Admin from '@/models/Admin';

// Define the isEmailTaken function
async function isEmailTaken(email) {
	const existingContractor = await Contractor.findOne({ email });
	const existingSubContractor = await SubContractor.findOne({ email });
	const existingEmployee = await Employee.findOne({ email });
	const existingAdmin = await Admin.findOne({ email });

	return !!(existingContractor || existingSubContractor || existingEmployee || existingAdmin);
}


// Validate contractor data before creation
//function validateContractorData(data) {
//    const required = ['name', 'email', 'phone', 'password'];
//    const missing = required.filter(field => !data[field]);
//    if (missing.length > 0) {
//        throw new Error(`Missing required fields: ${missing.join(', ')}`);
//    }
//    return true;
//}

// Validate contractor data before creation
function validateContractorData(data) {
    const required = ['first_name','last_name', 'email', 'phone_number', 'password','position','identity_number','identity_type','profile_addressligne1','profile_zipcode','profile_city','profile_country'];
    const missing = required.filter(field => !data[field]);
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    return true;
}

export async function PUT(request, context) {
	await connectDB();

	// Await context.params before accessing id
	const params = await context.params;
	const id = params.id;
	const { action } = await request.json();

	try {
		const joinRequest = await JoinRequest.findById(id);

		if (!joinRequest) {
			return NextResponse.json({ message: 'Join request not found' }, { status: 404 });
		}

		if (action === 'approve') {
			// Check for duplicate emails
			const emails = [
				joinRequest.director.email,
				//joinRequest.production.email,
				//joinRequest.supervisor.email,
			];

			for (const email of emails) {
				if (await isEmailTaken(email)) {
					return NextResponse.json(
						{ message: `Email ${email} is already registered` },
						{ status: 400 }
					);
				}
			}

			 // Validate and prepare contractor data
            try {
                validateContractorData(joinRequest.director);
                //validateContractorData(joinRequest.production);
                //validateContractorData(joinRequest.supervisor);
            } catch (error) {
                return NextResponse.json(
                    { message: `Validation failed: ${error.message}` },
                    { status: 400 }
                );
            }

			// Create contractors with complete data
            //const directorContractor = await Contractor.create({
            //    name: joinRequest.director.name,
            //    email: joinRequest.director.email,
            //    phone: joinRequest.director.phone,
            //    password: joinRequest.director.password,
            //    role: 'director'
            //});
			const directorRP = await profileCompany.create({
                first_name: joinRequest.director.first_name,
				last_name:joinRequest.director.first_name,
                email: joinRequest.director.email,
                phone_number: joinRequest.director.phone_number,
                password: joinRequest.director.password,
				position: joinRequest.director.position,
				identity_type: joinRequest.director.identity_type,
				identity_number:joinRequest.director.identity_number,
				profile_addressligne1:joinRequest.director.profile_addressligne1,
				profile_zipcode:joinRequest.director.profile_zipcode,
				profile_city:joinRequest.director.profile_city,
				profile_country:joinRequest.director.profile_country,
                role: 'director',
				isRP: true
            });

            //const productionContractor = await Contractor.create({
            //    name: joinRequest.production.name,
            //    email: joinRequest.production.email,
            //    phone: joinRequest.production.phone,
            //    password: joinRequest.production.password,
            //    role: 'production'
            //});

            //const supervisorContractor = await Contractor.create({
            // name: joinRequest.supervisor.name,
            // email: joinRequest.supervisor.email,
            // phone: joinRequest.supervisor.phone,
            // password: joinRequest.supervisor.password,
            // role: 'supervisor'
            //

			// Create company
			const company = await Company.create({
				name: joinRequest.companyName,
				company_id:joinRequest.companyCIF,
				company_addressligne1:joinRequest.company_addressligne1,
				company_addressComplementaire:joinRequest.company_addressComplementaire,
				company_zipcode:joinRequest.company_zipcode,
				company_city:joinRequest.company_city,
				company_country:joinRequest.company_country,
				disponibility:joinRequest.disponibility,
				profils: [directorRP._id],
			});

			// Update join request status
			joinRequest.status = 'approved';
			await joinRequest.save();

			// Send emails to contractors
			const contractors = [directorRP];

			for (const contractor of contractors) {
				await sendMail({
					to: contractor.email,
					subject: 'Company Approved',
					html: `<p>Hello ${contractor.name},</p><p>Your company ${company.name} has been approved.</p>`,
				});
			}

			return NextResponse.json({ 
                message: 'Join request approved and company created',
                company: company
            });
		} else if (action === 'reject') {
			joinRequest.status = 'rejected';
			await joinRequest.save();

			return NextResponse.json({ message: 'Join request rejected' });
		} else {
			return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
		}
	} catch (error) {
		console.error('Error processing join request:', error);
		return NextResponse.json({ 
            message: 'Error processing join request',
            error: error.message 
        }, { status: 500 });
	}
}