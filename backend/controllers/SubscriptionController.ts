import { Request, Response, RequestHandler } from "express";
import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path

import { SupabaseClient, User } from "@supabase/supabase-js";

interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}

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
      res
        .status(500)
        .json({
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
    const {subscriberId} = req.body;
    const { firstName, lastName, personLinkedIn, personFacebook } = req.body;
    const { phoneNumbers, emails } = req.body;
    const { country, state, city } = req.body;
    const { occupation, industry, company, companyLinkedIn, companyWebsite } =
      req.body;

    const { data, error } = await supabaseUser.rpc("edit_subscription", {
      sub_id:subscriberId,
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
    const {subscriptionId} = req.body
    const { data, error } = await supabaseUser.rpc("delete_subscription", {
      sub_id:subscriptionId,
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

