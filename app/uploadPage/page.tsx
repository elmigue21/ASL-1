"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";
import ReportsTab from "./ReportsTab";
import Navbar from "../components/Navbar";
import UploadTab from "./UploadTab";
import BackupsTab from "./BackupsTab";

function UploadPage() {
/*   const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      alert("You are not authenticated.");
      return;
    }

    if (!file) {
      alert("No file selected!");
      return;
    }

    setIsUploading(true);

       const formData = new FormData();
       formData.append("file", file);
       console.log('form dtatas')
       for (let [key, value] of formData.entries()) {
         console.log(key, value); // Log each entry
       }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadFile`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Upload failed");
      console.log(result);
      alert("Upload successful: " + result.message);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  }; */

  const navItems = [
    {label:"Backups",color:"bg-red-500",},
    {label:"Data Upload",color:"bg-orange-500",},
    {label:"Reports",color:"bg-blue-500",},
];

const [selectedNav, setSelectedNav] = useState("Backups");

  return (
    <>
    <Navbar />
    <div className="flex border border-slate-400 box-border z-45 absolute top-[11vh] left-[8.35vw] w-[91.6vw] h-[89vh]">
      <div className="box-border border-3 border-slate-900 rounded p-2">
        <h1 className="p-5">Backup & Retrieval Console</h1>
        <Separator />

        <div className="gap-y-2 flex flex-col p-2">
          {navItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center hover:cursor-pointer p-5 rounded ${
                selectedNav == item.label
                  ? "bg-slate-700 text-white font-bold"
                  : "bg-slate-200 hover:bg-slate-400"
              }`}
              onClick={() => {
                setSelectedNav(item.label);
              }}
            >
              <div className={`h-2 w-2 rounded-full m-2 ${item.color}`}></div>
              <p>{item.label}</p>
            </div>
          ))}
        </div>

        {/*       <div className="space-y-4">
        <p>Drag file or select from your local pc</p>
        <Input
          placeholder="Upload Excel File"
          id="file-upload"
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="shadow-xl bg-orange-100 hover:bg-orange-200 w-[500px] h-[200px] border-4 border-blue-500 border-dashed"
        />
        <Button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Excel"}
        </Button>
      </div> */}
      </div>
      <div className="flex-1 p-5">
        {/* {selectedNav === "Backups" && <BackupsTab />}
        {selectedNav === "Data Upload" && <UploadTab />} */}
        <div style={{ display: selectedNav === "Backups" ? "block" : "none" }}>
          <BackupsTab />
        </div>
        <div
          style={{ display: selectedNav === "Data Upload" ? "block" : "none" }}
        >
          <UploadTab />
        </div>
        <div
          style={{ display: selectedNav === "Reports" ? "block" : "none" }}
        >
          <ReportsTab />
        </div>
        {/* {selectedNav === "Reports" && <ReportsTab />} */}
      </div>
    </div>
    </>
  );
}

export default UploadPage;
