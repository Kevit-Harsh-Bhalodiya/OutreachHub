import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
// import Navbar from "../components/Navbar"

const Admin= () => {
  return (
    <div>
      <SidebarProvider style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
      }>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
              <Outlet/>
        </SidebarInset>

      </SidebarProvider>

    </div>
  )
}

export default Admin

