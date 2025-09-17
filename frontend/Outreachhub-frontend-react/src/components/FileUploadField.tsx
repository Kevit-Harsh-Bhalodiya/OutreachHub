import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { axiosInstance } from "@/pages/auth/Login"; // Adjust your import path
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

interface FileUploadFieldProps {
  name: string;
  label: string;
  description?: string;
}

export function FileUploadField({
  name,
  label,
  description,
}: FileUploadFieldProps) {
  // We use useFormContext to get access to form methods like setValue and watch
  const { control, setValue, watch } = useFormContext();
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const token = useSelector((state: any) => state.auth.token);

  // Watch the field value to display the image preview
  const currentImageUrl = watch(name);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post("/aws-s3/image", formData, {
        headers: { "Content-Type": "multipart/form-data","Authorization": `Bearer ${token}` },
        timeout: 10000,
      });

      const imageUrl = response.data.url;

      setValue(name, imageUrl, { shouldValidate: true });
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error("File upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex items-center gap-4">
            {/* Image preview */}
            <Avatar className="h-20 w-20 border">
              <AvatarImage src={currentImageUrl} alt="Image Preview" />
              <AvatarFallback>PIC</AvatarFallback>
            </Avatar>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <FormControl>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  accept="image/png, image/jpeg, image/gif"
                />
              </FormControl>
              {isUploading && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </div>
              )}
            </div>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
// "use client"; // Good practice for components using hooks

// import * as React from "react";
// import { useFormContext } from "react-hook-form";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { axiosInstance } from "@/pages/auth/Login";
// import { Loader2 } from "lucide-react";
// import { useSelector } from "react-redux";

// interface FileUploadFieldProps {
//   name: string;
//   label: string;
//   description?: string;
// }

// export function FileUploadField({ name, label, description }: FileUploadFieldProps) {
//   const { control, setValue, watch } = useFormContext();
//   const [isUploading, setIsUploading] = React.useState<boolean>(false);
//   const token = useSelector((state: any) => state.auth.token);

//   const currentImageUrl = watch(name);

//   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setIsUploading(true);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       // --- THE FIX IS HERE ---
//       const response = await axiosInstance.post("/aws-s3/image", formData, {
//         headers: {
//           // "Content-Type" header is removed.
//           // The browser will now automatically set it to multipart/form-data WITH the correct boundary.
//           "Authorization": `Bearer ${token}`,
//         },
//         timeout: 10000,
//       });

//       const imageUrl = response.data.url;

//       // Update the react-hook-form state with the returned URL
//       setValue(name, imageUrl, { shouldValidate: true });
//       toast.success("Image uploaded successfully!");
//     } catch (error) {
//       console.error("File upload failed:", error);

//       // Provide more specific error feedback if possible
//       const errorMessage = error.response?.data?.message || "File upload failed.";
//       toast.error(errorMessage);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={() => (
//         <FormItem>
//           <FormLabel>{label}</FormLabel>
//           <div className="flex items-center gap-4">
//             <Avatar className="h-20 w-20 border">
//               <AvatarImage src={currentImageUrl} alt="Image Preview" />
//               <AvatarFallback>PIC</AvatarFallback>
//             </Avatar>

//             <div className="grid w-full max-w-sm items-center gap-1.5">
//               <FormControl>
//                 <Input
//                   type="file"
//                   onChange={handleFileChange}
//                   disabled={isUploading}
//                   accept="image/png, image/jpeg, image/gif"
//                 />
//               </FormControl>
//               {isUploading && (
//                 <div className="flex items-center text-sm text-muted-foreground">
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Uploading...
//                 </div>
//               )}
//             </div>
//           </div>
//           {description && <FormDescription>{description}</FormDescription>}
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// }
