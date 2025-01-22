const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	host: 'constrallianz.com', 
	port: 465,
	secure: true, 
	auth: {
	  user:  process.env.SMTP_SERVER_USERNAME,
	  pass:  process.env.SMTP_SERVER_PASSWORD
	}
  });

export const sendMail = async ({ to, subject, html }) => {
	try {
		const mailOptions = {
			from: '"Constrallianz" <support@constrallianz.com>',
			to,
			subject,
			html
		};
		const data = await transporter.sendMail(mailOptions);
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
		from: '"Constrallianz" <support@constrallianz.com>',
		to: email, 
		subject: 'You’re Invited to Join Our Platform',
		html: `
		  <p>Hello,</p>
		  <p>You have been invited to join our platform. Click the link below to complete your signup:</p>
		  <a href="${inviteLink}" target="_blank">Complete Signup</a>
		  <p>If you did not request this, please ignore this email.</p>
		`,
	  };
  
	  const data = await transporter.sendMail(mailOptions);
	  return data;
	} catch (error) {
	  console.error('Error sending email:', error);
	  throw new Error('Unable to send invite email.');
	}
  };