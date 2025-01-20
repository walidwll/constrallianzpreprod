//backend route for suppot
import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/mail';

// Change to named export
export const POST = async (request) => {
	try {
		const { email, message, subject, category } = await request.json();

		if (!email || !message || !subject || !category) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Send email to support
		await sendMail({
			to: 'support@constrallianz.com',
			subject: `Support Request: ${subject}`,
			html: `
                <h2>New Support Request</h2>
                <p><strong>From:</strong> ${email}</p>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
		});

		// Send confirmation to user
		await sendMail({
			to: email,
			subject: 'Support Request Received',
			html: `
                <h2>We've Received Your Support Request</h2>
                <p>Thank you for contacting us. We'll get back to you as soon as possible.</p>
                <p><strong>Your message details:</strong></p>
                <p>Category: ${category}</p>
                <p>Subject: ${subject}</p>
                <p>Message: ${message}</p>
            `
		});

		return NextResponse.json({
			message: 'Support request sent successfully'
		});
	} catch (error) {
		console.error('Support request error:', error);
		return NextResponse.json(
			{ error: 'Failed to send support request' },
			{ status: 500 }
		);
	}
}