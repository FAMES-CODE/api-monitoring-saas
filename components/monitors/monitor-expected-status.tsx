import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function MonitorExpectedStatus({ status }: { status: number }) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Expected status</CardTitle>
        <CardDescription>
          HTTP code that marks a check as successful.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{status}</p>
      </CardContent>
    </Card>
  )
}
