import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gueljohnc@gmail.com",
    pass: "pwoy mwtu jkyb juxr",
  },
});
