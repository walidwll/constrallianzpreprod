import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SubContractorRequest from "@/models/SubContractorRequests";
import SubCompany from "@/models/SubCompany";
import SubContractor from "@/models/SubContractor";

export async function POST(request) {
  try {
    await connectDB();
    await SubContractorRequest.syncIndexes();
    const formData = await request.json();
    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      confirmPassword,
      position,
      identity_number,
      identity_type,
      profile_addressligne1,
      profile_addressComplementaire,
      profile_zipcode,
      profile_city,
      profile_country,
      inviteId,
      companyId,
      invitedBy,
      role,
      isRP,
    } = formData;
    console.log(formData);
    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone_number ||
      !password ||
      !position ||
      !identity_number ||
      !identity_type ||
      !profile_addressligne1 ||
      !profile_zipcode ||
      !profile_city ||
      !profile_country ||
      !role ||
      !invitedBy ||
      !companyId
    ) {
      return NextResponse.json(
        { message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const subContractorRequest = await SubContractorRequest.findById(inviteId);
    console.log(subContractorRequest);
    if (!subContractorRequest) {
      return NextResponse.json(
        { message: "Invite request not found" },
        { status: 404 }
      );
    }
    const subCompany = await SubCompany.findOne({ _id: companyId});
    if (!subCompany) {
      return new Response(JSON.stringify({ message: "subCompany not found" }), {
        status: 404,
      });
    }
    const subContractor = await SubContractor.create({
      first_name, 
      last_name,
      email,
      phone: phone_number,
      password, 
      companyPosition: position, 
      identity: { 
          type: identity_type, 
          number: identity_number,
      },
      address: {
          addressligne1: profile_addressligne1, 
          addressComplementaire: profile_addressComplementaire || "", 
          postalCode: profile_zipcode, 
          city: profile_city, 
          country: profile_country,
      },
      role, 
      isRP,
      companyId: subCompany._id, 
  });

    subContractorRequest.status = "approved";
    await subContractorRequest.save();

    return NextResponse.json(
      {
        message: "signup request approved and subContractor created",
        subContractor: subContractor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting signup request:", error);
    return NextResponse.json(
      { message: "Error submitting signup request", error: error.message },
      { status: 500 }
    );
  }
}
