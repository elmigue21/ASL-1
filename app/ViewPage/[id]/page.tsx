"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Subscription } from "@/types/subscription";
import StepperList from "../../components/StepperList";
import { Switch } from "@/components/ui/switch";

function ViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [subscriberDetails, setSubscriberDetails] =
    useState<Subscription | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchSubscriberDetails = async () => {
    const timeout = setTimeout(() => {
      console.error("Fetch took too long, aborting...");
      setIsFetching(false);
    }, 10000);

    try {
      console.log("Fetching started...");
      setIsFetching(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      let data = null;
      if (response.status !== 204) {
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
      }

      if (response.ok && data) {
        setSubscriberDetails(data);
      } else {
        setSubscriberDetails(null);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setSubscriberDetails(null);
    } finally {
      clearTimeout(timeout);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchSubscriberDetails();
  }, []);

  const goToNextSub = () => {
    if (id) {
      const idString = Array.isArray(id) ? id[0] : id;
      const nextId = parseInt(idString, 10) + 1;
      router.push(`/ViewPage/${nextId}`);
    }
  };

  const goToPrevSub = () => {
    if (id) {
      const idString = Array.isArray(id) ? id[0] : id;
      const prevId = parseInt(idString, 10) - 1;
      router.push(`/ViewPage/${prevId}`);
    }
  };

  const handleChange = (field: string, value: string) => {
    setSubscriberDetails((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleNestedChange = (path: string[], value: string) => {
    setSubscriberDetails((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      let obj: any = updated;
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;
      return updated;
    });
  };

  const submitEdit =async ()=>{
try{

  console.log(subscriberDetails);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/edit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 🔥 Required for sending/receiving cookies
          body: JSON.stringify({ subscriberDetails }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log('response not ok')
        console.error("Edit failed:", data.error || "Unknown error");
        // toast.error(`Login failed: ${data.error}` || "Unknown error");
        // setIsClicked(false);
        return;
      }
}catch(e){
  console.error(e);
}
  }

return (
  <div className="absolute top-[11vh] left-[8.35vw] w-[90vw] h-[60vh] px-[3vw] py-[2vh]">
    <div className="font-bold text-[#1E2E80] text-[1.60vw]">
      Subscriber Details
    </div>

    <div className="w-auto h-[77vh] rounded-[0.60vw] shadow-2xl shadow-gray-950/20 py-[6vh] px-[2.5vw] relative border-2 border-slate-100">
      <button
        onClick={goToPrevSub}
        className="absolute left-[2vw] top-[2vh] text-[2vh] flex gap-x-[1vw] cursor-pointer hover:bg-gray-100 p-[0.5vh] px-[0.5vw] rounded-sm"
      >
        <Image
          src="/arrow-small-left.png"
          alt="arrow left"
          width={30}
          height={30}
        />
        Back
      </button>

      <button
        onClick={goToNextSub}
        className="absolute right-[2vw] top-[2vh] text-[2vh] flex gap-x-[1vw] cursor-pointer hover:bg-gray-100 py-[0.5vh] px-[0.5vw] rounded-sm"
      >
        Next Profile
        <Image
          src="/arrow-small-right.png"
          alt="arrow right"
          width={30}
          height={30}
        />
      </button>

      {subscriberDetails ? (
        <div className="flex flex-row">
          {/* Left column */}
          <div className="w-5/9 h-full border-r-2 py-4 overflow-auto">
            <span className="text-[3vh] text-[#2F80ED]">
              Personal Information
            </span>
            <div className="grid grid-cols-2 gap-y-[2vh] px-[2vw] py-[2vh]">
              <div className="flex-col">
                <div className="text-[2.5vh] font-medium text-slate-500">
                  Subscriber ID
                </div>
                <div className="text-[2vh]">{id}</div>
              </div>

              <div className="flex-col">
                <div className="text-[2.5vh] font-medium text-slate-500">
                  Active Status
                </div>

                <div className="flex gap-x-[0.5vw] items-center">
                  <div
                    className={`h-[1.5vh] w-[1.5vh] rounded-full ${
                      subscriberDetails.active_status
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <div className="text-[2vh]">
                    {subscriberDetails.active_status ? "Active" : "Inactive"}
                  </div>
                  {isEditing?
                    <Switch id="email-notifications" checked={subscriberDetails.active_status} onCheckedChange={()=>{
                       setSubscriberDetails((prev) =>
                         prev ? { ...prev, ["active_status"]: !prev.active_status } : prev
                       );
                    }} /> : <></>}
                </div>
              </div>

              <div className="flex-col">
                <div className="text-[2.5vh] font-medium text-slate-500">
                  Last Name
                </div>
                {isEditing ? (
                  <input
                    value={subscriberDetails.last_name || ""}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    className="text-[2vh] border px-2"
                  />
                ) : (
                  <div className="text-[2vh]">
                    {subscriberDetails.last_name || "N/A"}
                  </div>
                )}
              </div>

              <div className="flex-col">
                <div className="text-[2.5vh] font-medium text-slate-500">
                  First Name
                </div>
                {isEditing ? (
                  <input
                    value={subscriberDetails.first_name || ""}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    className="text-[2vh] border px-2"
                  />
                ) : (
                  <div className="text-[2vh]">
                    {subscriberDetails.first_name || "N/A"}
                  </div>
                )}
              </div>
            </div>

            <span className="text-[3vh] text-[#2F80ED]">Contact Details</span>
            <div className="grid grid-cols-2 gap-y-[2vh] px-[2vw] py-[2vh]">
              <div className="flex-col">
                <div className="text-[2vh] font-medium text-slate-500">
                  Phone Number
                </div>
                <div className="overflow-y-auto h-[15vh] py-[1vh] w-8/9">
                  <StepperList
                    list={
                      subscriberDetails.phone_numbers?.map((p) => p.phone) ?? []
                    }
                  />
                </div>
              </div>

              <div className="flex-col">
                <div className="text-[2vh] font-medium text-slate-500">
                  Email
                </div>
                <div className="overflow-y-auto h-[15vh] py-[1vh] w-8/9">
                  <StepperList
                    list={subscriberDetails.emails?.map((e) => e.email) ?? []}
                  />
                </div>
              </div>
            </div>

            <div className="flex-col px-[2vw]">
              <div className="text-[2vh] font-medium text-slate-500">
                Facebook
              </div>
              {isEditing ? (
                <input
                  value={subscriberDetails.person_facebook_url || ""}
                  onChange={(e) =>
                    handleChange("person_facebook_url", e.target.value)
                  }
                  className="text-[2vh] border px-2"
                />
              ) : (
                <a
                  href={subscriberDetails.person_facebook_url || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2F80ED] underline text-[2vh]"
                >
                  {subscriberDetails.person_facebook_url || "N/A"}
                </a>
              )}
            </div>

            <div className="flex-col px-[2vw] py-[1vh]">
              <div className="text-[2vh] font-medium text-slate-500">
                LinkedIn
              </div>
              {isEditing ? (
                <input
                  value={subscriberDetails.person_linkedin_url || ""}
                  onChange={(e) =>
                    handleChange("person_linkedin_url", e.target.value)
                  }
                  className="text-[2vh] border px-2"
                />
              ) : (
                <a
                  href={subscriberDetails.person_linkedin_url || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2F80ED] underline text-[2vh]"
                >
                  {subscriberDetails.person_linkedin_url || "N/A"}
                </a>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="px-[2vw] w-4/9 overflow-auto">
            <span className="text-[3vh] text-[#2F80ED]">Address</span>
            <div className="px-[2vw] w-full">
              <div className="text-[2vh] font-medium text-slate-500">
                Country
              </div>
              {isEditing ? (
                <input
                  value={subscriberDetails.address?.country || ""}
                  onChange={(e) =>
                    handleNestedChange(["address", "country"], e.target.value)
                  }
                  className="text-[2vh] border px-2"
                />
              ) : (
                <div className="text-[2vh]">
                  {subscriberDetails.address?.country || "N/A"}
                </div>
              )}
            </div>
            <div className="flex justify-between w-full mt-[1vh]">
              <div className="flex-col w-1/2">
                <div className="text-[2vh] font-medium text-slate-500">
                  City
                </div>
                {isEditing ? (
                  <input
                    value={subscriberDetails.address?.city || ""}
                    onChange={(e) =>
                      handleNestedChange(["address", "city"], e.target.value)
                    }
                    className="text-[2vh] border px-2"
                  />
                ) : (
                  <div className="text-[2vh]">
                    {subscriberDetails.address?.city || "N/A"}
                  </div>
                )}
              </div>

              <div className="flex-col w-1/2">
                <div className="text-[2vh] font-medium text-slate-500">
                  State
                </div>
                {isEditing ? (
                  <input
                    value={subscriberDetails.address?.state || ""}
                    onChange={(e) =>
                      handleNestedChange(["address", "state"], e.target.value)
                    }
                    className="text-[2vh] border px-2"
                  />
                ) : (
                  <div className="text-[2vh]">
                    {subscriberDetails.address?.state || "N/A"}
                  </div>
                )}
              </div>
            </div>
            <span className="text-[3vh] text-[#2F80ED]">Occupation</span>
            <div className="px-[2vw] w-full">
              <div className="text-[2vh] font-medium text-slate-500">Role</div>
              {isEditing ? (
                <input
                  value={subscriberDetails.occupation || ""}
                  onChange={(e) => handleChange("occupation", e.target.value)}
                  className="text-[2vh] border px-2"
                />
              ) : (
                <div className="text-[2vh]">
                  {subscriberDetails.occupation || "N/A"}
                </div>
              )}
            </div>
            <span className="text-[3vh] text-[#2F80ED]">Industry</span>
            <div className="px-[2vw] w-full">
              <div className="text-[2vh] font-medium text-slate-500">Field</div>
              {isEditing ? (
                <input
                  value={subscriberDetails.industry || ""}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  className="text-[2vh] border px-2"
                />
              ) : (
                <div className="text-[2vh]">
                  {subscriberDetails.industry || "N/A"}
                </div>
              )}
            </div>
            <span className="text-[3vh] text-[#2F80ED]">Company</span>
            <div className="px-[2vw] w-full my-[1vh]">
              <div className="text-[2vh] font-medium text-slate-500">
                Company Name
              </div>
              {isEditing ? (
                <input
                  value={subscriberDetails.company?.name || ""}
                  onChange={(e) =>
                    handleNestedChange(["company", "name"], e.target.value)
                  }
                  className="text-[2vh] border px-2"
                />
              ) : (
                <div className="text-[2vh]">
                  {subscriberDetails.company?.name || "N/A"}
                </div>
              )}
            </div>
            <div className="px-[2vw] w-full my-[1vh]">
              <div className="text-[2vh] font-medium text-slate-500">
                Website
              </div>
              {isEditing ? (
                <input
                  value={subscriberDetails.company?.website || ""}
                  onChange={(e) =>
                    handleNestedChange(["company", "website"], e.target.value)
                  }
                  className="text-[2vh] border px-2"
                />
              ) : (
                <a
                  href={subscriberDetails.company?.website || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2F80ED] underline text-[2vh]"
                >
                  {subscriberDetails.company?.website || "N/A"}
                </a>
              )}
            </div>
            <div className="px-[2vw] w-full my-[1vh]">
              <div className="text-[2vh] font-medium text-slate-500">
                Company LinkedIn
              </div>
              {isEditing ? (
                <input
                  value={subscriberDetails.company?.linked_in_url || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      ["company", "linked_in_url"],
                      e.target.value
                    )
                  }
                  className="text-[2vh] border px-2"
                />
              ) : (
                <a
                  href={subscriberDetails.company?.linked_in_url || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2F80ED] underline text-[2vh]"
                >
                  {subscriberDetails.company?.linked_in_url || "N/A"}
                </a>
              )}{" "}
            </div>{" "}
          </div>
<div className="absolute right-[2vw] bottom-[2vh] flex">
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing) {
                fetchSubscriberDetails();
              }
            }}
            className="flex text-[2.5vh] items-center cursor-pointer py-[0.5vh] px-[2vw] bg-gray-100 hover:bg-gray-400 rounded-full"
          >
            {isEditing ? "Cancel Edit" : "Edit"}
          </button>
          { isEditing ? <button className="flex text-[2.5vh] items-center cursor-pointer py-[0.5vh] px-[2vw] bg-green-400 hover:bg-green-200 rounded-full" onClick={()=>{submitEdit(); setIsEditing((prev)=>(!prev))}}>Save</button> :<></>}
        </div>
        </div>
      ) : isFetching ? (
        <div className="flex items-center justify-center h-full gap-4 font-bold text-2xl">
          <Image
            src="/spinner.png"
            width={50}
            height={50}
            alt="loading"
            className="animate-spin"
          />
          Loading...
        </div>
      ) : (
        <div className="h-full flex items-center justify-center font-bold text-2xl">
          Subscriber with ID {id} not found
        </div>
      )}
    </div>
  </div>
);

}

export default ViewPage;
