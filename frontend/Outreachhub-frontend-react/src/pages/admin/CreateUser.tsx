import CustomFormField from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { axiosInstance } from "../auth/Login";
import { useSelector } from "react-redux";
import { useEffect} from "react";
import { FileUploadField } from "@/components/FileUploadField";

const formSchema = z.object({
  name: z.string().min(2, { message: "Username should be at least 2 characters" }
  ).max(50,
    { message: "Username should be at most 50 characters" }
  ),
  password: z.string().min(8).max(100).optional().or(z.literal('')),
  countryCode: z.string().min(1).max(5),
  email: z.string().email(),
  phoneNo: z.string().min(10).max(10).regex(/^[0-9]{10}$/, { message: "Phone Number must be 10 digits" }),
  profilePicture: z.string().optional()
})

type UserRouteParams = {
  userId: string;
};
const CreateUser = () => {
  const { userId } = useParams<UserRouteParams>()
  const isEditMode = !!userId;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      password: '',
      countryCode: '',
      email: '',
      phoneNo: '',
      profilePicture: ''
    }
  })
  const token = useSelector((state: any) => state.auth.token)
  useEffect(() => {
    const fetchUserData = async () => {
      if (isEditMode) {
        try {
          const res = await axiosInstance.get(`/user/${userId}`, { headers: { authorization: `Bearer ${token}` } })
          if (res.status === 200) {
            const userData = res.data;
            form.reset({
              name: userData.name,
              password: '',
              countryCode: userData.contactInfo.countryCode.replace('+', ''),
              email: userData.contactInfo.email,
              phoneNo: userData.contactInfo.phoneNo
            });
          }
          else {
            alert("Error fetching user data")
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          alert("Error fetching user data")
        }
      }
    }
    fetchUserData();
  }, [userId, isEditMode, token, form])
  async function onSubmit(value: z.infer<typeof formSchema>) {
    console.log(value)
    const formData = {
      name: value.name,
      password: value.password,
      profilePicture: value.profilePicture,
      contactInfo: {
        countryCode: "+" + value.countryCode,
        email: value.email,
        phoneNo: value.phoneNo
      }
    }
    let res;
    if (isEditMode) {
      res = await axiosInstance.put(`/user/update/${userId}`, formData, { headers: { authorization: `Bearer ${token}` } })
    } else {
      res = await axiosInstance.post('/user/create', formData, { headers: { authorization: `Bearer ${token}` } })
    }
    console.log(res.data);
    if (res.status === 201) {
      alert(isEditMode ? "User updated successfully" : "User created successfully")
      form.reset()
    }
    else {
      alert(isEditMode ? "Error updating user" : "Error creating user")
    }

  }
  return (
    <>
      <div className="container mx-auto p-4 ">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FileUploadField name="profilePicture" label="Profile Picture" />
            <CustomFormField
              control={form.control}
              fieldname="name"
              label="Username"
              description={""}
              rules={{ required: "Username is required" }}
              ipType="text"
              placeholder="Enter username"
            />
            <CustomFormField
              control={form.control}
              fieldname="password"
              label="Password"
              description={""}
              rules={{ required: "Password is required" }}
              ipType="password"
              placeholder="Enter password"
            />
            <CustomFormField
              control={form.control}
              fieldname="countryCode"
              label="Country Code"
              description={""}
              rules={{ required: "Country Code is required", pattern: { value: /^[0-9]{1,5}$/, message: "Country Code must be 1 to 5 digits" } }}
              ipType="number"
              placeholder="Enter country code"
            />
            <CustomFormField
              control={form.control}
              fieldname="email"
              label="Email"
              description={""}
              rules={{ required: "Email is required" }}
              ipType="email"
              placeholder="Enter email"
            />
            <CustomFormField
              control={form.control}
              fieldname="phoneNo"
              label="Phone Number"
              description={""}
              rules={{ required: "Phone Number is required", pattern: { value: /^[0-9]{10}$/, message: "Phone Number must be 10 digits" } }}
              ipType="text"
              placeholder="Enter phone number"
            />
            <Button type="submit">Submit</Button>
          </form>
        </FormProvider>
      </div>
    </>
  )
}

export default CreateUser
