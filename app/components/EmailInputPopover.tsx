import React,{useState} from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface EmailInputPopoverProps {
  emails: string[];
  addEmail: (email: string) => void;
  removeEmail: (index: number) => void;
}

const EmailInputPopover: React.FC<EmailInputPopoverProps> = ({
  emails,
  addEmail,
  removeEmail,
}) => {

    const [emailInput,setEmailInput] = useState("");

  return (
    <div className="flex items-end flex-1">
      <Popover>
        {/* <PopoverTrigger asChild> */}
          <div className="relative w-full">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center border border-black rounded-md overflow-hidden">
              <Input
                id="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email"
                className=""
              />
              <PopoverTrigger asChild>
              <div className="px-3 text-gray-500 cursor-pointer">▼</div>
              </PopoverTrigger>
            </div>
          </div>
        {/* </PopoverTrigger> */}
        <PopoverContent className="w-[15vw] p-0">
          <ScrollArea className="h-auto w-full rounded-md border p-2">
            <h4 className="text-sm font-semibold mb-2">EMAILS</h4>
            <div className="space-y-1">
              {emails.length > 0 ? (
                emails.map((email, index) => (
                  <div
                    className="flex justify-between items-center"
                    key={index}
                  >
                    <div className="whitespace-nowrap overflow-hidden max-w-[15vw]">
                      {email}
                    </div>
                    <p
                      className="text-red-500 hover:cursor-pointer"
                      onClick={() => removeEmail(index)}
                    >
                      X
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No emails added</p>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <Button
        onClick={() => {
          if (emailInput) {
            addEmail(emailInput);
            setEmailInput("");
          }
        }}
        className="bg-transparent text-[15px] text-black border-black border-1 rounded-full p-2 cursor-pointer hover:bg-slate-500"
      >
        +Email
      </Button>
    </div>
  );
};

export default EmailInputPopover;
