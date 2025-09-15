import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"


type CustomFormFieldProps = {
  description?: string;
  rules?: object;
  ipType?: string;
  placeholder?: string;
  control: any;
  fieldname: string;
  label: string;
}
const CustomFormField = ({ description = "", rules, ipType, placeholder, control, fieldname, label }: CustomFormFieldProps) => {
  return (
    <FormField
      control={control}
      name={fieldname}
      rules={rules}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={ipType} placeholder={placeholder} {...field} />
          </FormControl>
          {
            description !== "" &&
            <FormDescription>
              {description ?? ""}
            </FormDescription>
          }
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CustomFormField
