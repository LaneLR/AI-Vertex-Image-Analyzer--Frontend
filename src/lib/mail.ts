import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const mailOptions = {
    from: '"Flip Finder" <testemail@gmail.com>',
    to,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
        <h2 style="color: #3b82f6;">Flip Finder</h2>
        ${html}
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280;">If you have any questions, contact us at support@yourdomain.com</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendVerificationEmail(email: string, code: string) {
  const mailOptions = {
    from: '"Flip Finder" <testemail@gmail.com>',
    to: email,
    subject: "Your Flip Finder Verification Code",
    html: `
      <div style="font-family: sans-serif; text-align: center;">
        <h1>Welcome to Flip Finder!</h1>
        <p>Use the code below to verify your account:</p>
        <h2 style="letter-spacing: 5px; color: #3b82f6;">${code}</h2>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}