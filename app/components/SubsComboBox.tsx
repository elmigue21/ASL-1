"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  // CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";

import { useNewSubDateRange } from "../context/NewSubDateRangeContext";

const frameworks = [
  {
    value: "7d",
  },
  {
    value: "1m",
  },
  {
    value: "6m",
  },
  {
    value: "1y",
  },
];


export function SubsComboBox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<"7d" | "1m" | "6m" | "1y">("7d");
    const {setDateRange} = useNewSubDateRange();

    useEffect(()=>{
        setDateRange(value)
    },[value, setDateRange])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between hover:cursor-pointer"
          
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.value
            : frameworks[0].value}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {/* <CommandInput placeholder="Search framework..." className="h-9" /> */}
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                className="hover:cursor-pointer hover:scale-110 transition-all duration-300"
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(
                      currentValue === value
                        ? "7d"
                        : (currentValue as "7d" | "1m" | "6m" | "1y")
                    );
                    setOpen(false);
                  }}
                >
                  {framework.value}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
