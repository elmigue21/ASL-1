import dotenv from "dotenv"; // Import dotenv first
import path from "node:path";
import { faker } from "@faker-js/faker";
import { createClient } from "@supabase/supabase-js";

// Path to load the .env.local file
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

// Define the seeding process as an async function
const seedSupabase = async () => {
  // Fetch valid subscriber IDs
  const { data, error } = await supabase.from("subscribers").select("id")/* .limit(10); */
  if (error) {
    console.error("Error fetching subscribers:", error);
    return; // Ensure we stop if there's an error
  }

  const subscriberIds = data.map((sub) => sub.id);

  const generateFakeAddress = () => {
    return subscriberIds.map((subId)=> ({
      person_id: subId, // Valid foreign key reference
      country: faker.location.country(),
      city: faker.location.city(),
      state: faker.location.state(),
    }));
  };

  const fakeData = generateFakeAddress(); // Generate 50 fake email entries

  const { data: insertedData, error: insertError } = await supabase
    .from("addresses")
    .insert(fakeData);

  if (insertError) {
    console.error("❌ Error seeding data:", insertError);
  } else {
    console.log("✅ Successfully seeded data!", insertedData);
  }
};

// Run the seeding function
seedSupabase();
