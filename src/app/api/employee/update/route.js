import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Employee from '@/models/Employee';
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

        const employeeData = {};
        for (const [key, value] of formData.entries()) {
            if (key !== 'image' && key !== 'cv') {
                employeeData[key] = value;
            }
        }

        // Check if employee exists
        const existingEmployee = await Employee.findOne({ email });

        if (!existingEmployee) {
            return NextResponse.json(
                { message: 'Employee not found' },
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
            employeeData.image = imageUploadResponse.secure_url;
        }

        // Handle CV upload if a new CV is provided
        const cvFile = formData.get('cv');
        if (cvFile && cvFile.size > 0) {
            // Convert file to base64
            const cvBuffer = await cvFile.arrayBuffer();
            const cvBase64 = Buffer.from(cvBuffer).toString('base64');
            const cvDataURI = `data:${cvFile.type};base64,${cvBase64}`;

            const cvUploadResponse = await cloudinary.v2.uploader.upload(cvDataURI, {
                folder: 'cv_files',
            });
            employeeData.cv = cvUploadResponse.secure_url;
        }

        // Update employee details
        await Employee.updateOne({ email }, employeeData);

        return NextResponse.json(
            { message: 'Employee updated successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating employee:', error);
        return NextResponse.json(
            { message: error.message || 'Error updating employee' },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};