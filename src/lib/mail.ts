// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail", 
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// interface EmailOptions {
//   to: string;
//   subject: string;
//   html: string;
// }

// const APP_NAME = "ResaleIQ";
// const APP_FIRST_WORD = "RESALE";
// const APP_SECOND_WORD = "IQ";
// const BRAND_COLOR1 = "#ff6000";
// const BRAND_COLOR2 = "#3b82f6";

// export async function sendEmail({ to, subject, html }: EmailOptions) {
//   const mailOptions = {
//     from: `"${APP_NAME}" <testemail@gmail.com>`,
//     to,
//     subject,
//     html: `
//       <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center;">
//         <div style="display:flex; text-align:center; width:100%; font-weight:700; padding-bottom:10px; justify-content: center; align-items: center;">  
//           <h2 style="color: black;">${APP_FIRST_WORD}</h2>
//           <h2 style="color: ${BRAND_COLOR1};">${APP_SECOND_WORD}</h2>
//         </div>
//         ${html}
//         <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
//         <p style="font-size: 12px; color: #6b7280;">If you have any questions, contact us at support@yourdomain.com</p>
//       </div>
//     `,
//   };

//   return transporter.sendMail(mailOptions);
// }

// export async function sendVerificationEmail(email: string, code: string) {
//   const mailOptions = {
//     from: `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: `Your ${APP_NAME} Verification Code`,
//     html: `
//       <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center;">
//         <div style="display:flex; text-align:center; width:100%; font-weight:700; padding-bottom:10px; justify-content: center; align-items: center;">  
//           <h2 style="color: black;">${APP_FIRST_WORD}</h2>
//           <h2 style="color: ${BRAND_COLOR1};">${APP_SECOND_WORD}</h2>
//         </div>
        
//         <h1>Verify Your Account</h1>
//         <p>Use the code below to complete your registration:</p>
//         <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
//           <h2 style="letter-spacing: 10px; color: ${BRAND_COLOR2}; font-size: 32px; margin: 0;">${code}</h2>
//         </div>
//         <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes.</p>
//       </div>
//     `,
//   };

//   return transporter.sendMail(mailOptions);
// }

// export async function sendResetPasswordEmail(email: string, code: string) {
//   const mailOptions = {
//     from: `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: `Reset your ${APP_NAME} password`,
//     html: `
//       <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center;">
//         <div style="display:flex; text-align:center; width:100%; font-weight:700; padding-bottom:10px; justify-content: center; align-items: center;">  
//           <h2 style="color: black;">${APP_FIRST_WORD}</h2>
//           <h2 style="color: ${BRAND_COLOR1};">${APP_SECOND_WORD}</h2>
//         </div>

//         <h1>Password Reset Request</h1>
//         <p>We received a request to reset your password. Use the code below to proceed:</p>
//         <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
//           <h2 style="letter-spacing: 10px; color: ${BRAND_COLOR2}; font-size: 32px; margin: 0;">${code}</h2>
//         </div>
//         <p>If you did not request this, you can safely ignore this email.</p>
//         <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
//         <p style="font-size: 12px; color: #6b7280;">Secure Account Services by ${APP_NAME}</p>
//       </div>
//     `,
//   };

//   return transporter.sendMail(mailOptions);
// }