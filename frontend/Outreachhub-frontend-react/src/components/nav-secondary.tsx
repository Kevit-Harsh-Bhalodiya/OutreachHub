import * as React from "react"
import { IconDashboard } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Camera, Settings, Sun } from "lucide-react";
import type { NavLink } from "@/redux/slices/adminDashboardData";

type IconName = 'dashboard' | 'camera' | 'settings' | 'sun';
const iconMap: Record<IconName, React.ElementType> = {
  'dashboard':IconDashboard,
  'camera': Camera,
  'settings': Settings,
  'sun': Sun,
};
export function NavSecondary({
  items,
  ...props
}: {
  items: NavLink[] 
  } & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const IconComponent = item.icon ? iconMap[item.icon as IconName] : null;
            return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  {IconComponent && <IconComponent className="size-5"/>}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
