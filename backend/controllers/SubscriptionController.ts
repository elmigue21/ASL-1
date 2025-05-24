import { Request, Response, RequestHandler } from "express";
// import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path

import { SupabaseClient, User } from "@supabase/supabase-js";
import { Email } from "@/types/email";

interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}

export const getSubscription: RequestHandler = async (req, res) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const { data, error } = await supabaseUser
      .from("subscribers")
      .select(
        `
        *,
        addresses (city, country, state),
        emails (email),
        companies (name, website, linked_in_url),
        industries (industry),
        phone_numbers (phone),
        occupations (occupation)
      `
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    if (!data) {
      res.status(204).end();
      return;
    }

    // Destructure and omit specific nested fields except emails and phone_numbers
    const {
      addresses,
      companies,
      industries,
      occupations,
      ...rest
    } = data;

    const result = {
      ...rest,
      address: addresses,
      company: companies,
      industry: industries?.industry,
      occupation: occupations?.occupation,
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};


// Get All Subscriptions
export const createSubscription: RequestHandler = async (req, res) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
       res.status(401).json({ error: "Unauthorized" });
       return
    }

    const subscriptionsPayload = req.body;


    // Ensure input is always an array
    const subscriptions = Array.isArray(subscriptionsPayload)
      ? subscriptionsPayload
      : [subscriptionsPayload];



    // Format subscriptions to match `subscription_input` composite type
    const formattedSubscriptions = subscriptions.map((sub) => ({
      first_name: sub.firstName,
      last_name: sub.lastName,
      person_facebook_url: sub.personFacebook,
      person_linkedin_url: sub.personLinkedIn,
      emails: sub.emails || [],
      phones: sub.phoneNumbers || [],
      occupation: sub.occupation || null,
      industry: sub.industry || null,
      company_name: sub.company || null,
      company_website: sub.companyWebsite || null,
      company_linked_in_url: sub.companyLinkedIn || null,
      address_country: sub.country || null,
      address_state: sub.state || null,
      address_city: sub.city || null,
      created_on: sub.createdOn || null, // Optional, use client-provided or let the DB default to now()
    }));

    const { data: existingEmails, error: existingEmailsError } = await supabaseUser
      .from("emails")
      .select("email");

    if (existingEmailsError) {
       res.status(500).json({ error: "Failed to fetch existing emails" });
       return
    }

const invalidSubscriptions: any = [];
const validSubscriptions: any = [];

const existingEmailList = existingEmails.map((e) => e.email.toLowerCase());

formattedSubscriptions.forEach((sub) => {
  if (!sub.emails || sub.emails.length === 0) {
    invalidSubscriptions.push({
      ...sub,
      reason: "Missing email address",
    });
  } else if (
    sub.emails.some((email : string) => existingEmailList.includes(email.toLowerCase()))
  ) {
    invalidSubscriptions.push({
      ...sub,
      reason: "Email already exists",
    });
  } else {
    validSubscriptions.push(sub);
  }
});


    const { data, error } = await supabaseUser.rpc("insert_subscriptions", {
      subscriptions: validSubscriptions,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
       res.status(500).json({
        message: "Failed to insert subscriptions",
        details: error.message,
      });
      return
    }

     res.status(200).json({
      message: "Insert completed",
      result: data,
      failedSubscriptions:invalidSubscriptions,
    });
    return
  } catch (err) {
    console.error("Server error:", err);
     res.status(500).json({
      error: (err as Error).message,
    });
    return
  }
};


export const editSubscription: RequestHandler = async (req, res) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    // const { subscriberId } = req.body;
    // const { firstName, lastName, personLinkedIn, personFacebook } = req.body;
    // const { phoneNumbers, emails } = req.body;
    // const { country, state, city } = req.body;
    // const { occupation, industry, company, companyLinkedIn, companyWebsite } =
    //   req.body;
    const {
      id,
      created_on,
      updated_from_linkedin,
      first_name,
      last_name,
      person_linkedin_url,
      person_facebook_url,
      created_by,
      active_status,
      verified_status,
      emails,
      phone_numbers,
      address,
      company,
      industry,
      occupation,
    } = req.body.subscriberDetails;
    console.log(id);
    console.log(req.body.emails);
    // return;
    // return;
     const { data, error } = await supabaseUser.rpc("edit_subscription", {
  p_sub_id: id,
  p_first_name: first_name || null,
  p_last_name: last_name || null,
  p_person_facebook_url: person_facebook_url || null,
  p_person_linkedin_url: person_linkedin_url || null,
  p_active_status: active_status,
  p_verified_status: verified_status,
p_emails: (emails || []).map((e: { email?: string }) => e.email).filter(Boolean),
p_phones: (phone_numbers || []).map((p: { phone?: string }) => p.phone).filter(Boolean),


  p_occupation: occupation || null,
  p_company_name: company.name || null,
  p_industry: industry || null,
  p_country: address.country,
  p_state: address.state || null,
  p_city: address.city || null,
  p_company_linkedin_url: company.linked_in_url || null,
  p_company_website: company.website || null,
});

    if (error) {
      res.status(500).json({
        message: "failed to create subscription",
        details: error.message,
      });
      console.error(error);
      return;
    }

    res.json(data); 
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

export const deleteSubscription: RequestHandler = async (req, res) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { subscriptionId } = req.body;
    const { data, error } = await supabaseUser.rpc("delete_subscription", {
      sub_id: subscriptionId,
    });

    if (error) {
      res.status(500).json({
        message: "failed to delete subscription",
        details: error.message,
      });
      console.error(error);
      return;
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};
