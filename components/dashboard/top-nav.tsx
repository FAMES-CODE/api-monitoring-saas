"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SignOut from "@/components/sign-out"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Monitors", href: "/monitors" },
  { label: "Incidents", href: "/incidents" },
  { label: "Settings", href: "/settings" },
]

type TopNavUser = {
  name?: string | null
  email?: string | null
  image?: string | null
}

export function TopNav({ user }: { user?: TopNavUser | null }) {
  const pathname = usePathname()
  const initials = getInitials(user?.name, user?.email)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900">
        <Activity className="h-5 w-5 text-white" />
      </div>

      <nav className="flex items-center gap-1 rounded-full bg-white p-1 dark:bg-card">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "dark:bg-foreground dark:text-black"
                  : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-full bg-white shadow-sm hover:bg-neutral-100"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-11 w-11 rounded-full bg-white shadow-sm hover:bg-neutral-100"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-rose-500" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-11 w-11">
              <AvatarImage
                src={user?.image ?? undefined}
                alt={user?.name ?? "User"}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm leading-none font-medium">
                {user?.name ?? "My account"}
              </p>
              <p className="mt-1 truncate text-xs text-neutral-500">
                {user?.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <div className="p-1">x</div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }
  if (email) return email[0]?.toUpperCase() ?? "?"
  return "?"
}
