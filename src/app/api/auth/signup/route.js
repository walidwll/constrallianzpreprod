import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Employee from '@/models/Employee';
import SubContractor from '@/models/SubContractor';
import SubCompany from '@/models/SubCompany';
import Application from '@/models/Application';
import cloudinary from 'cloudinary';
import { isEmailTaken } from '../../companies/add/route';
import SubContractorRequest from '@/models/SubContractorRequests';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function processNestedKey(targetObject, baseKey, fullKey, value) {
  const subKey = fullKey.replace(`${baseKey}.`, '');
  const subParts = subKey.split('.');

  let currentLevel = targetObject;
  for (let i = 0; i < subParts.length; i++) {
      const part = subParts[i];

      if (part.match(/^\d+$/)) {
          const arrayKey = subParts[i - 1];
          if (!Array.isArray(currentLevel[arrayKey])) {
              currentLevel[arrayKey] = [];
          }
          currentLevel[arrayKey][parseInt(part, 10)] = currentLevel[arrayKey][parseInt(part, 10)] || {};
          currentLevel = currentLevel[arrayKey][parseInt(part, 10)];
      } else if (i === subParts.length - 1) {
          if (baseKey === 'subCompany' && (part === 'subActivities' || part === 'regions')) {
              // Special handling for subActivities and regions
              if (!Array.isArray(currentLevel[part])) {
                  currentLevel[part] = [];
              }
              currentLevel[part].push(value);
          } else {
              currentLevel[part] = value;
          }
      } else {
          if (!currentLevel[part]) {
              currentLevel[part] = {};
          }
          currentLevel = currentLevel[part];
      }
  }
}


function transformSubActivities(subCompany) {
      // Ensure subActivities are flattened to an array of strings
    if (subCompany.subActivities?.subActivities && Array.isArray(subCompany.subActivities.subActivities)) {
      subCompany.subActivities = subCompany.subActivities.subActivities.map((activity) => {
          return activity.value; // Extract the 'value' from each object
      });
    } else {
        console.warn("Invalid subActivities format, setting to an empty array.");
        subCompany.subActivities = [];
    }
    return subCompany;
}

function transformRegions(subCompany) {
    // Ensure regions are flattened to an array of strings
    if (subCompany.regions?.regions && Array.isArray(subCompany.regions.regions)) {
      subCompany.regions = subCompany.regions.regions.map((region) => {
          return region.value; // Extract the 'value' from each object
      });
    } else {
        console.warn("Invalid regions format, setting to an empty array.");
        subCompany.regions = [];
    }
    return subCompany;
}

async function uploadDocument(file) {
  if (!file) return null;

  // Get file extension from original filename
  const extension = file.name.split('.').pop().toLowerCase();

  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const dataURI = `data:${file.type};base64,${base64}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI, {
    folder: 'company_documents',
    resource_type: 'auto',
    public_id: `doc_${Date.now()}.${extension}` // Add extension to the filename
  });
  return uploadResponse.secure_url;
}

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const type = formData.get('type');

    // Convert FormData to object and handle nested document fields
    const userData = {};
    const documents = {};
    const subCompanyData ={};
    let user = null;

   for (const [key, value] of formData.entries()) {
        if (key.startsWith('documents.')) {
            const docType = key.split('.')[1];
            documents[docType] = value; // Collect document types and their binary content
        } else if (key === 'identity') {
            const id = formData.get('identity');
            userData.identity = {};
            userData.identity['type'] = id.type;
            userData.identity['number'] = id.number;
        } else if (key === 'address') {
            const addressKey = formData.get('address');
            userData.address = {};
            userData.address['addressligne1'] = addressKey.addressligne1;
            userData.address['addressComplementaire'] = addressKey.addressComplementaire || "";
            userData.address['city'] = addressKey.city;
            userData.address['postalCode'] = addressKey.postalCode;
            userData.address['country'] = addressKey.country;
        } else if (key.startsWith('subCompany.')) {
            processNestedKey(subCompanyData, 'subCompany', key, value);
        }else if (key !== 'image' && key !== 'cv' && key !== 'subCompany' && key !== 'type') {
            // Collect all other user data fields
            userData[key] = value;
        }
    }

    if (subCompanyData.subActivities) {
      transformSubActivities(subCompanyData);
    }
    if (subCompanyData.regions) {
      transformRegions(subCompanyData);
    }
    // Check if email is taken across all roles
    const isEmailExists = await isEmailTaken(userData.email);
    if (isEmailExists) {
      return NextResponse.json(
        { message: 'Email already registered in the system' },
        { status: 400 }
      );
    }

    // Handle image upload with extension
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      const extension = imageFile.name.split('.').pop().toLowerCase();
      const imageBuffer = await imageFile.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString('base64');
      const imageDataURI = `data:${imageFile.type};base64,${imageBase64}`;

      const imageUploadResponse = await cloudinary.v2.uploader.upload(imageDataURI, {
        folder: 'profile_images',
        public_id: `profile_${Date.now()}.${extension}`
      });
      userData.image = imageUploadResponse.secure_url;
    }else{
      userData.image = '';
    }



    if (type === 'Employee') {
      const cvFile = formData.get('cv');
      if (cvFile && cvFile.size > 0) {
        const extension = cvFile.name.split('.').pop().toLowerCase();
        const cvBuffer = await cvFile.arrayBuffer();
        const cvBase64 = Buffer.from(cvBuffer).toString('base64');
        const cvDataURI = `data:${cvFile.type};base64,${cvBase64}`;

        const cvUploadResponse = await cloudinary.v2.uploader.upload(cvDataURI, {
          folder: 'cv_files',
          public_id: `cv_${Date.now()}.${extension}`
        });
        userData.cv = cvUploadResponse.secure_url;
      }
    

    const subCompanyId = formData.get('subCompanyId');
    if (subCompanyId) {
      userData.subCompanyId = subCompanyId;
    }

    }

    if (type === 'Sub-Contractor') {
      // Upload all required documents
      const uploadedDocuments = {};
      const requiredDocuments = [
        'ownershipCertificate',
        'agreement',
        'privacyDocument',
        'platformRegulation',
        'obraliaRegistration'
      ];

      for (const docType of requiredDocuments) {
        const file = documents[docType];
        if (file) {
          const url = await uploadDocument(file);
          if (url) {
            uploadedDocuments[docType] = url;
          }
        }
      }

      subCompanyData.documents=uploadedDocuments;
      const subCompany = await SubCompany.create(subCompanyData);
      // Check if subCompany was successfully created
      if (!subCompany) {
        throw new Error('SubCompany creation failed.');
    
      }
      userData.companyId=subCompany._id;
      userData.isRP=true;
      
      user = await SubContractor.create(userData);
      
        // Check if user was successfully created
        if (!user) {
          throw new Error('SubContractor creation failed.');
        }
      subCompany.subContractorId=user._id;
      await subCompany.save();
      
      const subContractorRequest =await SubContractorRequest.create({
        SubContractorId: user._id,
        status: 'pending',
      });
        if (!subContractorRequest) {
          throw new Error('SubContractorRequest creation failed.');
        }

    }

    if (type === 'Employee') {
      user = await Employee.create(userData);
      const subCompanyId = formData.get('subCompanyId');
      if (subCompanyId) {
        const subCompany = await SubCompany.findById(subCompanyId).populate('subContractorId');
        if (subCompany && subCompany.subContractorId) {
          await Application.create({
            subContractorId: subCompany.subContractorId,
            employeeId: user._id,
            status: 'pending'
          });
        }
      }
    }

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: error.message || 'Error creating user' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};