import { Request, Response, RequestHandler } from "express";
import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path
import { createClient } from "@supabase/supabase-js";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { transporter } from "./../../lib/emailTransporter";

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
          return null; // Handle failed emails gracefully
        });
    });

    await Promise.all(emailPromises);

    res.status(200).json({ emailResults }); // Return count in an object
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
