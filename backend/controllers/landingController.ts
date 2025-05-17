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
    console.log(supabaseKey, supabaseUrl);
    // const { email } = req.body;
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
    // if (!email) {
    //   res.status(400).json({ message: "Email is required" });
    //   return;
    // }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      emails,
      phone_numbers: phoneNumbers,
      person_facebook_url: facebook,
      person_linkedin_url: linkedIn,
      address: { country, state, city },
      // country,
      // city,
      // state,
      occupation,
      industry,
      company: {
        name: company,
        website: companyWebsite,
        linked_in_url: companyLinkedIn,
      },
      // company,
      // companyWebsite,
      // companyLinkedIn,
    };

    console.log("email secret", emailSecret);
    // Generate the JWT token (you can adjust the secret and expiration as needed)
    const token = jwt.sign(payload, emailSecret, { expiresIn: "1h" });

    // Construct the confirmation URL with the token
    console.log("WEBSITE URL");
    console.log(websiteUrl);
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
      from: "gueljohnc@gmail.com", // Sender's email address
      to: /* email */ "gueljohnc@gmail.com", // Recipient's email address
      subject: "Confirmation Email", // Email subject
      text: `Thank you for signing up! Please confirm your email by clicking the following link: ${confirmationUrl}`, // Plain text body
      html: `<p>Thank you for signing up! Please confirm your email by clicking the following link:</p>
         <a href="${confirmationUrl}">Confirm Email</a>
         <br />
         <img src="cid:dempaLogo" width="250" height="auto"/>
         `, // HTML body with link

      attachments: [
        {
          filename: "image.jpg",
          path: filePath,
          cid: "dempaLogo", // optional, used for inline images
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Confirmation email sent" });
    return;
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Error sending confirmation email", details: e });
    return;
  }
};

export const getCountries: RequestHandler = async (req, res) => {

 const supabase = createClient(supabaseUrl, supabaseKey);
  // Query countries table
  const { data, error } = await supabase.from("countries").select("*");

  if (error) {
    console.error("Supabase error:", error);
    res.status(500).json({ error: error.message });
    return;
  }

   res.json({ countries: data });
   return;
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
