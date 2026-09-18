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
    href: "/incidents",
    icon: AlertTriangle,
  },
] as const

export function QuickActions() {
  return (
    <Card className="app-surface">
      <CardHeader>
        <CardTitle className="font-bold">Quick actions</CardTitle>
        <CardDescription>Jump back into monitoring work</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.name}
              href={action.href}
              className="interactive-row flex items-center gap-3 rounded-xl p-2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
