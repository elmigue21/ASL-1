import { Request, Response, RequestHandler } from "express";
// import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path

import { SupabaseClient, User } from "@supabase/supabase-js";

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
      res.status(500).json({ error: error });
      return;
    }
    if (!data) {
      res.status(204).end(); // or res.send() / res.json() if appropriate
      return;
    }

  const result = {
    ...data,
    address: data.addresses,
    company: data.companies,
    industry: data.industries?.industry,
    occupation: data.occupations?.occupation,
    email: data.emails?.[0]?.email,
  };


    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

// Get All Subscriptions
export const createSubscription: RequestHandler = async (req, res) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { firstName, lastName, personLinkedIn, personFacebook } = req.body;
    const { phoneNumbers, emails } = req.body;
    const { country, state, city } = req.body;
    const { occupation, industry, company, companyLinkedIn, companyWebsite } =
      req.body;

    const { data, error } = await supabaseUser.rpc("create_subscription", {
      first_name: firstName,
      last_name: lastName,
      person_facebook_url: personFacebook,
      person_linkedin_url: personLinkedIn,
      emails: emails,
      phones: phoneNumbers,
      occupation: occupation,
      company: company,
      industry: industry,
      country: country,
      state: state,
      city: city,
      company_linkedin: companyLinkedIn,
      company_website: companyWebsite,
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

export const editSubscription: RequestHandler = async (req, res) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { subscriberId } = req.body;
    const { firstName, lastName, personLinkedIn, personFacebook } = req.body;
    const { phoneNumbers, emails } = req.body;
    const { country, state, city } = req.body;
    const { occupation, industry, company, companyLinkedIn, companyWebsite } =
      req.body;

    const { data, error } = await supabaseUser.rpc("edit_subscription", {
      sub_id: subscriberId,
      first_name: firstName,
      last_name: lastName,
      person_facebook_url: personFacebook,
      person_linkedin_url: personLinkedIn,
      emails: emails,
      phones: phoneNumbers,
      occupation: occupation,
      company: company,
      industry: industry,
      country: country,
      state: state,
      city: city,
      company_linkedin: companyLinkedIn,
      company_website: companyWebsite,
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
