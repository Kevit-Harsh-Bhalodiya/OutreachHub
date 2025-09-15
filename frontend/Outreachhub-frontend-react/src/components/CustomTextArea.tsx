"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea

interface CustomTextareaFieldProps {
  control: any;
  fieldname: string;
  label: string;
  placeholder: string;
  description?: string;
}

const CustomTextarea = ({
  control,
  fieldname,
  label,
  placeholder,
  description = "",
}: CustomTextareaFieldProps) => {
  return (
    <FormField
      control={control}
      name={fieldname}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className="resize-none" // Optional: prevent resizing
              {...field}
            />
          </FormControl>
          {description && (
            <FormDescription>{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomTextarea;
