"use client";

import { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ProfilePictureDialog({
  onConfirmAction,
}: {
  onConfirmAction: (file: File) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onConfirmAction(selectedFile);
      setOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // cleanup on unmount/change
    }
  }, [selectedFile]);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setSelectedFile(null);
          setPreviewUrl(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Change Profile Picture
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button variant="secondary" onClick={handleUploadClick}>
            Select Image
          </Button>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="rounded-full h-32 w-32 object-cover border"
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedFile}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
