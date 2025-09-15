
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DatePickerFieldProps {
  control: any;
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  rules?: object; // Note: 'rules' is not used by Shadcn's FormField but kept for reference
}

export function DatePickerField({
  control,
  name,
  label,
  description,
}: DatePickerFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedDate = field.value && !isNaN(new Date(field.value).getTime())
          ? new Date(field.value)
          :undefined;

        const handleDateSelect = (date: Date | undefined) => {
          if (!date) return;
          // When a new date is selected, combine it with the existing time
          const currentHours = selectedDate?.getHours() || 0;
          const currentMinutes = selectedDate?.getMinutes() || 0;
          const newDate = new Date(date);
          newDate.setHours(currentHours, currentMinutes);
          // Pass the updated date back to the form as a full ISO string
          field.onChange(newDate.toISOString());
        };
        
        const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, unit: 'hours' | 'minutes') => {
            const value = parseInt(e.target.value, 10);
            const newDate = selectedDate ? new Date(selectedDate) : new Date();

            if (!isNaN(value)) {
                if (unit === 'hours' && value >= 0 && value <= 23) {
                    newDate.setHours(value);
                } else if (unit === 'minutes' && value >= 0 && value <= 59) {
                    newDate.setMinutes(value);
                }
                field.onChange(newDate.toISOString());
            }
        };

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="Select date and time"
                      readOnly
                      // --- CHANGED: Format to show date and time ---
                      value={selectedDate ? format(selectedDate, "PPP HH:mm") : ""}
                      className="w-full pr-8"
                    />
                  </FormControl>
                  <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect} // Use our custom handler
                />
                {/* --- ADDED: Time input section --- */}
                <div className="p-2 border-t border-border flex items-center justify-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    className="w-16"
                    placeholder="HH"
                    value={selectedDate ? String(selectedDate.getHours()).padStart(2, '0') : "00"}
                    onChange={(e) => handleTimeChange(e, 'hours')}
                  />
                  :
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    className="w-16"
                    placeholder="MM"
                    value={selectedDate ? String(selectedDate.getMinutes()).padStart(2, '0') : "00"}
                    onChange={(e) => handleTimeChange(e, 'minutes')}
                  />
                </div>
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  );
}
