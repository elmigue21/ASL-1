
import * as React from "react"
import { useState,useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Countries{
    name:string,
    code:string
}



interface CountriesDropdownProps {
  onSelectCountry: (country: string) => void;
}


export function CountriesDropdown({ onSelectCountry }: CountriesDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [countries, setCountries] = useState<Countries[]>([]);
  useEffect(() => {
    getCountries();
  }, []);
const handleSelect = (currentValue: string) => {
  const selectedCountry =
    countries.find((c) => c.name === currentValue) || null;
  setValue(currentValue === value ? "" : currentValue);
  setOpen(false);
  onSelectCountry(currentValue); // sends value to parent
};

  const getCountries = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/countries`,
        {}
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCountries(data.countries);
      return;
      // return data.countries; // assuming backend returns { countries: [...] }
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      return [];
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? countries.find((country) => country.name === value)?.name
            : "Select country..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." className="h-9" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.name}
                  value={country.name}
                  onSelect={(currentValue) => {
                    handleSelect(currentValue)
                  }}
                >
                  {country.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === country.name ? "opacity-100" : "opacity-0"
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
