import CustomFormField from "@/components/CustomFormField";
import TagInput from "@/components/TagInput";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod"
import { axiosInstance } from "../auth/Login";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const workspaceSchema = z.object({
  name: z.string().min(4, { message: "Workspace Name should be atlease 4 characters" }).max(20),
  description: z.string().min(10, { message: "Workspace Description should be atlease 10 characters" }).max(100).optional(),
  tags: z.array(z.string()).optional()
})
type WorkspaceRouteParams = {
  workspaceId: string;
}
const CreateWorkspace = () => {
  const { workspaceId } = useParams<WorkspaceRouteParams>();
  const isEditMode = !!workspaceId;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof workspaceSchema>>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: []
    }
  });
  const token = useSelector((state: any) => state.auth.token)
  const navigator = useNavigate();
  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        setIsLoading(true);
        if (isEditMode) {
          const res = await axiosInstance.get(`/workspace/${workspaceId}`, { headers: { authorization: `Bearer ${token}` } })
          if (res.status === 200) {
            const workspaceData = res.data;
            form.reset({
              name: workspaceData.name,
              description: workspaceData.description,
              tags: workspaceData.tags || []
            })
          } else {
            alert("Error fetching workspace data")
          }
        }
      } catch (error) {
        console.error("Error fetching workspace data:", error)
        alert("Error fetching workspace data")
      } finally {
        setIsLoading(false);
      }
    }
    fetchWorkspaceData();
  }, [workspaceId, isEditMode, token, form])
  async function onSubmit(values: z.infer<typeof workspaceSchema>) {
    let response;
    if(isEditMode){
      response = await axiosInstance.patch(`/workspace/${workspaceId}`, values, { headers: { 'Authorization': `Bearer ${token}` } })
    }else{
    response = await axiosInstance.post("/workspace/create", values, { headers: { 'Authorization': `Bearer ${token}` } })
    }
    if (response.status === 201 || response.status === 200) {
      alert(isEditMode ? "Workspace Updated Successfully" : "Workspace Created Successfully")
      form.reset()
      navigator("/admin/workspaces")
    }
    else {
      alert(isEditMode ? "Error updating workspace" : "Error creating workspace")
      navigator("/admin/workspaces")
    }
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="container mx-auto p-4 ">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              control={form.control}
              fieldname="name"
              label="Workspace Name"
              description={""}
              rules={{ required: "Workspace Name is required" }}
              ipType="text"
              placeholder="Enter Workspace Name"
            />
            <CustomFormField
              control={form.control}
              fieldname="description"
              label="Workspace Description"
              description={""}
              rules={{ required: "Workspace Description is required" }}
              ipType="text"
              placeholder="Enter Workspace Description"
            />
            <TagInput watch={form.watch} setValue={form.setValue} name="tags" label="Enter Tags" placeholder="Enter tags" />
            <Button type="submit">Submit</Button>
          </form>
        </FormProvider>
      </div>
    </>
  )
}

export default CreateWorkspace
