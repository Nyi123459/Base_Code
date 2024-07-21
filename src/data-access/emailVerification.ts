import nodemailer from "nodemailer";
import { AUTH_EMAIL, AUTH_PASSWORD } from "../config";
import { error, info } from "console";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

export function sendEmailVerification(
  email: string,
  token: string
): Promise<void> {
  const verificationUrl = `http://localhost:5000/api/user/verify/${token}`;
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Email Verification",
    html: `<p>Please verify your email by clicking on the following link: <a href="${verificationUrl}"><button>Confirm</button></a></p>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(new Error("Error sending email"));
      } else {
        console.log("Email sent:", info.response);
        resolve();
      }
    });
  });
}
