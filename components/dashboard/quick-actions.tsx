import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icon, Plus } from "lucide-react"

type QuickActions = {
  name: string
  description: string
  icon: string
}

const ACTIONS: QuickActions[] = [
  {
    name: "Create a monitor",
    description: "Create an endpoint to monitor",
    icon: "Plus",
  },
  { name: "View all", description: "View all your endpoint", icon: "Plus" },
  {
    name: "Check incidents",
    description: "View all recent incidents",
    icon: "Plus",
  },
]

export function QuickActions({ action = ACTIONS }: { action?: QuickActions[] }) {
  return (
    <Card className="rounded-3xl border-none shadow-sm">
      <CardHeader>
        <CardTitle>Team activity</CardTitle>
        <CardDescription>Incident resolution rate, last 7 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {action.map((action) => (
          <div key={action.name} className="flex items-center gap-3">
            <Plus />
            <div>
              <h1 className="text-xl">{action.name}</h1>
              <p className="text-neutral-500">{action.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
