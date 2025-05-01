"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
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
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border border-black shadow-xl bg-orange-100 hover:bg-orange-200 w-[500px] h-[200px]"
      />
      <Button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Excel"}
      </Button>
    </div>
  );
}

export default UploadPage;
