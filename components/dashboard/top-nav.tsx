"use client"

import { usePathname } from "next/navigation"
import { Bell, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type TopNavUser = {
  name?: string | null
  email?: string | null
  image?: string | null
}

export function TopNav({ user }: { user?: TopNavUser | null }) {
  const pathname = usePathname()
  const initials = getInitials(user?.name, user?.email)
  const pageTitle = pathname.startsWith("/monitors")
    ? "Monitors"
    : pathname.startsWith("/incidents")
      ? "Incidents"
      : "Overview"

  return (
    <header className="flex min-h-16 flex-wrap items-center justify-between gap-4 py-3">
      <div>
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Workspace / {pageTitle}
        </p>
        <p className="mt-1 text-lg font-bold tracking-tight md:hidden">Pulseboard</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl border border-border/80 bg-card shadow-sm hover:bg-accent"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-xl border border-border/80 bg-card shadow-sm hover:bg-accent"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-rose-500" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl border border-border/80 bg-card py-1 pr-2 pl-1 shadow-sm transition hover:bg-accent">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.image ?? undefined}
                alt={user?.name ?? "User"}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden max-w-28 truncate text-left text-xs font-semibold sm:block">
              {user?.name ?? "My account"}
            </span>
            <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 p-2">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-2 font-normal">
                <p className="text-sm leading-none font-semibold">
                  {user?.name ?? "My account"}
                </p>
                <p className="mt-1.5 truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="mt-1 text-muted-foreground">
                Account settings coming soon
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
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
