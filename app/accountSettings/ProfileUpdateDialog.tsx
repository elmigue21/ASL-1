"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProfileUpdateDialogProps = {
  field: "email" | "password" | "text" | "url";
  label: string;
  placeholder?: string;
  triggerLabel?: string;
  retype?: boolean; // <- new prop
  action: (value: string) => void;
};

export function ProfileUpdateDialog({
  field,
  label,
  placeholder = "",
  triggerLabel = `Update ${label}`,
  retype = false,
  action,
}: ProfileUpdateDialogProps) {
  const [value, setValue] = useState("");
  const [retypeValue, setRetypeValue] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setValue("");
    setRetypeValue("");
    setError("");
    setOpen(false);
  };

const handleSubmit = () => {
  const trimmedValue = value.trim();

  if (!trimmedValue) return;

  // Email validation
  if (field === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedValue)) {
      setError("Please enter a valid email address");
      return;
    }
  }

  if (retype && trimmedValue !== retypeValue.trim()) {
    setError("Values do not match");
    return;
  }

  action(trimmedValue);
  reset();
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Update ${label}`}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">{label}</label>
          <Input
            type={field}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          {retype && (
            <>
              <label className="text-sm text-muted-foreground">
                Retype {label}
              </label>
              <Input
                type={field}
                placeholder={`Retype ${placeholder}`}
                value={retypeValue}
                onChange={(e) => setRetypeValue(e.target.value)}
              />
            </>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={reset}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!value.trim()}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
