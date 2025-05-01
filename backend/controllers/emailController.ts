import { Request, Response, RequestHandler } from "express";
import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path
import { createClient } from "@supabase/supabase-js";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { transporter } from "../../lib/emailTransporter";
import axios from "axios";
// import { axios } from './../../node_modules/axios/dist/esm/axios';

export const sendEmails: RequestHandler = async (req, res) => {
  try {
    const emailIds = req.body.emailIds;

    if (!emailIds) {
      res.json({ message: "no emails selected" });
    }

    const supabaseUser = req.supabaseUser;
    if (!supabaseUser) {
      console.log("no supabase user");
      return;
    }
    const { data, count, error } = await supabaseUser
      .from("emails")
      .select("*")
      .in("id", emailIds);

    if (error) {
      throw new Error(error.message);
    }

    const { emailSubject, emailText, emailHtml, fromName } = req.body;

    let emailResults :string[]= [];

    const emailPromises = data.map((email) => {
      const mailOptions = {
        from: `${fromName} <companyemail>`,
        to: email.email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      };

      return transporter
        .sendMail(mailOptions)
        .then((info) => {
          console.log(`Email sent to ${email.email}: ${info.response}`);
          emailResults.push(`Email sent to ${email.email}: ${info.response}`)
          return info;
        })
        .catch((error) => {
          console.error(`Error sending to ${email.email}:`, error);
          emailResults.push(`Error sending to ${email.email}:`, error);
          return null;
        });
    });

    await Promise.all(emailPromises);

    res.status(200).json({ emailResults }); 
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
      return;
    }
  }
};

export const verifyEmail: RequestHandler = async (req, res) :Promise<void> => {
  const API_KEY = "d47206f11993aca87daa7156da51f0f6";

  const email = "miguel.john.caacbay@adamson.edu.ph";

  try {
    const response = await axios.get(
      `https://apilayer.net/api/check?access_key=${API_KEY}&email=${email}&smtp=1&format=1`
    );
    const data = response.data;
    console.log("DATA",data)

    if (data.mx_found && data.smtp_check && data.format_valid && !data.free && !data.disposable) {
      console.log("✅ Valid company email.");
      res.status(200).json({ message: "Company email", email: email });
      return
    } else {
      console.log("❌ Invalid email.");
      console.log(data.status);
      res.status(500).json({ message: "Invalid or not a company email",email:email });
      return
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({error: "Error verifying email",email:email})
    return;
    
  }
}
