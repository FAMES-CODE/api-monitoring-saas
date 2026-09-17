import Link from "next/link"
import { AlertTriangle, List, Plus } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ACTIONS = [
  {
    name: "Create a monitor",
    description: "Watch a new HTTP endpoint",
    href: "/monitors/new",
    icon: Plus,
  },
  {
    name: "View all monitors",
    description: "Open the full monitor list",
    href: "/monitors",
    icon: List,
  },
  {
    name: "Check incidents",
    description: "Jump to failing endpoints",
    href: "/monitors",
    icon: AlertTriangle,
  },
] as const

export function QuickActions() {
  return (
    <Card className="rounded-3xl border-none shadow-sm">
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump back into monitoring work</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.name}
              href={action.href}
              className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-neutral-50 dark:hover:bg-muted/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-muted">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium">{action.name}</p>
                <p className="text-sm text-neutral-500">{action.description}</p>
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
