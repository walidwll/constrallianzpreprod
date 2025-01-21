import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SubContractor from '@/models/SubContractor';
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
        const subContractorData = {};
        for (const [key, value] of formData.entries()) {
            if (key !== 'image') {
                subContractorData[key] = value;
            }
        }

        // Check if sub-contractor exists
        const existingSubContractor = await SubContractor.findOne({ email });

        if (!existingSubContractor) {
            return NextResponse.json(
                { message: 'Sub-contractor not found' },
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
            subContractorData.image = imageUploadResponse.secure_url;
        }

        // Update sub-contractor details
        await SubContractor.updateOne({ email }, subContractorData);

        return NextResponse.json(
            { message: 'Sub-contractor updated successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating sub-contractor:', error);
        return NextResponse.json(
            { message: error.message || 'Error updating sub-contractor' },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};