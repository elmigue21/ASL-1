import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // or your SMTP provider
  auth: {
    user: "gueljohnc@gmail.com", // Your email
    pass: "pwoy mwtu jkyb juxr", // Your email password or App Password
  },
});
