import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { z } from "zod";
import { axiosInstance } from "../auth/Login"; // Adjust import path as needed

import CustomFormField from "@/components/CustomFormField";
import TagInput from "@/components/TagInput";
import { FileUploadField } from "@/components/FileUploadField";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ContactParams = {
  contactId: string;
};

// Zod schema for contact validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  profilePicture: z
    .string()
    .url({ message: "Please upload a valid image." })
    .optional()
    .or(z.literal("")),
  contactInfo: z.object({
    countryCode: z.string().min(2, { message: "Required" }),
    phoneNo: z
      .string()
      .min(10)
      .max(10)
      .regex(/^[0-9]{10}$/, { message: "Phone Number must be 10 digits" }),
    email: z.string().email({ message: "Please enter a valid email." }),
  }),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const CreateContact = () => {
  const { contactId } = useParams<ContactParams>();
  const isEditMode = !!contactId;
  const navigator = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState<boolean>(isEditMode);
  const token = useSelector((state: any) => state.auth.token);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      profilePicture: "",
      contactInfo: {
        countryCode: "+91",
        phoneNo: "",
        email: "",
      },
      company: "",
      jobTitle: "",
      tags: [],
    },
  });

  // Effect to fetch contact data if in edit mode
  useEffect(() => {
    if (isEditMode && contactId) {
      setIsLoading(true);
      axiosInstance
        .get(`/contact/${contactId}`, {
          headers: { authorization: `Bearer ${token}` },
        })
        .then((res) => {
          form.reset(res.data); // Reset form with fetched data
        })
        .catch((err) => {
          console.error("Error fetching contact:", err);
          toast.error("Failed to load contact details.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [contactId, isEditMode, token, form.reset]);

  // Handler for form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let response;
      if (isEditMode) {
        response = await axiosInstance.patch(`/contact/${contactId}`, values, {
          headers: { authorization: `Bearer ${token}` },
        });
      } else {
        response = await axiosInstance.post("/contact", values, {
          headers: { authorization: `Bearer ${token}` },
        });
      }
      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Contact ${isEditMode ? "updated" : "created"} successfully.`,
        );
        navigator("/user/contacts", { state: { from: location } });
      } else {
        toast.error(`Failed to ${isEditMode ? "update" : "create"} contact.`);
      }
      toast.success(
        `Contact ${isEditMode ? "updated" : "created"} successfully!`,
      );
      navigator("/user/contacts", { state: { from: location } }); // Navigate to contacts list page
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? "update" : "create"} contact.`);
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading contact details...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Contact" : "Create New Contact"}
      </h1>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FileUploadField name="profilePicture" label="Profile Picture" />

          <CustomFormField
            control={form.control}
            fieldname="name"
            label="Full Name"
            placeholder="Enter name"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              fieldname="company"
              label="Company"
              placeholder="Enter company name"
            />
            <CustomFormField
              control={form.control}
              fieldname="jobTitle"
              label="Job Title"
              placeholder="Enter Job Title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              fieldname="contactInfo.email"
              label="Email Address"
              ipType="email"
              placeholder="Enter email"
            />
            <div className="flex gap-2">
              <div className="w-1/4">
                <CustomFormField
                  control={form.control}
                  fieldname="contactInfo.countryCode"
                  label="Code"
                />
              </div>
              <div className="w-3/4">
                <CustomFormField
                  control={form.control}
                  fieldname="contactInfo.phoneNo"
                  label="Phone Number"
                  ipType="tel"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          <TagInput
            watch={form.watch}
            setValue={form.setValue}
            name="tags"
            label="Tags"
            placeholder="Add tags..."
          />

          <Button type="submit">
            {isEditMode ? "Save Changes" : "Create Contact"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateContact;
