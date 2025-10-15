import { IconCirclePlusFilled, IconDashboard } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Camera, Settings, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
type IconName = "dashboard" | "camera" | "settings" | "sun";

const iconMap: Record<IconName, React.ElementType> = {
  dashboard: IconDashboard,
  camera: Camera,
  settings: Settings,
  sun: Sun,
};

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: string;
  }[];
}) {
  const isAdmin = useSelector<RootState, boolean>(
    (state: RootState) => state.auth.isAdmin,
  );
  const navigate = useNavigate();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {isAdmin && (
              <SidebarMenuButton
                tooltip="Quick Create"
                onClick={() => {
                  navigate("/admin/createWorkspace");
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              >
                <IconCirclePlusFilled />
                <span>Create Workspace</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const IconComponent = item.icon
              ? iconMap[item.icon as IconName]
              : null;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => {
                    navigate(item.url);
                  }}
                >
                  {IconComponent && <IconComponent className="size-5" />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
