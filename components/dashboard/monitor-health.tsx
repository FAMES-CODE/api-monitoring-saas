import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


type Incident = {
  label: string
  time: number
  returnedStatus: number
}

const DATA: Incident[] = [
  {
    label: "Github API",
    time: 99,
    returnedStatus: 503,
  },
  {
    label: "My Website API",
    time: 65,
    returnedStatus: 503,
  },
]

export function MonitorHealth() {
  return (
    <Card className="rounded-3xl border-none shadow-sm">
      <CardHeader>
        <CardTitle>Recent incidents</CardTitle>
        <CardDescription>Recent incidents across all monitors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {DATA.map((data) => (
          <div key={data.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="">{data.label}</span>
              <span className="font-medium">1 Min Ago</span>
            </div>
            <div>
              <p className="text-primary">
                Return : <span>{data.returnedStatus}</span>
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
