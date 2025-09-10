import type { SubmitHandler } from "react-hook-form"
import { useForm, Controller } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux";
import { selectTheme, toggleTheme } from "../../redux/slices/ThemeSwitcher";
import { Moon, Sun } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { login} from "../../redux/slices/authSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { initializeSidebar } from "@/redux/slices/adminDashboardData";
import { setUserId } from "@/redux/slices/userSlice";
type FormInput = {
  email: string,
  password: string
  isAdmin: boolean
}
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  // baseURL: 'https://outreachhub-backend.onrender.com',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
})
const Login = () => {
  const currentTheme = useSelector<RootState, "light" | "dark">(selectTheme);
  const dispatch = useDispatch<AppDispatch>();
  const { control, register, handleSubmit, formState: { errors } } = useForm<FormInput>({
    defaultValues: {
      isAdmin: false
    },
    mode: 'onBlur'
  });
  const navigate = useNavigate()
  const onSubmit: SubmitHandler<FormInput> = async data => {
    try {
      const loginData = {
        email: data.email,
        password: data.password
      }
      let response 
      if(data.isAdmin){
        response = await axiosInstance.post(`/admin/login`, loginData) 
        const adminSidebarData = {
          user: {
            name: response.data.name,
            email: response.data.email,
            avatar: response.data.profilePicture
          },
          navMain: [
            {
              title: "Workspace Management",
              url: "/admin/workspaces",
              active: true,
            },
            {
              title: "User Management",
              url: "/admin/user",
              active: false,
            },
          ],
          navSecondary: [
          ]
        }
        dispatch(initializeSidebar(adminSidebarData ));
      }  else{
        console.log("User Login");
        response = await axiosInstance.post('/user/login', loginData)
        console.log(response);
        localStorage.setItem('permissions',JSON.stringify(response.data.permissions))
        dispatch(setUserId(response.data.userId));
        const userSidebarData = {
          user:{
            name: response.data.name,
            email: response.data.email,
            avatar: response.data.profilePicture
          },
          navMain: [
            {
              title: "Dashboard",
              url: "/user/dashboard",
              active: true,
            },
            {
              title: "Campaigns",
              url: "/user/campaigns",
              active: false,
            },
            {
              title: "Contacts",
              url: "/user/contacts",
              active: false,
            },
            {
              title: "Messsage Templates",
              url: "/user/message-templates",
              active: false,
            },
          ],
          navSecondary: []
        }
        dispatch(initializeSidebar(userSidebarData));
      }
      

      alert('Login Successful')
      dispatch(login({ token: response.data.token, currentWorkspace: null, isAdmin: response.data.isAdmin }))
      navigate(response.data.isAdmin ? '/admin' : '/user')
    } catch (err) {
      alert('Login Failed')
    }
  };

  return (
    <div className={`relative w-screen h-screen overflow-hidden flex items-center justify-center ${currentTheme === 'light' ? 'bg-[#FAFAFA] text-black' : 'bg-[#08080a] text-white'}`}>
      <div className="absolute right-8 top-10 ">
        {
          currentTheme === 'light' ?
            <Sun className="cursor-pointer" onClick={() => { dispatch(toggleTheme()) }}></Sun>
            :
            <Moon className="cursor-pointer" onClick={() => { dispatch(toggleTheme()) }}></Moon>

        }
      </div>
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <span className={`absolute text-[80vw] font-black ${currentTheme === 'light' ? 'text-black/10' : 'text-white/10'} select-none top-[-80%] left-[-30%]`}>X</span>
        <span className={`absolute text-[80vw] font-black ${currentTheme === 'light' ? 'text-black/10' : 'text-white/10'} select-none top-[-70%] left-[70%]`}>O</span>
        <span className={`absolute text-[80vw] font-black ${currentTheme === 'light' ? 'text-black/10' : 'text-white/10'} select-none top-[50%] right-[-27%]`}>X</span>
        <span className={`absolute text-[80vw] font-black ${currentTheme === 'light' ? 'text-black/10' : 'text-white/10'} select-none top-[40%] left-[-20%]`}>O</span>
      </div>

      {/* Signup Card */}
      <div className={`relative z-10 flex flex-col lg:flex-row gap-6 p-8 rounded-2xl shadow-xl w-[90%] max-w-4xl border border-gray-300 ${currentTheme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
        {/* Hero Image Section */}
        <div className="relative flex justify-center items-center w-full lg:w-1/2">
          <img
            src="login-hero-image.jpg"
            alt="OutreachHub Hero"
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute top-5 left-10 text-3xl font-bold text-white drop-shadow-lg">
            OutreachHub
          </div>
        </div>

        {/* Signup Section */}
        <div className="flex flex-col justify-between w-full lg:w-1/2">
          <div className="mb-6">
            <h1 className="text-2xl font-bold transform scale-y-110">
              Login to OutreachHub
            </h1>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <label htmlFor="email" className="font-semibold text-lg">
                Email:
              </label>
              <input
                {...register("email", { required: true,
                  pattern:{
                    value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                    message: "Invalid email address"
                  }
                })}
                type="email"
                id="email"
                placeholder="Enter your email"
                className={`rounded-lg border px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black ${currentTheme === 'light' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
              />
            </div>
            {errors.email && <p className="text-red-900">{errors.email.message}</p>}

            <div className="flex flex-col">
              <label htmlFor="password" className="font-semibold text-lg">
                Password:
              </label>
              <input
                {...register("password", { 
                  required: true,
                  minLength: 3,

                })}
                type="password"
                id="password"
                placeholder="Enter your password"
                className={`rounded-lg border px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black ${currentTheme === 'light' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
              />
            </div>
            {errors.password && <span className="text-red-900">Invalid password</span>}
            <div className="flex gap-2 items-center">
              <Controller
                control={control}
                name="isAdmin"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="isAdmin"
                    />
                    <Label htmlFor="isAdmin" className="text-lg">
                      Admin Login
                    </Label>
                  </div>
                )} />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white rounded-full py-3 mt-4 hover:bg-gray-800 active:bg-gray-900 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

