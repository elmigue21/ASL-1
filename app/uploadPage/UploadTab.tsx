import React from 'react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

  


const UploadTab = () => {

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
    <div className="space-y-4 w-full">
      <div className="flex items-center">
        <div className="bg-orange-500 h-2 w-2 mx-2 rounded-full"></div>
        <h1 className="font-bold">Data Upload</h1>
      </div>

      <div className="bg-orange-500 h-2">

      </div>

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
    </div>
  );
}

export default UploadTab