import { Request, Response, RequestHandler } from "express";
// import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path
import { createClient } from "@supabase/supabase-js";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { transporter } from "../../lib/emailTransporter";
import axios from "axios";
import { Email } from "@/types/email";
import jwt from 'jsonwebtoken'

// import { axios } from './../../node_modules/axios/dist/esm/axios';
interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}

export const sendEmails: RequestHandler = async (req, res) => {
  try {
    // Normalize emailIds from req.body
    let emailIdsRaw = req.body.emailIds;
    let emailIds: number[] = [];

    if (Array.isArray(emailIdsRaw)) {
      emailIds = emailIdsRaw.map((id) => Number(id)).filter((id) => !isNaN(id));
    } else if (typeof emailIdsRaw === "string") {
      if (emailIdsRaw.includes(",")) {
        emailIds = emailIdsRaw
          .split(",")
          .map((id) => Number(id.trim()))
          .filter((id) => !isNaN(id));
      } else {
        const singleId = Number(emailIdsRaw);
        if (!isNaN(singleId)) emailIds = [singleId];
      }
    }

    if (!emailIds.length) {
      res.status(400).json({ message: "No emails selected" });
      return;
    }

    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      console.log("No supabase user");
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { data, error } = await supabaseUser
      .from("emails")
      .select("*") // all columns including subscriber_id
      .in("id", emailIds);

    if (error) {
      throw new Error(error.message);
    }

    
    console.log("BODY:", req.body);


    // Extract attachments from multer
    const attachments = (req.files as Express.Multer.File[] | undefined) ?? [];

    let emailResults: string[] = [];

    const EMAIL_SECRET = process.env.EMAIL_SECRET;
    if (!EMAIL_SECRET) {
      console.error("email secret not found");
      res.status(500).json({ message: "Email secret not configured" });
      return;
    }
const cleanBody = Object.assign({}, req.body);
console.log("cleanBody:", cleanBody);

const emailSubject = cleanBody.emailSubject;




const emailHtml = cleanBody.emailHtml;
const fromName = cleanBody.fromName;

const emailText = cleanBody.emailText;
    const emailPromises = data.map((email) => {
      // Assert that email has subscriber_id (even if Email interface doesn't define it)
      const emailWithSubscriber = email as typeof email & {
        subscriber_id: number;
      };
// const { emailText } = JSON.parse(JSON.stringify(req.body));
      const payload = {
        emailId: emailWithSubscriber.id,
        subscriberId: emailWithSubscriber.subscriber_id,
      };
      const token = jwt.sign(payload, EMAIL_SECRET, { expiresIn: "30d" });

      console.log("emailtext",emailText)
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_URL}/unsubscribe?token=${token}`;
const mailOptions = {
  from: `${fromName} <companyemail@example.com>`,
  to: emailWithSubscriber.email,
  subject: emailSubject,
  // Remove `text` field
  html: `
    <div>
      <p>${emailText}</p>
      <br/><br/>
      <p>If you want to unsubscribe, click <a href="${unsubscribeUrl}">here</a>.</p>
    </div>
  `,
  attachments: attachments.map((file) => ({
    filename: file.originalname,
    content: file.buffer,
    contentType: file.mimetype,
  })),
};

      return transporter
        .sendMail(mailOptions)
        .then((info) => {
          console.log(
            `Email sent to ${emailWithSubscriber.email}: ${info.response}`
          );
          emailResults.push(
            `Email sent to ${emailWithSubscriber.email}: ${info.response}`
          );
          return info;
        })
        .catch((error) => {
          console.error(
            `Error sending to ${emailWithSubscriber.email}:`,
            error
          );
          emailResults.push(
            `Error sending to ${emailWithSubscriber.email}: ${
              error.message || error
            }`
          );
          return null;
        });
    });

    await Promise.all(emailPromises);

    res.status(200).json({ emailResults });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};




// export const verifyEmail: RequestHandler = async (req, res) :Promise<void> => {
//   const API_KEY = "d47206f11993aca87daa7156da51f0f6";

//   const email = "miguel.john.caacbay@adamson.edu.ph";

//   try {
//     const response = await axios.get(
//       `https://apilayer.net/api/check?access_key=${API_KEY}&email=${email}&smtp=1&format=1`
//     );
//     const data = response.data;
//     console.log("DATA",data)

//     if (data.mx_found && data.smtp_check && data.format_valid && !data.free && !data.disposable) {
//       console.log("✅ Valid company email.");
//       res.status(200).json({ message: "Company email", email: email });
//       return
//     } else {
//       console.log("❌ Invalid email.");
//       console.log(data.status);
//       res.status(500).json({ message: "Invalid or not a company email",email:email });
//       return
//     }
//   } catch (error) {
//     console.error("Error verifying email:", error);
//     res.status(500).json({error: "Error verifying email",email:email})
//     return;
    
//   }
// }
