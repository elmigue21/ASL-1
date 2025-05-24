import dotenv from 'dotenv'
import path from "path";
import nodemailer from "nodemailer";
// dotenv.config()


// Define your custom env path
const envPath = path.resolve('./.env.local');
console.log('Loading env TRANSPORTER from:', envPath);

// Load it
dotenv.config({ path: envPath });

console.log("TRANSPORTER Email:", process.env.EMAIL_CLIENT);
console.log("TRANSPORTER Password:", process.env.EMAIL_CLIENT_PASSWORD);

export const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: process.env.EMAIL_CLIENT,
    pass: process.env.EMAIL_CLIENT_PASSWORD, // your regular password here
  },
});