import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { selectTheme, toggleTheme } from "@/redux/slices/ThemeSwitcher"
import type { RootState } from "@/redux/store"
import { Moon, Sun } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

export function SiteHeader() {
  const dispatch = useDispatch()
  const currentTheme = useSelector<RootState,'light'|'dark'>(selectTheme);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Welcome {localStorage.getItem('username')??""}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" onClick={()=>{dispatch(toggleTheme())}} asChild size="sm" className="hidden sm:flex">
            <div
              rel="noopener noreferrer"
              className="dark:text-foreground"
            >
                    {currentTheme === "light" ? <Sun /> : <Moon />}
            </div>
          </Button>
        </div>
      </div>
    </header>
  )
}
