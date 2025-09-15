import React from "react";
import { useSelector } from "react-redux";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"; // Assuming these are in a local file
import { IconInnerShadowTop } from "@tabler/icons-react"; // Or your own logo icon
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import type { RootState } from "@/redux/store";
import { selectIsAdmin } from "@/redux/slices/authSlice";
import { Link } from "react-router-dom";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isAdmin = useSelector<RootState, boolean>(selectIsAdmin);
  const { user, navMain, navSecondary } = useSelector((state: RootState) => state.adminSidebar)

  if (!user || !navMain || !navSecondary) {
    return <div>No data</div>;
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to={isAdmin ? "/admin" : "/user"}>
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">OutreachHub</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
