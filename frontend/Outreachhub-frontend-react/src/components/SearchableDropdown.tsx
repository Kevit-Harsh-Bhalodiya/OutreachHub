// In your SearchableDropdown.tsx file

"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// --- FIX 1: Correct the imports to use your local Shadcn UI components ---
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
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export interface DropdownOption {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  control: any;
  name: string;
  label: string;
  options: DropdownOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundText?: string;
  description?: string;
  rules?: object; 
}

export function SearchableDropdown({
  control,
  name,
  label,
  options,
  description,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  notFoundText = "No results found.",
  rules={},
}: SearchableDropdownProps) { // Removed 'rules' from destructuring
  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <FormField
      control={control}
      name={name}
      rules={rules} 
      // --- FIX 2: Remove the 'rules' prop from FormField ---
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[300px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? options.find((option) => option.value === field.value)?.label
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder={searchPlaceholder} />
                <CommandList>
                  <CommandEmpty>{notFoundText}</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => {
                          field.onChange(option.value);
                          setOpen(false); // Close popover on select
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === option.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
