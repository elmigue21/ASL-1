
import { Request, Response, RequestHandler } from "express";
import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path
import { createClient } from "@supabase/supabase-js";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { transporter } from './../../lib/emailTransporter';



export const sendEmails : RequestHandler = async (req, res) => {
  try {
console.log('reached backend')
        const supabaseUser = req.supabaseUser;
        if (!supabaseUser) {
            console.log('no supabase user')
          return;
        }
        const emailIds = req.body.emailIds;
        console.log('email ids',emailIds);
    const { data,count, error } = await supabaseUser
      .from("emails")
      .select("*")
      .in("id", emailIds);

    if (error) {
      throw new Error(error.message);
    }
    console.log(data);

    const {emailSubject,emailText,emailHtml} = req.body;

   const emailPromises = data.map((email) => {
     const mailOptions = {
       from: '"Your Name" <companyemail>',
       to: email.email,
       subject: emailSubject,
       text: emailText,
    //    html: "<b>Hello, this is a test email sent using Nodemailer.</b>",
     };

     return transporter
       .sendMail(mailOptions)
       .then((info) => {
         console.log(`Email sent to ${email.email}: ${info.response}`);
         return info;
       })
       .catch((error) => {
         console.error(`Error sending to ${email.email}:`, error);
         return null; // Handle failed emails gracefully
       });
   });

   await Promise.all(emailPromises);





    res.status(200).json({ data }); // Return count in an object
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};
