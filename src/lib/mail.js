import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({ to, subject, html }) => {
	try {
		const data = await resend.emails.send({
			from: 'Site Management <onboarding@resend.dev>',
			to,
			subject,
			html
		});
		console.log('Email sent:', data);
		return data;
	} catch (error) {
		console.error('Error sending email:', error);
		throw error;
	}
};

export const sendInviteEmail = async (email, inviteLink) => {
	try {
	  const mailOptions = {
		from: '"Constrallianz" <onboarding@resend.dev>',
		to: email, 
		subject: 'You’re Invited to Join Our Platform',
		html: `
		  <p>Hello,</p>
		  <p>You have been invited to join our platform. Click the link below to complete your signup:</p>
		  <a href="${inviteLink}" target="_blank">Complete Signup</a>
		  <p>If you did not request this, please ignore this email.</p>
		`,
	  };
  
	  const data = await resend.emails.send(mailOptions);
	  console.log(`Invite email sent to ${email}`);
	  console.log('Email sent:', data);
	  return data;
	} catch (error) {
	  console.error('Error sending email:', error);
	  throw new Error('Unable to send invite email.');
	}
  };