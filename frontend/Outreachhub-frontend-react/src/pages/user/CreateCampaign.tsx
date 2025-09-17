import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { z } from "zod"; // Use 'z' directly
import { axiosInstance } from "../auth/Login";
import CustomFormField from "@/components/CustomFormField";
import TagInput from "@/components/TagInput";
import { DatePickerField } from "@/components/DatePickerField"; // This is now your date-time picker
import { SearchableDropdown } from "@/components/SearchableDropdown";
import { fetchMessageTemplates } from "@/redux/slices/messageTemplateSlice";
import { Button } from "@/components/ui/button";
import type { AppDispatch } from "@/redux/store";

type CampaignParams = {
  campaignId: string;
};

// This schema is already correct for the updated component
const formSchema = z.object({
  templateId: z.string().min(1, { message: "Please select a template" }),
  name: z.string()
    .min(2, { message: "Campaign name should be at least 2 characters" })
    .max(50, { message: "Campaign name should be at most 50 characters" }),
  tags: z.array(z.string()).optional(),
  // status: z.enum(['Draft', 'Running', 'Completed']),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid start date" }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid end date" }),
});


const CreateCampaign = () => {
  const { campaignId } = useParams<CampaignParams>();
  const isEditMode = !!campaignId;
  const navigator = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { templates } = useSelector((state: any) => state.messageTemplate);
  const token = useSelector((state: any) => state.auth.token);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateId: "",
      name: "",
      tags: [],
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    },
  });

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      // Fetch templates
      await dispatch(fetchMessageTemplates());

      // If in edit mode, fetch the specific campaign data
      if (isEditMode && campaignId) {
        try {
          const res = await axiosInstance.get(`/campaign/${campaignId}`, { headers: { authorization: `Bearer ${token}` } });
          const campaignData = res.data;
          form.reset({
            templateId: campaignData.templateId,
            name: campaignData.name,
            tags: campaignData.tags,
            startDate: campaignData.startDate, // Already an ISO string
            endDate: campaignData.endDate,     // Already an ISO string
          });
        } catch (error) {
          console.error("Error fetching campaign data:", error);
        }
      }
      setIsLoading(false);
    }

    loadInitialData();
  }, [dispatch, campaignId, isEditMode, token, form.reset]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // 'values' object already contains startDate and endDate as ISO strings.
    // No conversion is needed!
    console.log("Submitting ISO strings:", values);
    let response;
    if (isEditMode) {
      response = await axiosInstance.patch(`/campaign/${campaignId}`, values, { headers: { authorization: `Bearer ${token}` } });
      console.log(response)
    } else {
      response = await axiosInstance.post('/campaign', values, { headers: { authorization: `Bearer ${token}` } });
    }
    if (response.status === 200 || response.status === 201) {
      alert(`Campaign ${isEditMode ? 'updated' : 'created'} successfully`);
      form.reset();
      navigator('/user/campaigns',{state:{from:location}}); // Navigate to a relevant page
    } else {
      alert(`Failed to ${isEditMode ? 'update' : 'create'} campaign`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Campaign" : "Create New Campaign"}</h1>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SearchableDropdown
            control={form.control}
            name="templateId"
            label="Select Message Template"
            placeholder="Search and select template"
            options={templates.map((template: any) => ({
              label: template.title,
              value: template._id,
            }))}
          />
          <CustomFormField
            control={form.control}
            fieldname="name"
            label="Campaign Name"
            ipType="text"
            placeholder="Enter campaign name"
          />
          <TagInput watch={form.watch} setValue={form.setValue} name="tags" label="Tags" placeholder="Add tags" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DatePickerField
              control={form.control}
              name="startDate"
              label="Start Date & Time"
            />
            <DatePickerField
              control={form.control}
              name="endDate"
              label="End Date & Time"
            />
          </div>
          
          <Button type="submit">{isEditMode ? "Save Changes" : "Create Campaign"}</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateCampaign;
