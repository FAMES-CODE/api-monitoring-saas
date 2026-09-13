"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { LayoutDashboard, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

type SideRailItem = {
  key: string
  label: string
  href: string
  icon: typeof LayoutDashboard
}

export function SideRail() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Avoids a hydration mismatch: next-themes doesn't know the real
  // theme until after mount, so we render a neutral state until then.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-16 shrink-0 flex-col items-center justify-between py-2 md:flex">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          title="Light mode"
          onClick={() => setTheme("light")}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl transition-colors",
            mounted && theme === "light"
              ? "bg-white text-neutral-900 shadow-md"
              : "bg-neutral-900 text-white hover:bg-neutral-700"
          )}
        >
          <Sun className="h-5 w-5" />
          <span className="sr-only">Light mode</span>
        </button>
        <button
          type="button"
          title="Dark mode"
          onClick={() => setTheme("dark")}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl transition-colors",
            mounted && theme === "dark"
              ? "bg-white text-neutral-900 shadow-md"
              : "bg-neutral-900 text-white hover:bg-neutral-700"
          )}
        >
          <Moon className="h-5 w-5" />
          <span className="sr-only">Dark mode</span>
        </button>
      </div>
    </aside>
  )
}
