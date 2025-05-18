import { Request, Response, RequestHandler } from "express";
import { SupabaseClient, User, createClient } from "@supabase/supabase-js";
import { json } from "stream/consumers";
// import { supabase } from "@/lib/supabase";
// import SupabaseClient from "@supabase/supabase-js";
import { transporter } from "../../lib/emailTransporter";
import jwt from "jsonwebtoken";
import path from "path";
import { Subscription } from "@/types/subscription";

interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
const websiteUrl = process.env.NEXT_PUBLIC_URL as string;
const emailSecret = process.env.EMAIL_SECRET as string;
// const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

export const confirmSubscription: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    console.log("ANON KEY", supabaseKey);
    const supabase = createClient(supabaseUrl, supabaseKey);
    // const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    // if (!supabaseUser) {
    //   res.status(401).json({ error: "Unauthorized" });
    //   return;
    // }

    const { token } = req.query;
    console.log("token", token);
    if (!token || typeof token !== "string") {
      res.status(400).json({ error: "Token is required" });
      return;
    }

    // if (!JWT_SECRET) {
    // throw new Error("JWT_SECRET is not defined in environment variables");
    // }
    // console.log('jwt secret', JWT_SECRET)
    // Decode and verify the token
    const decoded = jwt.verify(token, emailSecret) as Subscription;
    console.log("Decoded token:", decoded);

    console.log(decoded.first_name);
    const { data, error } = await supabase.rpc("create_subscription", {
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      person_facebook_url: decoded.person_facebook_url,
      person_linkedin_url: decoded.person_linkedin_url,
      emails: decoded.emails,
      phones: decoded.phone_numbers,
      occupation: decoded.occupation,
      company: decoded.company.name,
      industry: decoded.industry,
      country: decoded.address.country,
      state: decoded.address.state,
      city: decoded.address.city,
      company_linkedin: decoded.company.linked_in_url,
      company_website: decoded.company.website,
      verified_status: decoded.verified_status,
      created_by: decoded.created_by,
    });

    if (error) {
      console.error(error);
      return;
    }

    res.status(200).json({ message: "Form submitted successfully", data });
    return;
  } catch (e) {
    console.error("  error:", e);
    res.status(500).json({ message: "Server error", details: e });
    return;
  }
};

export const sendConfirmationEmail: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const API_KEY = process.env.EMAIL_CHECKER_KEY;

    const {
      emails,
      firstName,
      lastName,
      phoneNumbers,
      facebook,
      linkedIn,
      country,
      city,
      state,
      occupation,
      industry,
      company,
      companyWebsite,
      companyLinkedIn,
    } = req.body;

    const emailToCheck = emails?.[0]; // assuming `emails` is an array and you want to check the first one

    if (!emailToCheck) {
      res.status(400).json({ message: "No email provided for verification" });
      return;
    }

    // Verify the email
let verifiedStatus = false;

try {
  const verifyResponse = await fetch(
    `https://apilayer.net/api/check?access_key=${API_KEY}&email=${encodeURIComponent(
      emailToCheck
    )}&smtp=1&format=1`
  );

  const data = await verifyResponse.json();

  if (
    data &&
    data.success !== false && // check success explicitly
    data.mx_found &&
    data.smtp_check &&
    data.format_valid &&
    !data.free &&
    !data.disposable
  ) {
    verifiedStatus = true;
  }
} catch {
  // silently fallback to verifiedStatus = false
}

    // Build payload with verified status
    const payload = {
      first_name: firstName,
      last_name: lastName,
      emails,
      phone_numbers: phoneNumbers,
      person_facebook_url: facebook,
      person_linkedin_url: linkedIn,
      address: { country, state, city },
      occupation,
      industry,
      company: {
        name: company,
        website: companyWebsite,
        linked_in_url: companyLinkedIn,
      },
      verified_status:verifiedStatus,
      created_by:"Self"
    };

    const token = jwt.sign(payload, emailSecret, { expiresIn: "1h" });
    const confirmationUrl = `${websiteUrl}/confirm?token=${token}`;

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "img",
      "dempaLogoTxt.png"
    );

    const mailOptions = {
      from: "gueljohnc@gmail.com",
      to: emailToCheck,
      subject: "Confirmation Email",
      text: `Thank you for signing up! Please confirm your email by clicking the following link: ${confirmationUrl}`,
      html: `<p>Thank you for signing up! Please confirm your email by clicking the following link:</p>
             <a href="${confirmationUrl}">Confirm Email</a><br />
             <img src="cid:dempaLogo" width="250" height="auto"/>`,
      attachments: [
        {
          filename: "image.jpg",
          path: filePath,
          cid: "dempaLogo",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: "Confirmation email sent", email: emailToCheck });
  } catch (e) {
    console.error("Error sending confirmation email:", e);
    res
      .status(500)
      .json({ message: "Error sending confirmation email", details: e });
  }
};

export const verifyEmail: RequestHandler = async (req, res): Promise<void> => {
  const API_KEY = process.env.EMAIL_CHECKER_KEY;
  const { email } = req.body;

  try {
    const response = await fetch(
      `https://apilayer.net/api/check?access_key=${API_KEY}&email=${encodeURIComponent(
        email
      )}&smtp=1&format=1`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("DATA", data);

    if (
      data.mx_found &&
      data.smtp_check &&
      data.format_valid &&
      !data.free &&
      !data.disposable
    ) {
      console.log("✅ Valid company email.");
      res.status(200).json({ message: "Company email", email });
    } else {
      console.log("❌ Invalid email.");
      res
        .status(500)
        .json({ message: "Invalid or not a company email", email });
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ error: "Error verifying email", email });
  }
};


//////

// export const sendEmails: RequestHandler = async (req, res) => {
//   try {
//     const emailIds = req.body.emailIds;

//     if (!emailIds) {
//       res.json({ message: "no emails selected" });
//     }

//     const supabaseUser = req.supabaseUser;
//     if (!supabaseUser) {
//       console.log("no supabase user");
//       return;
//     }
//     const { data, count, error } = await supabaseUser
//       .from("emails")
//       .select("*")
//       .in("id", emailIds);

//     if (error) {
//       throw new Error(error.message);
//     }

//     const { emailSubject, emailText, emailHtml, fromName } = req.body;

//     let emailResults: string[] = [];

//     const emailPromises = data.map((email) => {
//       const mailOptions = {
//         from: `${fromName} <companyemail>`,
//         to: email.email,
//         subject: emailSubject,
//         text: emailText,
//         html: emailHtml,
//       };

//       return transporter
//         .sendMail(mailOptions)
//         .then((info) => {
//           console.log(`Email sent to ${email.email}: ${info.response}`);
//           emailResults.push(`Email sent to ${email.email}: ${info.response}`);
//           return info;
//         })
//         .catch((error) => {
//           console.error(`Error sending to ${email.email}:`, error);
//           emailResults.push(`Error sending to ${email.email}:`, error);
//           return null;
//         });
//     });

//     await Promise.all(emailPromises);

//     res.status(200).json({ emailResults });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//       return;
//     } else {
//       res.status(500).json({ error: "An unknown error occurred." });
//       return;
//     }
//   }
// };
