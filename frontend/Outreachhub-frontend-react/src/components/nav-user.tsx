import {
  IconDotsVertical,
  IconLogout,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { axiosInstance } from "@/pages/auth/Login"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { logout, selectIsAdmin, selectIsLoggedIn } from "@/redux/slices/authSlice"
import { useNavigate } from "react-router-dom"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
    profilePicture?: string
  }
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdmin = useSelector<RootState, boolean>(selectIsAdmin);
  const isLoggedIn = useSelector<RootState, boolean>(selectIsLoggedIn);
  const token = useSelector<RootState, string | null>((state:RootState) => state.auth.token);
  const hanldeLogout = async () =>{
    try{
      let response;
      if(!isLoggedIn){
        navigate('/login')
        return
      }else{
        if(isAdmin){
          dispatch(logout());
          response = await axiosInstance.post('/admin/logout',{},{
            headers:{authorization: `Bearer ${token}`}
          })
          if(response.status === 200){
            navigate('/login')
          }
        }else{
          dispatch(logout());
          response = await axiosInstance.post('/user/logout',{},{
            headers:{authorization: `Bearer ${token}`}
          })
          if(response.status === 200){
            navigate('/login')
          }
        }
      }
      if(response.status === 200){
        navigate('/login')
      }
    }catch(error){
      console.error("Logout failed:", error)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar??user.profilePicture} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=>{hanldeLogout()}} >
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
