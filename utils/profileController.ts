import { ReceiptRussianRuble } from "lucide-react";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  id: string;
  role: string;
  created_at: string; // or Date, depending on how you handle timestamptz
  profile_picture:string,
}

export const logout = async () => {
  if (typeof window === "undefined") return;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
      {
        method: "POST",
        credentials: "include", // If your auth uses cookies
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Logout failed:", await response.text());
      return false;
    }

    localStorage.removeItem("profile");

    console.log("Logged out successfully");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

export const getName =  () => {
    if (typeof window === 'undefined') return
  const storedProfile = localStorage.getItem("profile");

  if (!storedProfile) {
    console.error("No profile found");
    return;
  }

  let profile: Profile;
  try {
    profile = JSON.parse(storedProfile);
  } catch (err) {
    console.error("Failed to parse profile from localStorage", err);
    return;
  }

  const first = profile.first_name ?? "";
  const last = profile.last_name ?? "";
  return first + " " + last;
};

export const getRole = () =>{
    if (typeof window === 'undefined') return
    const storedProfile = localStorage.getItem("profile");
    if(!storedProfile){
        console.error("no profile found")
        return
    }
    let profile : Profile;
    try{
        profile = JSON.parse(storedProfile);
    }catch(err){
        console.error('failed to parse profile from localStorage',err);
        return
    }
    const role = profile.role;
    return role;
}

export const getPfp = () =>{
     if (typeof window === "undefined") return;
     const storedProfile = localStorage.getItem("profile");

     if (!storedProfile) {
       console.error("No profile found");
       return;
     }

     let profile: Profile;
     try {
       profile = JSON.parse(storedProfile);
     } catch (err) {
       console.error("Failed to parse profile from localStorage", err);
       return;
     }
    //  console.log("PROFILE FROM GET PFP" , profile.profile_picture)
     const pfp = profile.profile_picture ?? "";
     return pfp;
}
