'use client';
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

type NameUpdateDialogProps = {
  initialFirstName?: string;
  initialLastName?: string;
  triggerLabel?: string;
  action: (names: { firstName: string; lastName: string }) => void;
};

export function NameUpdateDialog({
  initialFirstName = "",
  initialLastName = "",
  triggerLabel = "Update Name",
  action,
}: NameUpdateDialogProps) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (firstName.trim() && lastName.trim()) {
      action({ firstName: firstName.trim(), lastName: lastName.trim() });
      setOpen(false);
    }
  };

  const reset = () => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Name</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div>
            <label className="text-sm text-muted-foreground">First Name</label>
            <Input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Last Name</label>
            <Input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={reset}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!firstName.trim() || !lastName.trim()}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
