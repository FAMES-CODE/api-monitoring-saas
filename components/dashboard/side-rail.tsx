"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Activity,
  CircleHelp,
  LayoutDashboard,
  ListChecks,
  Moon,
  Settings,
  ShieldCheck,
  Siren,
  Sun,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAVIGATION = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Monitors", href: "/monitors", icon: ListChecks },
  { label: "Incidents", href: "/incidents", icon: Siren },
  { label: "Settings", href: "/settings", icon: Settings },
] as const

export function SideRail() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <aside className="sticky top-5 hidden h-[calc(100vh-2.5rem)] w-60 shrink-0 flex-col overflow-hidden rounded-3xl bg-sidebar px-3 py-4 text-sidebar-foreground shadow-[0_18px_45px_-20px_oklch(0.13_0.05_258_/_0.8)] md:flex">
      <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2">
        <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Activity className="size-5" />
        </span>
        <span>
          <span className="block text-sm font-bold tracking-tight">
            Pulse-API
          </span>
          <span className="block text-[11px] font-medium text-sidebar-foreground/50">
            Uptime intelligence
          </span>
        </span>
      </Link>

      <div className="mt-9 px-3 text-[10px] font-bold tracking-[0.16em] text-sidebar-foreground/40 uppercase">
        Workspace
      </div>
      <nav className="mt-2 space-y-1">
        {NAVIGATION.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-black/10"
                  : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-[18px]" />
              {item.label}
              {item.label === "Incidents" ? (
                <span className="ml-auto size-1.5 rounded-full bg-rose-400" />
              ) : null}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-2xl border border-sidebar-border bg-white/5 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <ShieldCheck className="size-4 text-emerald-300" />
            Monitoring active
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-sidebar-foreground/55">
            Your endpoints are checked automatically.
          </p>
        </div>
        <div className="flex items-center justify-between px-2">
          <button
            type="button"
            title="Toggle color theme"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="flex size-9 items-center justify-center rounded-xl text-sidebar-foreground/60 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
            <span className="sr-only">Toggle color theme</span>
          </button>
          <button
            type="button"
            title="Help center"
            className="flex size-9 items-center justify-center rounded-xl text-sidebar-foreground/60 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <CircleHelp className="size-4" />
            <span className="sr-only">Help center</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
