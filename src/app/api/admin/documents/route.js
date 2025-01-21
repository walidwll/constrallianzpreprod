import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Documents from '@/models/Documents';
import cloudinary from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function deleteOldDocument(publicId) {
    if (publicId) {
        try {
            await cloudinary.v2.uploader.destroy(publicId);
        } catch (error) {
            console.error('Error deleting old document:', error);
        }
    }
}

async function uploadDocument(file, oldUrl) {
    if (!file) return oldUrl;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only PDF and Word documents are allowed.');
    }

    // Delete old file if exists
    if (oldUrl) {
        const publicId = oldUrl.split('/').slice(-1)[0].split('.')[0];
        await deleteOldDocument(publicId);
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    // Get file extension from the original filename
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}.${fileExtension}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI, {
        folder: 'admin_documents',
        resource_type: 'auto',
        public_id: fileName.split('.')[0], 
        format: fileExtension
    });
    return uploadResponse.secure_url;
}

export async function GET() {
    try {
        await connectDB();
        const documents = await Documents.findOne();
        return NextResponse.json(documents || {});
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const formData = await request.formData();
        const existingDocs = await Documents.findOne();

        const updatedDocs = {};
        for (const [key, value] of formData.entries()) {
            if (['agreement', 'privacyDocument', 'platformRegulation'].includes(key)) {
                if (value instanceof File) {
                    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                    if (!allowedTypes.includes(value.type)) {
                        return NextResponse.json(
                            { error: `Invalid file type for ${key}. Only PDF and Word documents are allowed.` },
                            { status: 400 }
                        );
                    }
                    updatedDocs[key] = await uploadDocument(value, existingDocs?.[key]);
                }
            }
        }

        const documents = await Documents.findOneAndUpdate(
            {},
            { $set: updatedDocs },
            { upsert: true, new: true }
        );

        return NextResponse.json(documents);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}