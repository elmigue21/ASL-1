import React,{useState} from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface PhoneInputPopoverProps {
  phones: string[];
  addPhone: (email: string) => void;
  removePhone: (index: number) => void;
}

const PhoneInputPopover: React.FC<PhoneInputPopoverProps> = ({
  phones,
  addPhone,
  removePhone,
}) => {

    const [phoneInput,setPhoneInput] = useState("");

  return (
    <div className="flex items-end flex-1">
      <Popover>
        {/* <PopoverTrigger asChild> */}
          <div className="relative w-full">
            <Label htmlFor="phone">Phone</Label>
            <div className="flex items-center border border-black rounded-md overflow-hidden">
              <Input
              type="number"
                id="phone"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Enter phone"
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
            <h4 className="text-sm font-semibold mb-2">PHONES</h4>
            <div className="space-y-1">
              {phones.length > 0 ? (
                phones.map((phone, index) => (
                  <div
                    className="flex justify-between items-center"
                    key={index}
                  >
                    <div className="whitespace-nowrap overflow-hidden max-w-[15vw]">
                      {phone}
                    </div>
                    <p
                      className="text-red-500 hover:cursor-pointer"
                      onClick={() => removePhone(index)}
                    >
                      X
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No Phones added</p>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <Button
        onClick={() => {
          if (phoneInput) {
            addPhone(phoneInput);
            setPhoneInput("");
          }
        }}
        className="bg-transparent text-[15px] text-black border-black border-1 rounded-full p-2 cursor-pointer hover:bg-slate-500"
      >
        +Phone
      </Button>
    </div>
  );
};

export default PhoneInputPopover;
