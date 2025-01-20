import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contractor from '@/models/Contractor';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const email = formData.get('email');

    // Convert FormData to object
    const contractorData = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'image') {
        contractorData[key] = value;
      }
    }

    // Check if contractor exists
    const existingContractor = await Contractor.findOne({ email });

    if (!existingContractor) {
      return NextResponse.json(
        { message: 'Contractor not found' },
        { status: 404 }
      );
    }

    // Handle image upload if a new image is provided
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      // Convert file to base64
      const imageBuffer = await imageFile.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString('base64');
      const imageDataURI = `data:${imageFile.type};base64,${imageBase64}`;

      const imageUploadResponse = await cloudinary.v2.uploader.upload(imageDataURI, {
        folder: 'profile_images',
      });
      contractorData.image = imageUploadResponse.secure_url;
    }

    // Update contractor details
    await Contractor.updateOne({ email }, contractorData);

    return NextResponse.json(
      { message: 'Contractor updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating contractor:', error);
    return NextResponse.json(
      { message: error.message || 'Error updating contractor' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};