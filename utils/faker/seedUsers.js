import dotenv from "dotenv"; // Import dotenv first
import path from "node:path"; 

import { faker } from "@faker-js/faker";
import { createClient } from "@supabase/supabase-js";
// import {supabase} from '@/lib/supabase'
const envPath = path.resolve(process.cwd(), ".env.local");

// Load environment variables
const result = dotenv.config({ path: envPath });

// Log where the .env file is being loaded from
console.log(`🔍 Loading environment variables from: ${envPath}`);

console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const generateFakeSubscriptions = (count = 40000) => {
  return Array.from({ length: count }, () => ({
    full_name: faker.person.fullName(),
    email1: faker.internet.email(),
    person_country: faker.location.country(),
    company_name: faker.company.name(),
    person_industry: faker.commerce.department(),
  }));
};

const seedSupabase = async () => {
  const fakeData = generateFakeSubscriptions(40000); // Change number if needed

  const { data, error } = await supabase.from("subscriptions").insert(fakeData);

  if (error) {
    console.error("❌ Error seeding data:", error);
  } else {
    console.log("✅ Successfully seeded data!", data);
  }
};

seedSupabase();
