import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use an App Password, not your real password
  },
});

export async function sendVerificationEmail(email: string, code: string) {
  const mailOptions = {
    from: '"Flip Finder" <noreply@flipfinder.com>',
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