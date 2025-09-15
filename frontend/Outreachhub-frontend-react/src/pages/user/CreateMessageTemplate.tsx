import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { z } from "zod";
import { axiosInstance } from "../auth/Login";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CustomFormField from "@/components/CustomFormField";
import { FileUploadField } from "@/components/FileUploadField";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CustomTextarea from "@/components/CustomTextArea";

type TemplateParams = {
  templateId: string;
};

const formSchema = z
  .object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    type: z.enum(["text-image", "text"], {
      message: "You need to select a template type.",
    }),
    templateImage: z.string().url().optional().or(z.literal("")),
    template: z.string().min(10, { message: "Template message must be at least 10 characters." }),
  })
  .superRefine((data, ctx) => {
    if (data.type === "text-image" && !data.templateImage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["templateImage"],
        message: "An image is required for the 'Text & Image' type.",
      });
    }
  });

const CreateMessageTemplate = () => {
  const { templateId } = useParams<TemplateParams>();
  const isEditMode = !!templateId;
  const navigator = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(isEditMode);
  const token = useSelector((state: any) => state.auth.token);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "text-image",
      templateImage: "",
      template: "",
    },
  });

  const templateType = form.watch("type");

  useEffect(() => {
    const loadInitialData = async () => {
      if (isEditMode && templateId && token) {
        setIsLoading(true);
        try {
          const res = await axiosInstance.get(`/message-template/${templateId}`, {
            headers: { authorization: `Bearer ${token}` },
          });
          form.reset(res.data);
        } catch (error) {
          console.error("Error fetching template data:", error);
          toast.error("Failed to load template details.");
        } finally {
          setIsLoading(false);
        }
      } else if (!isEditMode) {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [templateId, isEditMode, token, form.reset]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
      let response;
      if (isEditMode) {
        response = await axiosInstance.patch(`/message-template/${templateId}`, values, { headers: { authorization: `Bearer ${token}` } });
      } else {
        response = await axiosInstance.post('/message-template', values, { headers: { authorization: `Bearer ${token}` } });
      }
      if(response.status === 200 || response.status === 201) {
        toast.success(`Template ${isEditMode ? 'updated' : 'created'} successfully.`);
        navigator('/user/message-templates');
      }else{
        toast.error(`Failed to ${isEditMode ? 'update' : 'create'} template.`);
      }
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} template.`);
      console.error(error);
    }

  };

  if (isLoading) {
    return <div className="p-4">Loading template details...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Message Template" : "Create New Message Template"}</h1>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CustomFormField
            control={form.control}
            fieldname="title"
            label="Template Title"
            placeholder="Welcome Message"
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text-image">Text & Image</SelectItem>
                    {/* --- CHANGED: "text-only" is now "text" --- */}
                    <SelectItem value="text">Text Only</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {templateType === "text-image" && (
            <FileUploadField
              name="templateImage"
              label="Template Image"
              description="Upload an image to be displayed with your template."
            />
          )}
          <CustomTextarea
            control={form.control}
            fieldname="template"
            label="Template Content"
            placeholder="Hello {user}, welcome to our platform! Use placeholders like {user} for dynamic content."
          />
          <Button type="submit">{isEditMode ? "Save Changes" : "Create Template"}</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateMessageTemplate;
